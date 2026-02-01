import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPaymentProof, validateFile } from "@/lib/storage";
import { checkRateLimit, getClientIP, formatRetryAfter } from "@/lib/rate-limit";
import { logFileUpload, logBookingStatusChange } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const bookingToken = formData.get("bookingToken") as string | null;
    const bankName = formData.get("bankName") as string | null;
    const accountName = formData.get("accountName") as string | null;
    const transferAmount = formData.get("transferAmount") as string | null;
    const transferDate = formData.get("transferDate") as string | null;

    // Validate required fields
    if (!file || !bookingToken) {
      return NextResponse.json(
        { success: false, error: "File dan booking token diperlukan" },
        { status: 400 }
      );
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { accessToken: bookingToken },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if upload is allowed
    if (booking.status !== "INVOICE_GENERATED" && booking.status !== "DP_REJECTED") {
      return NextResponse.json(
        { success: false, error: "Upload bukti pembayaran tidak diizinkan untuk status ini" },
        { status: 400 }
      );
    }

    // Check rate limit
    const clientIP = getClientIP(request.headers);
    const rateLimitResult = await checkRateLimit(booking.id, "UPLOAD_PAYMENT_PROOF");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak upload. Coba lagi dalam ${formatRetryAfter(rateLimitResult.retryAfterMs!)}`,
        },
        { status: 429 }
      );
    }

    // Upload file to storage
    // Note: In production, this would upload to Supabase Storage
    // For now, we'll simulate the upload
    const fileUrl = `/uploads/${booking.id}/${file.name}`;
    const storageKey = `${booking.id}/${Date.now()}-${file.name}`;

    // Create payment proof record
    const paymentProof = await prisma.paymentProof.create({
      data: {
        bookingId: booking.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl,
        storageKey,
        bankName: bankName || null,
        accountName: accountName || null,
        transferAmount: transferAmount ? parseFloat(transferAmount) : null,
        transferDate: transferDate ? new Date(transferDate) : null,
        verificationStatus: "PENDING",
      },
    });

    // Update booking status
    const oldStatus = booking.status;
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "WAITING_VERIFICATION" },
    });

    // Create audit logs
    await logFileUpload(
      booking.id,
      paymentProof.id,
      booking.clientName,
      {
        ipAddress: clientIP,
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    await logBookingStatusChange(
      booking.id,
      oldStatus,
      "WAITING_VERIFICATION",
      { type: "CLIENT", name: booking.clientName },
      {
        ipAddress: clientIP,
        userAgent: request.headers.get("user-agent") || undefined,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        paymentProofId: paymentProof.id,
        status: "WAITING_VERIFICATION",
        message: "Bukti pembayaran berhasil diupload",
      },
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengupload bukti pembayaran" },
      { status: 500 }
    );
  }
}
