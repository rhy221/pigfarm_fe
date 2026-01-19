"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CalendarDay from "./vaccine_calendarday"
import VaccineSidePanel from "./vaccine_panel"
import { fetchVaccinationCalendar } from "@/app/api/vaccines"
import { CalendarEvent } from "@/app/vaccines/components/vacccine_calendar"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Calendar() {
  /* ================= DATE STATE ================= */
  const today = new Date()

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth() + 1
  )
  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  )

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    today
  )

  /* ================= EVENTS ================= */
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    fetchVaccinationCalendar(currentMonth, currentYear)
      .then(setEvents)
      .catch(console.error)
  }, [currentMonth, currentYear])

  /* ================= CALENDAR GRID ================= */
  const daysInMonth = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate()

  const startDay = new Date(
    currentYear,
    currentMonth - 1,
    1
  ).getDay()

  const cells: (number | undefined)[] = []
  for (let i = 0; i < startDay; i++) cells.push(undefined)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  /* ================= HELPERS ================= */
  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return events.filter(
      e =>
        e.date ===
        formatDate(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          selectedDate.getDate()
        )
    )
  }, [selectedDate, events])

  /* ================= HANDLERS ================= */
  const handleDayClick = (day: number) => {
    setSelectedDate(
      new Date(currentYear, currentMonth - 1, day)
    )
  }

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 bg-background">
      {/* LEFT: CALENDAR */}
      <div className="flex-1 space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-[#53A88B]">
              {new Date(
                currentYear,
                currentMonth - 1
              ).toLocaleString("en", { month: "long" })}
            </h2>
            <span className="text-2xl font-light text-slate-400">
              {currentYear}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-full border"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-full border"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <div className="grid grid-cols-7 bg-slate-50 border-b">
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="py-3 text-center text-[11px] font-bold uppercase text-[#53A88B]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, index) => {
              const dayEvents = day
                ? events.filter(
                    e =>
                      e.date ===
                      formatDate(
                        currentYear,
                        currentMonth,
                        day
                      )
                  )
                : []

              return (
                <div
                  key={index}
                  onClick={() => day && handleDayClick(day)}
                  className="contents"
                >
                  <CalendarDay
                    day={day}
                    events={dayEvents}
                    isSelected={
                      selectedDate?.getDate() === day &&
                      (selectedDate?.getMonth() ?? -1) + 1 === currentMonth
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: SIDE PANEL */}
      <div className="w-full lg:w-[400px]">
        <VaccineSidePanel
          date={selectedDate}
        />
      </div>
    </div>
  )
}
