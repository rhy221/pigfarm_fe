import { CalendarEvent } from "@/app/vaccines/components/vacccine_calendar"
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
  isSelected?: boolean // Prop mới để highlight ngày được chọn
}

export default function CalendarDay({ day, events, isSelected }: Props) {
  // Ô trống cho những ngày không thuộc tháng hiện tại
  if (!day) {
    return (
      <div className="border-[0.5px] border-border bg-[#f8fafc]/50 min-h-[130px]" />
    )
  }

  return (
    <div
      className={cn(
        "border-[0.5px] border-border p-2 min-h-[130px] flex flex-col space-y-2 cursor-pointer transition-all",
        // Thay đổi background và viền khi được chọn
        isSelected ? "bg-[#F0F9F6] ring-2 ring-[#53A88B] ring-inset" : "hover:bg-[#f8fafc]"
      )}
    >
      {/* Số ngày - Hiển thị vòng tròn nếu được chọn hoặc là ngày hiện tại */}
      <div className="flex items-center justify-start">
        <span
          className={cn(
            "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
            isSelected 
              ? "bg-[#53A88B] text-white" 
              : "text-[#64748b]"
          )}
        >
          {day}
        </span>
      </div>

      {/* Danh sách sự kiện (hiển thị tối đa 3 sự kiện) */}
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {events.slice(0, 3).map((e) => (
          <div
            key={e.id}
            className={cn(
              "text-[10px] px-2 py-1 rounded-md truncate font-medium shadow-sm",
              colorMap[e.color as keyof typeof colorMap] || colorMap.blue
            )}
          >
            {e.title}
          </div>
        ))}
      </div>

      {/* Nút xem thêm nếu có nhiều hơn 3 sự kiện */}
      {events.length > 3 && (
        <div className="text-[10px] font-bold text-[#53A88B] px-1 hover:underline">
          view more
        </div>
      )}
    </div>
  )
}