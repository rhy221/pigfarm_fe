"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CalendarDay from "./vaccine_calendarday"
import VaccineSidePanel from "./vaccine_panel"
import { events } from "@/app/vaccines/components/vacccine_calendar"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Calendar() {
  // Quản lý ngày được chọn (mặc định ngày 13/03/2025 theo hình mẫu)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 2, 13))

  const daysInMonth = 31
  const startDay = 6 // March 2025 bắt đầu từ Thứ 7

  const cells: (number | undefined)[] = []
  for (let i = 0; i < startDay; i++) cells.push(undefined)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Hàm xử lý khi click vào một ngày
  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(2025, 2, day))
  }

  // Lọc sự kiện cho Panel bên phải dựa trên ngày được chọn
  const selectedDateEvents = selectedDate 
    ? events.filter(e => e.date === `2025-03-${String(selectedDate.getDate()).padStart(2, "0")}`)
    : []

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 bg-background">
      {/* PHẦN BÊN TRÁI: LỊCH (CALENDAR GRID) */}
      <div className="flex-1 space-y-4">
        {/* HEADER: Tháng/Năm và Điều hướng */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-[#53A88B]">March</h2>
            <span className="text-2xl font-light text-slate-400">2025</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-slate-100 rounded-full border border-border transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#64748b]" />
            </button>
            <button className="p-1.5 hover:bg-slate-100 rounded-full border border-border transition-colors">
              <ChevronRight className="w-5 h-5 text-[#64748b]" />
            </button>
          </div>
        </div>

        {/* Cấu trúc Grid Lịch */}
        <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-white">
          {/* Hàng Thứ cố định */}
          <div className="grid grid-cols-7 bg-[#f8fafc] border-b border-border">
            {WEEKDAYS.map((day) => (
              <div 
                key={day} 
                className="py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#53A88B]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid các ngày trong tháng */}
          <div className="grid grid-cols-7">
            {cells.map((day, index) => {
              const dayEvents = day
                ? events.filter(
                    (e) => e.date === `2025-03-${String(day).padStart(2, "0")}`
                  )
                : []

              return (
                <div 
                  key={index} 
                  onClick={() => day && handleDayClick(day)}
                  className="contents" // Giữ nguyên layout grid của CalendarDay
                >
                  <CalendarDay
                    day={day}
                    events={dayEvents}
                    isSelected={selectedDate?.getDate() === day}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* PHẦN BÊN PHẢI: SIDE PANEL (THÔNG TIN CHI TIẾT) */}
      <div className="w-full lg:w-[400px]">
        <VaccineSidePanel 
          date={selectedDate} 
          events={selectedDateEvents} 
        />
      </div>
    </div>
  )
}