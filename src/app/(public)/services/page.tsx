import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/booking";
import { ArrowRight, Camera } from "lucide-react";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "@/components/common/FadeInOnScroll";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Jelajahi berbagai layanan fotografi dan videografi profesional dari Cahaya Putih Studio.",
};

async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { price: "asc" },
        take: 1, // Get cheapest package for "starting from" price
      },
    },
  });
  return services;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-12 md:mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Layanan Kami
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-navy mt-3 mb-4">
            Pilih Layanan Terbaik
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dari prewedding hingga dokumentasi pernikahan, kami menyediakan
            layanan fotografi dan videografi profesional untuk setiap kebutuhan Anda.
          </p>
        </FadeInOnScroll>

        {/* Services Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-navy/5 to-brand-blue/10 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gold/30" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="font-semibold text-xl text-navy mb-2 group-hover:text-gold transition-colors">
                      {service.name}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                      {service.description}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400">Mulai dari</span>
                        <p className="font-semibold text-navy">
                          {service.packages[0]
                            ? formatCurrency(Number(service.packages[0].price))
                            : "Hubungi kami"}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                        Lihat Paket
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Belum ada layanan
            </h3>
            <p className="text-gray-400">
              Layanan akan segera tersedia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
