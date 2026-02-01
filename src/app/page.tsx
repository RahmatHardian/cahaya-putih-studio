import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  TrustIndicators,
  ServicesPreview,
  HowItWorks,
  TestimonialsSection,
  FinalCTA,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustIndicators />
        <ServicesPreview />
        <HowItWorks />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
