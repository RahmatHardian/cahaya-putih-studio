import { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/calendar/AvailabilityCalendar";
import { FadeInOnScroll } from "@/components/common/FadeInOnScroll";

export const metadata: Metadata = {
  title: "Ketersediaan Jadwal",
  description: "Cek ketersediaan jadwal Cahaya Putih Studio untuk booking layanan fotografi dan videografi.",
};

export default function CalendarPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Jadwal
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-navy mt-3 mb-4">
            Cek Ketersediaan
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Lihat jadwal ketersediaan kami dan pilih tanggal yang sesuai untuk acara Anda.
          </p>
        </FadeInOnScroll>

        {/* Legend */}
        <FadeInOnScroll className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            <span className="text-sm text-gray-600">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
            <span className="text-sm text-gray-600">Terisi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
            <span className="text-sm text-gray-600">Tidak Tersedia</span>
          </div>
        </FadeInOnScroll>

        {/* Calendar */}
        <FadeInOnScroll>
          <div className="max-w-4xl mx-auto">
            <AvailabilityCalendar />
          </div>
        </FadeInOnScroll>

        {/* Info */}
        <FadeInOnScroll className="mt-12 text-center">
          <div className="bg-gold/10 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="font-semibold text-navy text-lg mb-2">
              Informasi Booking
            </h3>
            <p className="text-gray-600 text-sm">
              Tanggal akan terkunci setelah Down Payment (DP) diverifikasi.
              Silakan booking terlebih dahulu untuk mengamankan tanggal Anda.
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}
