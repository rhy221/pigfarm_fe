import { memo } from "react"
import { CalendarEvent } from "@/app/(main)/vaccines/components/vacccine_calendar"
import { cn } from "@/lib/utils"

const colorMap = {
  pink: "bg-pink-100 text-pink-800 border-l-2 border-pink-500",
  blue: "bg-blue-100 text-blue-800 border-l-2 border-blue-500",
  orange: "bg-orange-100 text-orange-800 border-l-2 border-orange-500",
  green: "bg-emerald-100 text-emerald-800 border-l-2 border-emerald-500",
}

type Props = {
  day?: number
  events: CalendarEvent[]
  isSelected?: boolean
  currentMonth: number 
  currentYear: number  
}

const CalendarDay = memo(function CalendarDay({ 
  day, 
  events, 
  isSelected, 
  currentMonth, 
  currentYear 
}: Props) {
  
  if (!day) return <div className="border-[0.5px] border-border bg-[#f8fafc]/50 min-h-[130px]" />

  const today = new Date();
  const isToday = day === today.getDate() && 
                  currentMonth === (today.getMonth() + 1) && 
                  currentYear === today.getFullYear();

  return (
    <div
      className={cn(
        "border-[0.5px] border-border p-2 min-h-[130px] flex flex-col space-y-2 cursor-pointer transition-all relative", 
        isSelected 
          ? "bg-[#F0F9F6] ring-2 ring-[#53A88B] ring-inset z-10" 
          : "hover:bg-[#f8fafc]",
        isToday && !isSelected && "bg-yellow-50"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
            isSelected ? "bg-[#53A88B] text-white"  // Đang chọn: Xanh
            : isToday ? "bg-red-500 text-white shadow-md scale-110" // Hôm nay: Đỏ nổi bật
            : "text-[#64748b]" // Bình thường: Xám
          )}
        >
          {day}
        </span>
        
      </div>

      {/* Danh sách sự kiện (hiển thị tối đa 3 sự kiện để không vỡ layout) */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {events.slice(0, 3).map((e) => (
          <div
            key={e.id}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md truncate font-medium shadow-sm",
              colorMap[e.color as keyof typeof colorMap] || colorMap.blue
            )}
            title={e.title} 
          >
            {e.title}
          </div>
        ))}
      </div>

      {/* Nút xem thêm nếu có nhiều hơn 3 sự kiện */}
      {events.length > 3 && (
        <div className="text-[10px] font-bold text-[#53A88B] px-1 hover:underline">
          +{events.length - 3} more
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.day === nextProps.day &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.currentMonth === nextProps.currentMonth &&
    prevProps.currentYear === nextProps.currentYear &&
    prevProps.events === nextProps.events
  )
})

export default CalendarDay