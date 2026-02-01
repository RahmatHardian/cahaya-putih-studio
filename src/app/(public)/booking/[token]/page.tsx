import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime, getStatusLabel, getStatusColor, getRemainingTime, isWithinDeadline } from "@/lib/booking";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  CreditCard,
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/booking/CopyButton";
import { PaymentInfo } from "@/components/booking/PaymentInfo";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getBooking(token: string) {
  const booking = await prisma.booking.findUnique({
    where: { accessToken: token },
    include: {
      package: {
        include: {
          service: { select: { name: true } },
        },
      },
      paymentProofs: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  });
  return booking;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const booking = await getBooking(token);

  if (!booking) {
    return { title: "Booking Tidak Ditemukan" };
  }

  return {
    title: `Booking ${booking.bookingCode}`,
    description: `Status booking ${booking.bookingCode} - ${getStatusLabel(booking.status)}`,
  };
}

export default async function BookingTrackingPage({ params }: PageProps) {
  const { token } = await params;
  const booking = await getBooking(token);

  if (!booking) {
    notFound();
  }

  const packageSnapshot = booking.packageSnapshot as {
    name: string;
    serviceName: string;
    inclusions: string[];
  };

  const canUploadProof =
    booking.status === "INVOICE_GENERATED" ||
    booking.status === "DP_REJECTED";

  const latestProof = booking.paymentProofs[0];

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-medium text-gold">Booking ID</span>
            <span className="font-mono font-bold text-navy">{booking.bookingCode}</span>
            <CopyButton text={booking.bookingCode} />
          </div>

          <h1 className="font-cormorant text-3xl md:text-4xl font-bold text-navy mb-4">
            {booking.status === "INVOICE_GENERATED" && "Invoice Booking Anda"}
            {booking.status === "WAITING_VERIFICATION" && "Menunggu Verifikasi Pembayaran"}
            {booking.status === "DP_APPROVED" && "Pembayaran Disetujui!"}
            {booking.status === "DP_REJECTED" && "Pembayaran Ditolak"}
            {booking.status === "CANCELLED" && "Booking Dibatalkan"}
          </h1>

          {/* Status Badge */}
          <Badge className={cn("text-sm px-4 py-1", getStatusColor(booking.status))}>
            {getStatusLabel(booking.status)}
          </Badge>
        </FadeInOnScroll>

        {/* Status Timeline */}
        <FadeInOnScroll className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between">
              {["INVOICE_GENERATED", "WAITING_VERIFICATION", "DP_APPROVED"].map((step, index) => {
                const isActive = booking.status === step;
                const isPast =
                  (step === "INVOICE_GENERATED" && ["WAITING_VERIFICATION", "DP_APPROVED"].includes(booking.status)) ||
                  (step === "WAITING_VERIFICATION" && booking.status === "DP_APPROVED");
                const isRejected = booking.status === "DP_REJECTED" && step === "WAITING_VERIFICATION";

                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                        isPast && "bg-green-500 text-white",
                        isActive && !isRejected && "bg-gold text-navy",
                        isRejected && "bg-red-500 text-white",
                        !isPast && !isActive && !isRejected && "bg-gray-200 text-gray-400"
                      )}
                    >
                      {isPast ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : isRejected ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs text-center text-gray-500">
                      {step === "INVOICE_GENERATED" && "Invoice"}
                      {step === "WAITING_VERIFICATION" && "Verifikasi"}
                      {step === "DP_APPROVED" && "Disetujui"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInOnScroll>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Details */}
          <div className="space-y-6">
            {/* Event Details */}
            <FadeInOnScroll>
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  Detail Acara
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Tanggal</p>
                      <p className="font-medium text-navy">{formatDate(booking.eventDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Jenis Acara</p>
                      <p className="font-medium text-navy">{booking.eventType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Lokasi</p>
                      <p className="font-medium text-navy">{booking.eventLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Package Details */}
            <FadeInOnScroll>
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold" />
                  Detail Paket
                </h3>
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">{packageSnapshot.serviceName}</p>
                  <p className="font-semibold text-lg text-navy">{packageSnapshot.name}</p>
                </div>
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Harga</span>
                    <span className="font-medium">{formatCurrency(Number(booking.totalPrice))}</span>
                  </div>
                  <div className="flex justify-between text-gold font-semibold">
                    <span>Down Payment</span>
                    <span>{formatCurrency(Number(booking.dpAmount))}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Sisa Pembayaran</span>
                    <span>{formatCurrency(Number(booking.totalPrice) - Number(booking.dpAmount))}</span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Client Info */}
            <FadeInOnScroll>
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Data Pemesan
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-navy">{booking.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-navy">{booking.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-navy">{booking.clientEmail}</span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Right Column - Payment */}
          <div className="space-y-6">
            {/* Payment Instructions or Status */}
            {canUploadProof && (
              <>
                {/* DP Deadline Warning */}
                {booking.status === "INVOICE_GENERATED" && (
                  <FadeInOnScroll>
                    <div className={cn(
                      "rounded-xl p-4 flex items-start gap-3",
                      isWithinDeadline(booking.dpDeadline)
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-red-50 border border-red-200"
                    )}>
                      <Clock className={cn(
                        "w-5 h-5 mt-0.5",
                        isWithinDeadline(booking.dpDeadline) ? "text-yellow-600" : "text-red-600"
                      )} />
                      <div>
                        <p className={cn(
                          "font-medium",
                          isWithinDeadline(booking.dpDeadline) ? "text-yellow-800" : "text-red-800"
                        )}>
                          Batas Waktu Pembayaran
                        </p>
                        <p className={cn(
                          "text-sm",
                          isWithinDeadline(booking.dpDeadline) ? "text-yellow-700" : "text-red-700"
                        )}>
                          {isWithinDeadline(booking.dpDeadline)
                            ? `Sisa waktu: ${getRemainingTime(booking.dpDeadline)}`
                            : "Waktu pembayaran telah habis"}
                        </p>
                      </div>
                    </div>
                  </FadeInOnScroll>
                )}

                {/* Rejection Reason */}
                {booking.status === "DP_REJECTED" && latestProof?.rejectionReason && (
                  <FadeInOnScroll>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Alasan Penolakan</p>
                          <p className="text-sm text-red-700">{latestProof.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  </FadeInOnScroll>
                )}

                {/* Payment Info */}
                <FadeInOnScroll>
                  <PaymentInfo dpAmount={Number(booking.dpAmount)} />
                </FadeInOnScroll>

                {/* Upload Button */}
                <FadeInOnScroll>
                  <Link
                    href={`/booking/${token}/upload`}
                    className="btn-gold w-full py-4 text-center font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Bukti Pembayaran
                  </Link>
                </FadeInOnScroll>
              </>
            )}

            {/* Waiting Verification */}
            {booking.status === "WAITING_VERIFICATION" && (
              <FadeInOnScroll>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-800 mb-2">Menunggu Verifikasi</h3>
                  <p className="text-sm text-blue-700">
                    Bukti pembayaran Anda sedang diverifikasi oleh tim kami.
                    Proses verifikasi biasanya memakan waktu 1x24 jam.
                  </p>
                </div>
              </FadeInOnScroll>
            )}

            {/* Approved */}
            {booking.status === "DP_APPROVED" && (
              <FadeInOnScroll>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 mb-2">Pembayaran Disetujui!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Tanggal acara Anda telah dikunci. Tim kami akan menghubungi Anda
                    untuk koordinasi lebih lanjut.
                  </p>
                  <p className="text-xs text-green-600">
                    Disetujui pada: {formatDateTime(booking.dpApprovedAt!)}
                  </p>
                </div>
              </FadeInOnScroll>
            )}

            {/* Payment History */}
            {booking.paymentProofs.length > 0 && (
              <FadeInOnScroll>
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="font-semibold text-navy mb-4">Riwayat Pembayaran</h3>
                  <div className="space-y-3">
                    {booking.paymentProofs.map((proof) => (
                      <div
                        key={proof.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-navy truncate max-w-[150px]">
                              {proof.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(proof.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            proof.verificationStatus === "APPROVED" && "bg-green-100 text-green-800",
                            proof.verificationStatus === "REJECTED" && "bg-red-100 text-red-800",
                            proof.verificationStatus === "PENDING" && "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {proof.verificationStatus === "APPROVED" && "Disetujui"}
                          {proof.verificationStatus === "REJECTED" && "Ditolak"}
                          {proof.verificationStatus === "PENDING" && "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInOnScroll>
            )}
          </div>
        </div>

        {/* Share Link */}
        <FadeInOnScroll className="mt-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Simpan link ini untuk mengecek status booking Anda</p>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-white px-4 py-2 rounded-lg text-sm text-navy">
                {typeof window !== "undefined" ? window.location.href : `/booking/${token}`}
              </code>
              <CopyButton text={typeof window !== "undefined" ? window.location.href : `/booking/${token}`} />
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
