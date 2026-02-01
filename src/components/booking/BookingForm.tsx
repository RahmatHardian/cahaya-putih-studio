"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2, Calendar, User, Phone, Mail, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailabilityCalendar } from "@/components/calendar/AvailabilityCalendar";
import { formatCurrency } from "@/lib/booking";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  clientName: z.string().min(3, "Nama minimal 3 karakter"),
  clientEmail: z.string().email("Email tidak valid"),
  clientPhone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  clientAddress: z.string().optional(),
  eventType: z.string().min(1, "Pilih jenis acara"),
  eventLocation: z.string().min(3, "Lokasi acara wajib diisi"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  dpPercentage: number;
  inclusions: string[];
  service: {
    name: string;
  };
}

interface BookingFormProps {
  selectedPackage: Package;
}

const eventTypes = [
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Birthday",
  "Corporate Event",
  "Family Portrait",
  "Other",
];

export function BookingForm({ selectedPackage }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const dpAmount = (selectedPackage.price * selectedPackage.dpPercentage) / 100;

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate) {
      toast({
        title: "Pilih Tanggal",
        description: "Silakan pilih tanggal acara terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          packageId: selectedPackage.id,
          eventDate: format(selectedDate, "yyyy-MM-dd"),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to confirmation page
        router.push(`/booking/${result.data.accessToken}`);
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan saat membuat booking",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Package Summary */}
      <div className="bg-gold/10 rounded-xl p-6">
        <h3 className="font-semibold text-navy mb-4">Paket Dipilih</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">{selectedPackage.service.name}</p>
            <p className="font-semibold text-lg text-navy">{selectedPackage.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Harga</p>
            <p className="font-cormorant text-2xl font-bold text-navy">
              {formatCurrency(selectedPackage.price)}
            </p>
            <p className="text-sm text-gold">
              DP {selectedPackage.dpPercentage}% = {formatCurrency(dpAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <Label className="text-base font-semibold text-navy mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          Pilih Tanggal Acara
        </Label>
        <div className="mt-4">
          <AvailabilityCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            minDate={new Date()}
          />
        </div>
        {selectedDate && (
          <p className="mt-4 text-center text-navy font-medium">
            Tanggal dipilih:{" "}
            <span className="text-gold">
              {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
            </span>
          </p>
        )}
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="font-semibold text-navy flex items-center gap-2">
          <User className="w-5 h-5 text-gold" />
          Informasi Pribadi
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nama Lengkap *</Label>
            <Input
              id="clientName"
              placeholder="Nama lengkap Anda"
              {...register("clientName")}
              className={cn(errors.clientName && "border-red-500")}
            />
            {errors.clientName && (
              <p className="text-sm text-red-500">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Nomor WhatsApp *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="clientPhone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                className={cn("pl-10", errors.clientPhone && "border-red-500")}
                {...register("clientPhone")}
              />
            </div>
            {errors.clientPhone && (
              <p className="text-sm text-red-500">{errors.clientPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="clientEmail"
                type="email"
                placeholder="email@example.com"
                className={cn("pl-10", errors.clientEmail && "border-red-500")}
                {...register("clientEmail")}
              />
            </div>
            {errors.clientEmail && (
              <p className="text-sm text-red-500">{errors.clientEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType">Jenis Acara *</Label>
            <Select onValueChange={(value) => setValue("eventType", value)}>
              <SelectTrigger className={cn(errors.eventType && "border-red-500")}>
                <SelectValue placeholder="Pilih jenis acara" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && (
              <p className="text-sm text-red-500">{errors.eventType.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventLocation">Lokasi Acara *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              id="eventLocation"
              placeholder="Alamat lengkap lokasi acara"
              className={cn("pl-10 min-h-[80px]", errors.eventLocation && "border-red-500")}
              {...register("eventLocation")}
            />
          </div>
          {errors.eventLocation && (
            <p className="text-sm text-red-500">{errors.eventLocation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              id="notes"
              placeholder="Konsep, request khusus, atau catatan lainnya..."
              className="pl-10 min-h-[100px]"
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-6 border-t">
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-navy mb-2">Ringkasan Pembayaran</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Harga Paket</span>
              <span className="font-medium">{formatCurrency(selectedPackage.price)}</span>
            </div>
            <div className="flex justify-between text-gold">
              <span>Down Payment ({selectedPackage.dpPercentage}%)</span>
              <span className="font-bold">{formatCurrency(dpAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Sisa Pembayaran</span>
              <span>{formatCurrency(selectedPackage.price - dpAmount)}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !selectedDate}
          className="w-full btn-gold py-6 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "Buat Booking & Lihat Invoice"
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Dengan melakukan booking, Anda menyetujui syarat dan ketentuan yang berlaku.
        </p>
      </div>
    </form>
  );
}
