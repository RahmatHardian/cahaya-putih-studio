"use client";

import Link from "next/link";
import { ArrowRight, Camera, Heart, Users, Star } from "lucide-react";
import {
  FadeInOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/FadeInOnScroll";
import { cn } from "@/lib/utils";

const services = [
  {
    slug: "wedding",
    name: "Wedding Photography",
    description:
      "Dokumentasi lengkap hari pernikahan Anda dengan gaya modern dan elegan.",
    icon: Heart,
    features: ["Full Day Coverage", "Cinematic Video", "Album Premium"],
    startingPrice: "Rp 5.000.000",
  },
  {
    slug: "prewedding",
    name: "Pre-Wedding",
    description:
      "Sesi foto romantis sebelum hari H. Ekspresikan kisah cinta Anda.",
    icon: Camera,
    features: ["Outdoor/Indoor", "MUA Included", "100+ Edited Photos"],
    startingPrice: "Rp 2.500.000",
  },
  {
    slug: "engagement",
    name: "Engagement",
    description:
      "Abadikan momen spesial lamaran dengan foto dan video berkualitas.",
    icon: Star,
    features: ["3-5 Hours", "50+ Photos", "Highlight Video"],
    startingPrice: "Rp 2.000.000",
  },
  {
    slug: "portrait",
    name: "Portrait & Family",
    description:
      "Foto portrait personal, keluarga, atau profesional dengan lighting studio.",
    icon: Users,
    features: ["Studio Session", "Professional Lighting", "Multiple Outfits"],
    startingPrice: "Rp 500.000",
  },
];

export function ServicesPreview() {
  return (
    <section id="services" className="py-20 md:py-28 section-light">
      <div className="container-custom">
        {/* Section Header */}
        <FadeInOnScroll className="text-center mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Layanan Kami
          </span>
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold text-navy mt-3 mb-4">
            Pilih Layanan Terbaik untuk Momen Anda
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dari prewedding hingga dokumentasi pernikahan, kami menyediakan
            layanan fotografi dan videografi profesional untuk setiap kebutuhan
            Anda.
          </p>
        </FadeInOnScroll>

        {/* Services Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <Link href={`/services/${service.slug}`} className="group block">
                <div
                  className={cn(
                    "relative bg-white rounded-2xl p-6 h-full",
                    "border border-gray-100 shadow-card",
                    "transition-all duration-300",
                    "hover:shadow-card-hover hover:-translate-y-1"
                  )}
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 mb-4 group-hover:bg-gold/20 transition-colors">
                    <service.icon className="w-6 h-6 text-gold" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-navy mb-2 group-hover:text-gold transition-colors">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">Mulai dari</span>
                      <p className="font-semibold text-navy">
                        {service.startingPrice}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                      Detail
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All CTA */}
        <FadeInOnScroll className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
          >
            Lihat Semua Layanan
            <ArrowRight className="w-5 h-5" />
          </Link>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
