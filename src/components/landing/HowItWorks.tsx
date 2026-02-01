"use client";

import { Package, CreditCard, Calendar, CheckCircle } from "lucide-react";
import {
  FadeInOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/FadeInOnScroll";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Package,
    title: "Pilih Paket",
    description:
      "Jelajahi layanan dan pilih paket yang sesuai dengan kebutuhan dan budget Anda.",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Booking & Tanggal",
    description:
      "Isi formulir booking dan pilih tanggal yang tersedia untuk acara Anda.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Bayar DP",
    description:
      "Bayar Down Payment 50% untuk mengamankan tanggal booking Anda.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Konfirmasi",
    description:
      "Setelah DP diverifikasi, jadwal Anda terkunci. Kami siap melayani!",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <FadeInOnScroll className="text-center mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Cara Kerja
          </span>
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold text-navy mt-3 mb-4">
            Booking Mudah dalam 4 Langkah
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Proses booking yang simpel dan transparan. Tanpa ribet, tanpa bingung.
          </p>
        </FadeInOnScroll>

        {/* Steps */}
        <StaggerContainer className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-gold via-brand-blue to-gold" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <StaggerItem key={step.number}>
                <div className="relative text-center">
                  {/* Step Circle */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-6 z-10">
                    <div
                      className={cn(
                        "absolute inset-2 rounded-full",
                        index % 2 === 0 ? "bg-gold/10" : "bg-brand-blue/10"
                      )}
                    />
                    <step.icon
                      className={cn(
                        "w-8 h-8 relative z-10",
                        index % 2 === 0 ? "text-gold" : "text-brand-blue"
                      )}
                    />
                    {/* Step Number Badge */}
                    <span
                      className={cn(
                        "absolute -top-2 -right-2 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center",
                        index % 2 === 0 ? "bg-gold" : "bg-brand-blue"
                      )}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-xl text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
