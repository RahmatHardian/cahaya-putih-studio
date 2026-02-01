"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarSlot {
  id: string;
  date: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
}

interface CalendarData {
  startDate: string;
  endDate: string;
  slots: CalendarSlot[];
}

interface AvailabilityCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
}

export function AvailabilityCalendar({
  onDateSelect,
  selectedDate,
  minDate = new Date(),
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar data
  useEffect(() => {
    async function fetchCalendar() {
      setIsLoading(true);
      setError(null);

      try {
        const monthStr = format(currentMonth, "yyyy-MM");
        const response = await fetch(`/api/calendar?month=${monthStr}`);
        const data = await response.json();

        if (data.success) {
          setCalendarData(data.data);
        } else {
          setError("Gagal memuat kalender");
        }
      } catch (err) {
        setError("Gagal memuat kalender");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCalendar();
  }, [currentMonth]);

  // Get days in current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day offset for first day of month
  const startDay = monthStart.getDay();

  // Get status for a specific date
  const getDateStatus = (date: Date): "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST" => {
    if (isBefore(startOfDay(date), startOfDay(minDate))) {
      return "PAST";
    }

    if (!calendarData) return "AVAILABLE";

    const dateStr = format(date, "yyyy-MM-dd");
    const slot = calendarData.slots.find((s) => s.date === dateStr);

    return slot?.status || "AVAILABLE";
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    if (status === "AVAILABLE" && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Can go to previous month only if it's not before current month
  const canGoPrevious = !isBefore(startOfMonth(subMonths(currentMonth, 1)), startOfMonth(new Date()));

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="font-semibold text-xl text-navy">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days */}
          {days.map((day) => {
            const status = getDateStatus(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const isClickable = status === "AVAILABLE" && onDateSelect;

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={status !== "AVAILABLE" || !onDateSelect}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                  // Base styles
                  "relative",
                  // Status styles
                  status === "AVAILABLE" && !isSelected && "bg-green-50 text-green-700 hover:bg-green-100",
                  status === "BOOKED" && "bg-red-50 text-red-400 cursor-not-allowed",
                  status === "BLOCKED" && "bg-gray-100 text-gray-400 cursor-not-allowed",
                  status === "PAST" && "bg-gray-50 text-gray-300 cursor-not-allowed",
                  // Selected state
                  isSelected && "bg-gold text-navy ring-2 ring-gold ring-offset-2",
                  // Today indicator
                  isCurrentDay && !isSelected && "ring-1 ring-navy",
                  // Clickable
                  isClickable && "cursor-pointer"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
