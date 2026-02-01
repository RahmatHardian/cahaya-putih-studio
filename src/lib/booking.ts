import { customAlphabet } from "nanoid";
import { addHours } from "date-fns";

// Generate URL-safe access token (32 characters = ~160 bits of entropy)
const generateAccessToken = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  32
);

// Generate human-readable booking code
const generateCodeSuffix = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 4);

/**
 * Generate a secure access token for booking tracking
 */
export function createAccessToken(): string {
  return generateAccessToken();
}

/**
 * Generate a human-readable booking code
 * Format: CPS-YYYYMMDD-XXXX
 */
export function createBookingCode(eventDate: Date): string {
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, "0");
  const day = String(eventDate.getDate()).padStart(2, "0");
  const suffix = generateCodeSuffix();

  return `CPS-${year}${month}${day}-${suffix}`;
}

/**
 * Calculate DP deadline (72 hours from invoice generation)
 */
export function calculateDPDeadline(invoiceDate: Date = new Date()): Date {
  return addHours(invoiceDate, 72);
}

/**
 * Calculate DP amount based on percentage
 */
export function calculateDPAmount(totalPrice: number, dpPercentage: number): number {
  return Math.ceil((totalPrice * dpPercentage) / 100);
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Format datetime to Indonesian locale
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Get tracking URL for a booking
 */
export function getTrackingUrl(accessToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/booking/${accessToken}`;
}

/**
 * Booking status labels in Indonesian
 */
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  INVOICE_GENERATED: "Menunggu Pembayaran",
  WAITING_VERIFICATION: "Menunggu Verifikasi",
  DP_APPROVED: "DP Disetujui",
  DP_REJECTED: "DP Ditolak",
  CANCELLED: "Dibatalkan",
};

/**
 * Booking status colors for UI
 */
export const BOOKING_STATUS_COLORS: Record<string, string> = {
  INVOICE_GENERATED: "bg-yellow-100 text-yellow-800",
  WAITING_VERIFICATION: "bg-blue-100 text-blue-800",
  DP_APPROVED: "bg-green-100 text-green-800",
  DP_REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

/**
 * Get status label
 */
export function getStatusLabel(status: string): string {
  return BOOKING_STATUS_LABELS[status] || status;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  return BOOKING_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
}

/**
 * Check if booking is still within DP deadline
 */
export function isWithinDeadline(dpDeadline: Date | string): boolean {
  const deadline = typeof dpDeadline === "string" ? new Date(dpDeadline) : dpDeadline;
  return new Date() < deadline;
}

/**
 * Get remaining time until deadline
 */
export function getRemainingTime(dpDeadline: Date | string): string {
  const deadline = typeof dpDeadline === "string" ? new Date(dpDeadline) : dpDeadline;
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return "Waktu habis";
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} hari ${hours % 24} jam`;
  }

  return `${hours} jam ${minutes} menit`;
}
