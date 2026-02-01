import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
          select: {
            id: true,
            slug: true,
            name: true,
            price: true,
            dpPercentage: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
