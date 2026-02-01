"use client";

import { Camera, Users, Award, Heart } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/common/FadeInOnScroll";

const stats = [
  {
    icon: Camera,
    value: "500+",
    label: "Wedding Documented",
    description: "Momen pernikahan yang telah kami abadikan",
  },
  {
    icon: Users,
    value: "1000+",
    label: "Happy Clients",
    description: "Klien puas dengan hasil kerja kami",
  },
  {
    icon: Award,
    value: "5+",
    label: "Years Experience",
    description: "Tahun pengalaman di industri fotografi",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Satisfaction",
    description: "Tingkat kepuasan klien kami",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 mb-4">
                <stat.icon className="w-7 h-7 text-gold" />
              </div>
              <div className="font-cormorant text-4xl md:text-5xl font-bold text-navy mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-navy mb-1">{stat.label}</div>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
