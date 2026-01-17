import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type Props = {
  date: Date | null
  events: any[]
}

export default function VaccineSidePanel({ date, events }: Props) {
  if (!date) return null

  const dateString = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="w-[350px] border-l bg-white h-full flex flex-col p-4 space-y-4 overflow-y-auto">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <h3 className="text-emerald-600 font-bold text-lg">{dateString}</h3>
        <Button size="sm" className="bg-[#53A88B] hover:bg-[#45b883] h-8 text-xs">
          Xuất PDF
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
          Hôm nay không có lịch tiêm
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, idx) => (
            <div 
              key={idx} 
              className="rounded-xl p-4 space-y-3"
              style={{ backgroundColor: `${event.color}15` }} // Nền nhạt theo màu đánh dấu
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">{event.title} - Mũi 1</h4>
                  <p className="text-[10px] text-slate-500">12 chuồng • 120 con heo</p>
                </div>
              </div>

              {/* Danh sách chuồng (Grid) */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`text-[10px] py-1 text-center rounded-md border transition-colors cursor-pointer ${
                      i % 3 === 0 
                        ? "bg-[#53A88B] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-100"
                    }`}
                  >
                    A101
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`all-${idx}`} className="rounded border-slate-300 text-[#53A88B] focus:ring-[#53A88B]" />
                  <label htmlFor={`all-${idx}`} className="text-[11px] font-medium text-slate-600">Tất cả</label>
                </div>
                <Button size="sm" className="bg-[#53A88B] hover:bg-[#45b883] h-7 px-3 text-[11px]">
                  Đã tiêm
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}