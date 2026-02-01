# Cahaya Putih Studio

> One Stop Creative & Wedding Studio - Pre-Order, Booking & Payment Verification System

A modern web application for managing photography/videography studio bookings with manual payment verification, built with Next.js 14, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)

## 🎯 Project Overview

Cahaya Putih Studio is an MVP system designed for a wedding and creative photography studio that operates on a **pre-order and booking-based model**. The system handles:

- **Public booking** with date selection
- **Down Payment (DP) collection** with invoice generation
- **Manual payment verification** (approve/reject)
- **Schedule locking** after DP approval
- **Status tracking** for clients and admin

## ✨ Features

### Client Features
- 🏠 Modern landing page with glassmorphism design
- 📦 Browse services and packages
- 📅 View availability calendar
- 📝 Create booking with invoice generation
- 💳 Upload payment proof
- 🔍 Track booking status via secure link

### Admin Features (Phase 5 - In Progress)
- 📊 Dashboard with statistics
- ✅ Payment verification (approve/reject)
- 📅 Calendar & quota management
- 📋 Booking management with filters
- 📜 Audit log viewer

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Auth | [NextAuth.js v5](https://authjs.dev/) |
| Storage | [Supabase Storage](https://supabase.com/storage) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Carousel | [Embla Carousel](https://www.embla-carousel.com/) |

## 📁 Project Structure

```
cahaya-putih-studio/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data (admin, services, packages)
├── src/
│   ├── app/
│   │   ├── (public)/         # Public routes
│   │   │   ├── booking/      # Booking flow & tracking
│   │   │   ├── calendar/     # Availability calendar
│   │   │   └── services/     # Service & package browsing
│   │   ├── admin/            # Admin dashboard (Phase 5)
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── bookings/     # Booking CRUD
│   │   │   ├── calendar/     # Calendar availability
│   │   │   ├── payments/     # Payment upload
│   │   │   └── services/     # Service listing
│   │   ├── layout.tsx        # Root layout with fonts
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── booking/          # Booking forms & status tracker
│   │   ├── calendar/         # Availability calendar
│   │   ├── common/           # Animation components
│   │   ├── landing/          # Landing page sections
│   │   ├── layout/           # Header, Footer
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── audit.ts          # Audit logging utilities
│   │   ├── booking.ts        # Booking utilities
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── rate-limit.ts     # Rate limiting
│   │   ├── storage.ts        # File storage (Supabase)
│   │   └── utils.ts          # General utilities
│   └── types/
│       └── next-auth.d.ts    # NextAuth type augmentation
├── .env.example              # Environment template
├── tailwind.config.ts        # Tailwind + custom theme
└── package.json
```

## 🗄 Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| `Admin` | Admin users with role-based access (ADMIN, SUPER_ADMIN) |
| `Service` | Service categories (Wedding, Pre-wedding, Engagement, etc.) |
| `Package` | Packages with pricing, inclusions, and DP percentage |
| `CalendarSlot` | Date availability (Available/Booked/Blocked) |
| `Booking` | Client bookings with full status tracking |
| `PaymentProof` | Uploaded payment evidence with verification status |
| `AuditLog` | All status changes and actions for transparency |
| `RateLimit` | Upload rate limiting to prevent abuse |

### Booking Status Flow

```
INVOICE_GENERATED → WAITING_VERIFICATION → DP_APPROVED → (Schedule Locked)
                                        ↘ DP_REJECTED → (Can re-upload)
                                           CANCELLED
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RahmatHardian/cahaya-putih-studio.git
   cd cahaya-putih-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:
   ```env
   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://..."

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-key"

   # NextAuth
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

7. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

After seeding, login to admin with:
- **Email**: `admin@cahayaputih.studio`
- **Password**: `admin123`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio GUI |

## 🎨 Design System

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#EBC138` | Primary CTAs, accents, highlights |
| Blue | `#3281BB` | Secondary actions, links |
| Navy | `#07121A` | Text, dark backgrounds |
| Navy Light | `#1F4F72` | Gradients, overlays |

### Typography

- **Hero Titles**: Cormorant Garamond (elegant serif)
- **Headings**: Outfit / Playfair Display
- **Body Text**: Outfit (clean sans-serif)

### Effects & Animations

- Glassmorphism with backdrop blur
- Framer Motion scroll parallax
- Fade-in-on-scroll animations
- Staggered children animations
- Typing text effect in hero section

## 🔒 Security Features

- ✅ JWT sessions via NextAuth
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Rate limiting on file uploads (5/hour per booking)
- ✅ File upload validation (type: JPG/PNG/PDF, size: 5MB max)
- ✅ Secure random access tokens (32 chars, nanoid)
- ✅ Audit logging for all status changes
- ✅ CSRF protection built into NextAuth
- ✅ Input validation with Zod schemas

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Touch-friendly interactions
- Optimized for all devices

## 🗺 Implementation Roadmap

- [x] **Phase 1**: Foundation (Project setup, database, auth)
- [x] **Phase 2**: Landing Page (Hero, sections, glassmorphism animations)
- [x] **Phase 3**: Services & Calendar (Listing, availability view)
- [x] **Phase 4**: Booking Flow (Form, invoice, payment upload)
- [ ] **Phase 5**: Admin Dashboard (Verification, calendar management)
- [ ] **Phase 6**: Polish & Security (Hardening, testing)

## 🔧 Configuration

### DP (Down Payment) Settings

| Setting | Default Value |
|---------|---------------|
| DP Percentage | 50% |
| DP Deadline | 72 hours from invoice |
| Upload Rate Limit | 5 uploads per hour |

### Calendar Settings

| Setting | Default Value |
|---------|---------------|
| Daily Quota | 1 booking per day |
| Advance Booking | 90 days ahead |

## 📄 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List active services |
| GET | `/api/services/[slug]` | Get service with packages |
| GET | `/api/calendar?month=YYYY-MM` | Get monthly availability |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/track/[token]` | Get booking by access token |
| POST | `/api/payments/upload` | Upload payment proof |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| PATCH | `/api/admin/bookings/[id]` | Update booking |
| PATCH | `/api/admin/payments/verify/[id]` | Verify payment |
| PATCH | `/api/admin/calendar/slots` | Block/unblock dates |

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Self-Hosted

```bash
npm run build
npm run start
```

## 📄 License

This project is proprietary software for Cahaya Putih Studio.

## 🤝 Support

For questions or issues, contact the development team.

---

Built with ❤️ for **Cahaya Putih Studio**
