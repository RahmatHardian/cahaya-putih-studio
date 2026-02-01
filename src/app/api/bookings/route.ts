import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createBookingCode,
  calculateDPDeadline,
  calculateDPAmount,
} from "@/lib/booking";
import { createAuditLog } from "@/lib/audit";
import { getClientIP } from "@/lib/rate-limit";

const bookingSchema = z.object({
  packageId: z.string().uuid(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eventType: z.string().min(1),
  eventLocation: z.string().min(3),
  clientName: z.string().min(3),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(10),
  clientAddress: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = bookingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Data tidak valid",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const eventDate = new Date(data.eventDate);

    // Check if date is in the future
    if (eventDate < new Date()) {
      return NextResponse.json(
        { success: false, error: "Tanggal harus di masa depan" },
        { status: 400 }
      );
    }

    // Get package details
    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId, isActive: true },
      include: { service: true },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if date is available
    const existingSlot = await prisma.calendarSlot.findUnique({
      where: { date: eventDate },
    });

    if (existingSlot && existingSlot.status !== "AVAILABLE") {
      return NextResponse.json(
        { success: false, error: "Tanggal tidak tersedia" },
        { status: 400 }
      );
    }

    // Generate booking identifiers
    const accessToken = createAccessToken();
    const bookingCode = createBookingCode(eventDate);
    const totalPrice = Number(pkg.price);
    const dpAmount = calculateDPAmount(totalPrice, pkg.dpPercentage);
    const dpDeadline = calculateDPDeadline();

    // Create package snapshot
    const packageSnapshot = {
      id: pkg.id,
      name: pkg.name,
      serviceName: pkg.service.name,
      price: totalPrice,
      dpPercentage: pkg.dpPercentage,
      inclusions: pkg.inclusions,
    };

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        accessToken,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientAddress: data.clientAddress,
        eventType: data.eventType,
        eventDate,
        eventLocation: data.eventLocation,
        notes: data.notes,
        packageId: pkg.id,
        packageSnapshot,
        totalPrice,
        dpAmount,
        dpDeadline,
        status: "INVOICE_GENERATED",
      },
    });

    // Create or update calendar slot (reserve it temporarily)
    await prisma.calendarSlot.upsert({
      where: { date: eventDate },
      update: {}, // Don't change status yet - only lock after DP approval
      create: {
        date: eventDate,
        status: "AVAILABLE",
      },
    });

    // Create audit log
    await createAuditLog({
      actorType: "CLIENT",
      actorName: data.clientName,
      entityType: "BOOKING",
      entityId: booking.id,
      action: "CREATED",
      newValues: {
        bookingCode,
        packageName: pkg.name,
        eventDate: data.eventDate,
        totalPrice,
        dpAmount,
      },
      ipAddress: getClientIP(request.headers),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        accessToken: booking.accessToken,
        status: booking.status,
        dpAmount,
        dpDeadline: booking.dpDeadline.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat booking" },
      { status: 500 }
    );
  }
}
