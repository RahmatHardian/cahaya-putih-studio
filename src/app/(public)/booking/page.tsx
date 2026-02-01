import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/BookingForm";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking",
  description: "Buat booking untuk layanan fotografi dan videografi Cahaya Putih Studio.",
};

interface PageProps {
  searchParams: Promise<{ package?: string }>;
}

async function getPackage(packageId: string) {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId, isActive: true },
    include: {
      service: {
        select: { name: true, slug: true },
      },
    },
  });
  return pkg;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const packageId = params.package;

  if (!packageId) {
    redirect("/services");
  }

  const selectedPackage = await getPackage(packageId);

  if (!selectedPackage) {
    redirect("/services");
  }

  // Transform package data for the form
  const packageData = {
    id: selectedPackage.id,
    name: selectedPackage.name,
    description: selectedPackage.description,
    price: Number(selectedPackage.price),
    dpPercentage: selectedPackage.dpPercentage,
    inclusions: (selectedPackage.inclusions as string[]) || [],
    service: {
      name: selectedPackage.service.name,
    },
  };

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom max-w-3xl">
        {/* Back Button */}
        <FadeInOnScroll>
          <Link
            href={`/services/${selectedPackage.service.slug}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Paket
          </Link>
        </FadeInOnScroll>

        {/* Header */}
        <FadeInOnScroll className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Formulir Booking
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold text-navy mt-3 mb-4">
            Lengkapi Data Anda
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Isi formulir di bawah untuk membuat booking. Setelah booking dibuat,
            Anda akan mendapatkan invoice untuk pembayaran Down Payment.
          </p>
        </FadeInOnScroll>

        {/* Booking Form */}
        <FadeInOnScroll>
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <BookingForm selectedPackage={packageData} />
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
