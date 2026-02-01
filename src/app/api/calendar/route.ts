import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, parseISO, addMonths } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const monthParam = searchParams.get("month"); // Format: YYYY-MM

    let startDate: Date;
    let endDate: Date;

    if (monthParam) {
      // Parse the month parameter
      const parsedDate = parseISO(`${monthParam}-01`);
      startDate = startOfMonth(parsedDate);
      endDate = endOfMonth(parsedDate);
    } else {
      // Default to current month + next 2 months
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(addMonths(new Date(), 2));
    }

    const slots = await prisma.calendarSlot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        date: true,
        status: true,
      },
    });

    // Transform dates to ISO strings for JSON response
    const formattedSlots = slots.map((slot) => ({
      id: slot.id,
      date: slot.date.toISOString().split("T")[0], // YYYY-MM-DD format
      status: slot.status,
    }));

    return NextResponse.json({
      success: true,
      data: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        slots: formattedSlots,
      },
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
