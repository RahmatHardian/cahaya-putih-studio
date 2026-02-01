import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const booking = await prisma.booking.findUnique({
      where: { accessToken: token },
      include: {
        package: {
          include: {
            service: {
              select: { name: true },
            },
          },
        },
        paymentProofs: {
          orderBy: { uploadedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform dates and decimals for JSON
    const response = {
      id: booking.id,
      bookingCode: booking.bookingCode,
      status: booking.status,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      eventType: booking.eventType,
      eventDate: booking.eventDate.toISOString().split("T")[0],
      eventLocation: booking.eventLocation,
      notes: booking.notes,
      packageSnapshot: booking.packageSnapshot,
      totalPrice: Number(booking.totalPrice),
      dpAmount: Number(booking.dpAmount),
      dpDeadline: booking.dpDeadline.toISOString(),
      invoiceGeneratedAt: booking.invoiceGeneratedAt.toISOString(),
      dpApprovedAt: booking.dpApprovedAt?.toISOString() || null,
      cancelledAt: booking.cancelledAt?.toISOString() || null,
      cancellationReason: booking.cancellationReason,
      paymentProofs: booking.paymentProofs.map((proof) => ({
        id: proof.id,
        fileName: proof.fileName,
        verificationStatus: proof.verificationStatus,
        rejectionReason: proof.rejectionReason,
        uploadedAt: proof.uploadedAt.toISOString(),
        verifiedAt: proof.verifiedAt?.toISOString() || null,
      })),
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data booking" },
      { status: 500 }
    );
  }
}
