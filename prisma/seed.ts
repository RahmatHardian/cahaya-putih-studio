import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@cahayaputih.studio" },
    update: {},
    create: {
      email: "admin@cahayaputih.studio",
      passwordHash,
      name: "Admin Studio",
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create services
  const services = [
    {
      slug: "wedding",
      name: "Wedding Photography",
      description:
        "Dokumentasi lengkap hari pernikahan Anda dengan gaya modern dan elegan. Tim profesional kami akan mengabadikan setiap momen berharga.",
      thumbnailUrl: "/images/services/wedding.jpg",
      displayOrder: 1,
    },
    {
      slug: "prewedding",
      name: "Pre-Wedding",
      description:
        "Sesi foto romantis sebelum hari H. Ekspresikan kisah cinta Anda melalui foto-foto indah di lokasi pilihan.",
      thumbnailUrl: "/images/services/prewedding.jpg",
      displayOrder: 2,
    },
    {
      slug: "engagement",
      name: "Engagement / Lamaran",
      description:
        "Abadikan momen spesial lamaran dengan foto dan video berkualitas tinggi.",
      thumbnailUrl: "/images/services/engagement.jpg",
      displayOrder: 3,
    },
    {
      slug: "portrait",
      name: "Portrait & Personal",
      description:
        "Foto portrait personal, keluarga, atau profesional dengan lighting studio terbaik.",
      thumbnailUrl: "/images/services/portrait.jpg",
      displayOrder: 4,
    },
    {
      slug: "event",
      name: "Event Documentation",
      description:
        "Dokumentasi acara corporate, ulang tahun, gathering, dan berbagai event lainnya.",
      thumbnailUrl: "/images/services/event.jpg",
      displayOrder: 5,
    },
  ];

  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log("✅ Service created:", created.name);
  }

  // Get service IDs for packages
  const weddingService = await prisma.service.findUnique({
    where: { slug: "wedding" },
  });
  const preweddingService = await prisma.service.findUnique({
    where: { slug: "prewedding" },
  });
  const engagementService = await prisma.service.findUnique({
    where: { slug: "engagement" },
  });

  if (!weddingService || !preweddingService || !engagementService) {
    throw new Error("Services not found");
  }

  // Create packages for Wedding
  const weddingPackages = [
    {
      serviceId: weddingService.id,
      slug: "silver",
      name: "Silver Package",
      description: "Paket dasar untuk dokumentasi wedding Anda",
      inclusions: [
        "1 Fotografer profesional",
        "Dokumentasi 6 jam",
        "100 foto edited",
        "10 foto cetak 4R",
        "Album digital",
        "File digital via Google Drive",
      ],
      price: 5000000,
      dpPercentage: 50,
      durationHours: 6,
      displayOrder: 1,
    },
    {
      serviceId: weddingService.id,
      slug: "gold",
      name: "Gold Package",
      description: "Paket lengkap dengan foto dan video",
      inclusions: [
        "2 Fotografer profesional",
        "1 Videografer",
        "Dokumentasi 10 jam",
        "200 foto edited",
        "Cinematic video 5 menit",
        "20 foto cetak 4R",
        "Album foto premium",
        "File digital via Google Drive",
      ],
      price: 12000000,
      dpPercentage: 50,
      durationHours: 10,
      displayOrder: 2,
    },
    {
      serviceId: weddingService.id,
      slug: "platinum",
      name: "Platinum Package",
      description: "Paket premium all-in untuk wedding sempurna",
      inclusions: [
        "3 Fotografer profesional",
        "2 Videografer",
        "Dokumentasi full day",
        "500 foto edited",
        "Cinematic video 10 menit",
        "Same day edit video",
        "30 foto cetak 4R",
        "10 foto cetak 10R",
        "Album foto eksklusif",
        "Framed photo 16R",
        "File digital via Google Drive",
        "Pre-wedding session FREE",
      ],
      price: 25000000,
      dpPercentage: 50,
      durationHours: 14,
      displayOrder: 3,
    },
  ];

  // Create packages for Pre-Wedding
  const preweddingPackages = [
    {
      serviceId: preweddingService.id,
      slug: "basic",
      name: "Basic Session",
      description: "Sesi prewedding di 1 lokasi pilihan",
      inclusions: [
        "1 Fotografer profesional",
        "Sesi 3 jam",
        "1 lokasi",
        "50 foto edited",
        "File digital via Google Drive",
      ],
      price: 2500000,
      dpPercentage: 50,
      durationHours: 3,
      displayOrder: 1,
    },
    {
      serviceId: preweddingService.id,
      slug: "romantic",
      name: "Romantic Session",
      description: "Sesi prewedding dengan MUA di 2 lokasi",
      inclusions: [
        "1 Fotografer profesional",
        "1 Videografer",
        "Sesi 6 jam",
        "2 lokasi",
        "100 foto edited",
        "Cinematic video 3 menit",
        "MUA included",
        "File digital via Google Drive",
      ],
      price: 6000000,
      dpPercentage: 50,
      durationHours: 6,
      displayOrder: 2,
    },
    {
      serviceId: preweddingService.id,
      slug: "exclusive",
      name: "Exclusive Journey",
      description: "Pengalaman prewedding eksklusif di lokasi impian",
      inclusions: [
        "2 Fotografer profesional",
        "1 Videografer",
        "Sesi full day",
        "3 lokasi / outdoor",
        "200 foto edited",
        "Cinematic video 5 menit",
        "MUA premium",
        "Wardrobe assistance",
        "Album foto premium",
        "File digital via Google Drive",
      ],
      price: 15000000,
      dpPercentage: 50,
      durationHours: 10,
      displayOrder: 3,
    },
  ];

  // Create packages for Engagement
  const engagementPackages = [
    {
      serviceId: engagementService.id,
      slug: "intimate",
      name: "Intimate Package",
      description: "Dokumentasi lamaran sederhana",
      inclusions: [
        "1 Fotografer profesional",
        "Dokumentasi 3 jam",
        "50 foto edited",
        "File digital via Google Drive",
      ],
      price: 2000000,
      dpPercentage: 50,
      durationHours: 3,
      displayOrder: 1,
    },
    {
      serviceId: engagementService.id,
      slug: "celebration",
      name: "Celebration Package",
      description: "Dokumentasi lamaran lengkap dengan video",
      inclusions: [
        "1 Fotografer profesional",
        "1 Videografer",
        "Dokumentasi 5 jam",
        "100 foto edited",
        "Highlight video 3 menit",
        "File digital via Google Drive",
      ],
      price: 5000000,
      dpPercentage: 50,
      durationHours: 5,
      displayOrder: 2,
    },
  ];

  const allPackages = [
    ...weddingPackages,
    ...preweddingPackages,
    ...engagementPackages,
  ];

  for (const pkg of allPackages) {
    const created = await prisma.package.upsert({
      where: {
        serviceId_slug: {
          serviceId: pkg.serviceId,
          slug: pkg.slug,
        },
      },
      update: pkg,
      create: pkg,
    });
    console.log("✅ Package created:", created.name);
  }

  // Create initial calendar slots for the next 3 months
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    await prisma.calendarSlot.upsert({
      where: { date },
      update: {},
      create: {
        date,
        status: "AVAILABLE",
      },
    });
  }

  console.log("✅ Calendar slots created for the next 90 days");

  console.log("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
