import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Primary sans-serif font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Elegant serif for hero titles
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Alternative serif for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cahaya Putih Studio - Creative & Wedding Photography",
    template: "%s | Cahaya Putih Studio",
  },
  description:
    "One Stop Creative & Wedding Studio. Professional photography and videography services for your special moments. Book now with easy online reservation.",
  keywords: [
    "wedding photography",
    "prewedding",
    "creative studio",
    "photography",
    "videography",
    "wedding studio",
    "cahaya putih",
  ],
  authors: [{ name: "Cahaya Putih Studio" }],
  openGraph: {
    title: "Cahaya Putih Studio - Creative & Wedding Photography",
    description:
      "One Stop Creative & Wedding Studio. Professional photography and videography services for your special moments.",
    type: "website",
    locale: "id_ID",
    siteName: "Cahaya Putih Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cahaya Putih Studio - Creative & Wedding Photography",
    description:
      "One Stop Creative & Wedding Studio. Professional photography and videography services.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${cormorant.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
