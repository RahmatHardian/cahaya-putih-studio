import Link from "next/link";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/cahayaputihstudio", label: "Instagram" },
];

const quickLinks = [
  { href: "/services", label: "Layanan" },
  { href: "/booking", label: "Booking" },
  { href: "/calendar", label: "Cek Ketersediaan" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-cormorant text-3xl font-bold text-white">
                Cahaya Putih
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              One Stop Creative & Wedding Studio. Mengabadikan momen terindah dalam
              hidup Anda dengan sentuhan profesional dan artistik.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">WhatsApp</p>
                  <a
                    href="https://wa.me/6281234567890"
                    className="text-white hover:text-gold transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <a
                    href="mailto:hello@cahayaputih.studio"
                    className="text-white hover:text-gold transition-colors"
                  >
                    hello@cahayaputih.studio
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Lokasi</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-sm leading-relaxed">
                Jl. Contoh Alamat No. 123
                <br />
                Kota, Provinsi 12345
                <br />
                Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Cahaya Putih Studio. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
