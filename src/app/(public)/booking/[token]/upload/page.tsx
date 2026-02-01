import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/booking";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";
import { PaymentUploadForm } from "@/components/booking/PaymentUploadForm";
import { PaymentInfo } from "@/components/booking/PaymentInfo";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getBooking(token: string) {
  const booking = await prisma.booking.findUnique({
    where: { accessToken: token },
    select: {
      id: true,
      bookingCode: true,
      status: true,
      dpAmount: true,
      clientName: true,
    },
  });
  return booking;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Upload Bukti Pembayaran",
    description: "Upload bukti pembayaran Down Payment untuk booking Anda",
  };
}

export default async function PaymentUploadPage({ params }: PageProps) {
  const { token } = await params;
  const booking = await getBooking(token);

  if (!booking) {
    notFound();
  }

  // Only allow upload for INVOICE_GENERATED or DP_REJECTED status
  if (booking.status !== "INVOICE_GENERATED" && booking.status !== "DP_REJECTED") {
    redirect(`/booking/${token}`);
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <FadeInOnScroll>
          <Link
            href={`/booking/${token}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Booking
          </Link>
        </FadeInOnScroll>

        {/* Header */}
        <FadeInOnScroll className="text-center mb-8">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Booking {booking.bookingCode}
          </span>
          <h1 className="font-cormorant text-3xl md:text-4xl font-bold text-navy mt-3 mb-4">
            Upload Bukti Pembayaran
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Upload bukti transfer untuk menyelesaikan pembayaran Down Payment Anda.
          </p>
        </FadeInOnScroll>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Info */}
          <FadeInOnScroll>
            <PaymentInfo dpAmount={Number(booking.dpAmount)} />
          </FadeInOnScroll>

          {/* Upload Form */}
          <FadeInOnScroll>
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-navy mb-6">Form Upload</h3>
              <PaymentUploadForm
                bookingToken={token}
                dpAmount={Number(booking.dpAmount)}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
}
