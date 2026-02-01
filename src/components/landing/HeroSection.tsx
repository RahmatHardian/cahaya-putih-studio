"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const typingTexts = [
  "Wedding Photography",
  "Pre-Wedding Sessions",
  "Engagement Moments",
  "Creative Portraits",
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Typing effect
  useEffect(() => {
    const currentText = typingTexts[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTextIndex]);

  const scrollToNext = () => {
    const nextSection = document.getElementById("services");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        {/* Placeholder gradient background - replace with actual image/video */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/80" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-custom text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 text-shadow-lg">
            Cahaya Putih
            <span className="block text-gold">Studio</span>
          </h1>

          {/* Subtitle with typing effect */}
          <div className="glass-card-dark inline-block px-6 py-3 mb-8">
            <p className="text-white/80 text-lg md:text-xl">
              One Stop Creative & Wedding Studio
            </p>
            <p className="text-gold font-medium text-xl md:text-2xl h-8 mt-2">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Mengabadikan setiap momen berharga dalam hidup Anda dengan sentuhan
            profesional dan artistik. Dari prewedding hingga hari pernikahan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/booking"
              className="btn-gold px-8 py-4 text-lg font-semibold rounded-lg w-full sm:w-auto"
            >
              Booking Sekarang
            </Link>
            <Link
              href="/services"
              className="btn-glass px-8 py-4 text-lg font-medium text-white rounded-lg w-full sm:w-auto"
            >
              Lihat Layanan
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors"
        aria-label="Scroll to next section"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce-slow" />
        </div>
      </motion.button>
    </section>
  );
}
