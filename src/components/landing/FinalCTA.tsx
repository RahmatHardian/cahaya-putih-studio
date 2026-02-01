"use client";

import Link from "next/link";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <FadeInOnScroll>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-light to-navy p-8 md:p-16 text-center">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Siap Mengabadikan{" "}
                <span className="text-gold">Momen Spesial</span> Anda?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
                Jangan biarkan momen berharga berlalu tanpa dokumentasi yang
                sempurna. Booking sekarang dan pastikan tanggal Anda aman!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/booking"
                  className="btn-gold px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Calendar className="w-5 h-5" />
                  Booking Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Cahaya%20Putih%20Studio,%20saya%20ingin%20konsultasi%20mengenai..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass px-8 py-4 text-lg font-medium text-white rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Respon Cepat
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Harga Transparan
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Pembayaran Mudah
                </span>
              </div>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
