import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/booking";
import { ArrowLeft, Check, Clock, ArrowRight } from "lucide-react";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "@/components/common/FadeInOnScroll";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  const service = await prisma.service.findUnique({
    where: { slug, isActive: true },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });
  return service;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: "Layanan Tidak Ditemukan" };
  }

  return {
    title: service.name,
    description: service.description || `Layanan ${service.name} dari Cahaya Putih Studio`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Back Button */}
        <FadeInOnScroll>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Layanan
          </Link>
        </FadeInOnScroll>

        {/* Header */}
        <FadeInOnScroll className="mb-12 md:mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            {service.name}
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-navy mt-3 mb-4">
            Pilih Paket {service.name}
          </h1>
          {service.description && (
            <p className="text-gray-600 max-w-3xl text-lg">
              {service.description}
            </p>
          )}
        </FadeInOnScroll>

        {/* Packages Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.packages.map((pkg, index) => {
            const inclusions = (pkg.inclusions as string[]) || [];
            const isPopular = index === 1; // Middle package is "popular"

            return (
              <StaggerItem key={pkg.id}>
                <div
                  className={cn(
                    "relative bg-white rounded-2xl overflow-hidden border h-full flex flex-col",
                    isPopular
                      ? "border-gold shadow-lg scale-105 z-10"
                      : "border-gray-100 shadow-card"
                  )}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gold text-navy text-center py-2 text-sm font-semibold">
                      Paling Populer
                    </div>
                  )}

                  <div className={cn("p-6 md:p-8 flex flex-col flex-grow", isPopular && "pt-12")}>
                    {/* Package Name */}
                    <h3 className="font-semibold text-2xl text-navy mb-2">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-gray-500 text-sm mb-6">
                        {pkg.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="font-cormorant text-4xl font-bold text-navy">
                          {formatCurrency(Number(pkg.price))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        DP {pkg.dpPercentage}% = {formatCurrency(Number(pkg.price) * pkg.dpPercentage / 100)}
                      </p>
                    </div>

                    {/* Duration */}
                    {pkg.durationHours && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Clock className="w-4 h-4 text-gold" />
                        <span>Durasi {pkg.durationHours} jam</span>
                      </div>
                    )}

                    {/* Inclusions */}
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-navy mb-3">
                        Termasuk:
                      </p>
                      <ul className="space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/booking?package=${pkg.id}`}
                      className={cn(
                        "mt-8 w-full py-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2 transition-all",
                        isPopular
                          ? "btn-gold"
                          : "bg-navy text-white hover:bg-navy-light"
                      )}
                    >
                      Pilih Paket
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Empty State */}
        {service.packages.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Belum ada paket tersedia
            </h3>
            <p className="text-gray-400 mb-6">
              Silakan hubungi kami untuk informasi lebih lanjut.
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3"
            >
              Hubungi WhatsApp
            </a>
          </div>
        )}

        {/* CTA Section */}
        <FadeInOnScroll className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="font-cormorant text-2xl md:text-3xl font-bold text-navy mb-4">
              Butuh Paket Custom?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Kami juga menyediakan paket custom sesuai kebutuhan Anda.
              Hubungi kami untuk konsultasi gratis.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Cahaya%20Putih%20Studio,%20saya%20ingin%20konsultasi%20tentang%20paket%20custom..."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3"
            >
              Chat WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
