"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Anita & Budi",
    event: "Wedding - Jakarta",
    rating: 5,
    content:
      "Tim Cahaya Putih sangat profesional! Hasil fotonya natural dan indah. Semua momen penting terabadikan dengan sempurna. Highly recommended!",
    avatar: "/images/testimonials/avatar-1.jpg",
  },
  {
    id: 2,
    name: "Sari & Dimas",
    event: "Pre-Wedding - Bali",
    rating: 5,
    content:
      "Prewedding di Bali jadi pengalaman yang tak terlupakan. Fotografernya kreatif dan hasil editingnya keren banget. Worth every penny!",
    avatar: "/images/testimonials/avatar-2.jpg",
  },
  {
    id: 3,
    name: "Maya & Rizky",
    event: "Engagement - Bandung",
    rating: 5,
    content:
      "Dari konsultasi sampai hasil akhir, semuanya memuaskan. Tim sangat responsif dan bisa mengarahkan pose dengan baik. Terima kasih!",
    avatar: "/images/testimonials/avatar-3.jpg",
  },
  {
    id: 4,
    name: "Dewi & Andi",
    event: "Wedding - Yogyakarta",
    rating: 5,
    content:
      "Video cinematicnya bikin kami nangis bahagia setiap kali nonton. Kualitasnya setara dengan hasil studio internasional!",
    avatar: "/images/testimonials/avatar-4.jpg",
  },
  {
    id: 5,
    name: "Fitri & Wahyu",
    event: "Pre-Wedding - Jakarta",
    rating: 5,
    content:
      "Pelayanan ramah, hasil memuaskan. Proses booking dan pembayarannya juga mudah. Pasti akan pakai jasa mereka lagi!",
    avatar: "/images/testimonials/avatar-5.jpg",
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section id="testimonials" className="py-20 md:py-28 section-dark overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <FadeInOnScroll className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Testimoni
          </span>
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Kepuasan klien adalah prioritas utama kami. Berikut cerita mereka
            yang telah mempercayakan momen spesial kepada kami.
          </p>
        </FadeInOnScroll>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4"
                >
                  <div
                    className={cn(
                      "glass-card p-6 md:p-8 h-full transition-all duration-300",
                      index === selectedIndex
                        ? "opacity-100 scale-100"
                        : "opacity-70 scale-95"
                    )}
                  >
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-gold/30 mb-4" />

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-gold text-gold"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-white/50">
                          {testimonial.event}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            disabled={!canScrollPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            disabled={!canScrollNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === selectedIndex
                  ? "w-8 bg-gold"
                  : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
