"use client";

import { formatCurrency } from "@/lib/booking";
import { CopyButton } from "./CopyButton";
import { CreditCard, Building2, QrCode } from "lucide-react";

interface PaymentInfoProps {
  dpAmount: number;
}

export function PaymentInfo({ dpAmount }: PaymentInfoProps) {
  const bankName = process.env.NEXT_PUBLIC_STUDIO_BANK_NAME || "Bank Central Asia (BCA)";
  const accountNumber = process.env.NEXT_PUBLIC_STUDIO_ACCOUNT_NUMBER || "1234567890";
  const accountName = process.env.NEXT_PUBLIC_STUDIO_ACCOUNT_NAME || "Cahaya Putih Studio";

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-gold" />
        Informasi Pembayaran
      </h3>

      {/* Amount to Pay */}
      <div className="bg-gold/10 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Jumlah yang harus dibayar</p>
        <p className="font-cormorant text-3xl font-bold text-navy">
          {formatCurrency(dpAmount)}
        </p>
      </div>

      {/* Bank Transfer */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Building2 className="w-4 h-4" />
          <span>Transfer Bank</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-gray-500">Bank</p>
            <p className="font-medium text-navy">{bankName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Nomor Rekening</p>
            <div className="flex items-center gap-2">
              <p className="font-mono font-bold text-lg text-navy">{accountNumber}</p>
              <CopyButton text={accountNumber} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Atas Nama</p>
            <p className="font-medium text-navy">{accountName}</p>
          </div>
        </div>

        {/* QRIS Option */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <QrCode className="w-4 h-4" />
            <span>QRIS (Coming Soon)</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <p className="text-sm text-gray-400">QRIS akan segera tersedia</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-sm font-medium text-navy mb-2">Petunjuk Pembayaran:</p>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Transfer sesuai nominal di atas</li>
          <li>Simpan bukti transfer (screenshot/foto)</li>
          <li>Upload bukti pembayaran di halaman ini</li>
          <li>Tunggu verifikasi dari tim kami (1x24 jam)</li>
        </ol>
      </div>
    </div>
  );
}
