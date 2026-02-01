"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const uploadSchema = z.object({
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  accountName: z.string().min(1, "Nama pengirim wajib diisi"),
  transferAmount: z.string().min(1, "Jumlah transfer wajib diisi"),
  transferDate: z.string().min(1, "Tanggal transfer wajib diisi"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface PaymentUploadFormProps {
  bookingToken: string;
  dpAmount: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export function PaymentUploadForm({ bookingToken, dpAmount }: PaymentUploadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      transferDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast({
        title: "Format tidak didukung",
        description: "Gunakan file JPG, PNG, atau PDF",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!file) {
      toast({
        title: "File diperlukan",
        description: "Silakan upload bukti pembayaran",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bookingToken", bookingToken);
      formData.append("bankName", data.bankName);
      formData.append("accountName", data.accountName);
      formData.append("transferAmount", data.transferAmount.replace(/[^0-9]/g, ""));
      formData.append("transferDate", data.transferDate);

      const response = await fetch("/api/payments/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Berhasil!",
          description: "Bukti pembayaran berhasil diupload",
        });
        router.push(`/booking/${bookingToken}`);
        router.refresh();
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan saat upload",
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* File Upload Area */}
      <div>
        <Label className="text-base font-semibold text-navy mb-4 block">
          Bukti Pembayaran *
        </Label>

        {!file ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-gold bg-gold/5"
                : "border-gray-300 hover:border-gold"
            )}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-navy font-medium mb-1">
                Drag & drop file atau klik untuk upload
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, atau PDF (Maks. 5MB)
              </p>
            </label>
          </div>
        ) : (
          <div className="border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-navy truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bankName">Nama Bank / E-Wallet *</Label>
          <Input
            id="bankName"
            placeholder="BCA, Mandiri, GoPay, dll"
            {...register("bankName")}
            className={cn(errors.bankName && "border-red-500")}
          />
          {errors.bankName && (
            <p className="text-sm text-red-500">{errors.bankName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName">Nama Pengirim *</Label>
          <Input
            id="accountName"
            placeholder="Nama sesuai rekening"
            {...register("accountName")}
            className={cn(errors.accountName && "border-red-500")}
          />
          {errors.accountName && (
            <p className="text-sm text-red-500">{errors.accountName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferAmount">Jumlah Transfer *</Label>
          <Input
            id="transferAmount"
            type="text"
            placeholder="Rp 0"
            {...register("transferAmount")}
            className={cn(errors.transferAmount && "border-red-500")}
          />
          {errors.transferAmount && (
            <p className="text-sm text-red-500">{errors.transferAmount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferDate">Tanggal Transfer *</Label>
          <Input
            id="transferDate"
            type="date"
            {...register("transferDate")}
            className={cn(errors.transferDate && "border-red-500")}
          />
          {errors.transferDate && (
            <p className="text-sm text-red-500">{errors.transferDate.message}</p>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Penting!</p>
          <p>
            Pastikan bukti pembayaran jelas dan terbaca. Proses verifikasi memakan waktu 1x24 jam kerja.
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !file}
        className="w-full btn-gold py-6 text-lg font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Mengupload...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Upload Bukti Pembayaran
          </>
        )}
      </Button>
    </form>
  );
}
