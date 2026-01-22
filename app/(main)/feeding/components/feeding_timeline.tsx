"use client"

import { useEffect, useState } from "react"
import { feedingApi } from "@/app/api/feeding"
import { barnsApi } from "@/app/api/barns"
import { cn } from "@/lib/utils"

type TimelineItem = {
  stageIndex: number
  label: string
  desc: string
  isCurrent: boolean // Là giai đoạn thực tế (theo thời gian)
  status: string
}

type Batch = {
  id: string
  name: string
}

type Props = {
  onBatchChange: (batchId: string) => void
  onStageSelect: (stageIndex: number) => void // Callback khi user bấm chọn stage
  selectedStage: number | null // Stage đang được chọn để xem
}

export default function FeedingTimeline({ onBatchChange, onStageSelect, selectedStage }: Props) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [batchId, setBatchId] = useState("")
  const [timeline, setTimeline] = useState<TimelineItem[]>([])

  // 1. Load Batches
  useEffect(() => {
    const fetchBatches = async () => {
      const res = await barnsApi.getPigBatches()
      setBatches(res)
      if (res.length > 0) {
        setBatchId(res[0].id)
        onBatchChange(res[0].id)
      }
    }
    fetchBatches()
  }, [])

  // 2. Load Timeline (Initial)
  useEffect(() => {
    if (!batchId) return
    const fetchTimeline = async () => {
      // Gọi lần đầu không truyền stage để lấy trạng thái mặc định
      const res = await feedingApi.getFeedingPlan(batchId)
      setTimeline(res.timeline || [])
      
      // Nếu chưa chọn stage nào (lần đầu load), set selectedStage theo server trả về (thường là current)
      if (res.selectedStage !== undefined) {
         onStageSelect(res.selectedStage)
      }
    }
    fetchTimeline()
  }, [batchId])

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-6">
      {/* HEADER & DROPDOWN */}
      <div className="flex justify-between items-center">
         <h3 className="font-bold text-[#53A88B] uppercase text-sm tracking-wide">Tiến độ lứa heo</h3>
         <select
            className="border-slate-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-[#53A88B] outline-none font-medium text-slate-700"
            value={batchId}
            onChange={e => {
                setBatchId(e.target.value)
                onBatchChange(e.target.value)
            }}
        >
            {batches.map(b => (
            <option key={b.id} value={b.id}>
                {b.name}
            </option>
            ))}
        </select>
      </div>

      {/* TIMELINE VISUAL */}
      <div className="relative w-full px-4 pb-8 pt-4">
        {/* Line */}
        <div className="absolute top-[27px] left-0 right-0 h-1 bg-slate-100 rounded-full overflow-hidden" />

        <div className="flex justify-between items-start relative">
          {timeline.map((item, index) => {
            // Logic hiển thị trạng thái
            const isViewing = selectedStage === item.stageIndex; // Đang xem (được click)
            const isActualCurrent = item.isCurrent; // Thực tế heo đang ở đây

            return (
                <div 
                    key={index} 
                    className="flex flex-col items-center relative group z-10 w-1/4 cursor-pointer"
                    onClick={() => onStageSelect(item.stageIndex)} // Handle Click
                >
                  
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-[3px] transition-all duration-300 z-20",
                      // Nếu đang xem: Màu xanh đậm, to hơn. 
                      // Nếu là thực tế (nhưng không xem): Màu xanh nhạt. 
                      // Còn lại xám.
                      isViewing 
                        ? "bg-[#53A88B] border-white scale-150 shadow-md" 
                        : isActualCurrent 
                            ? "bg-white border-[#53A88B] scale-125"
                            : "bg-slate-300 border-white hover:bg-slate-400"
                    )}
                  />

                  {/* Label (Tháng 1...) */}
                  <div className={cn(
                      "mt-4 text-xs font-bold uppercase transition-colors select-none",
                      isViewing ? "text-[#53A88B]" : "text-slate-400"
                  )}>
                    {item.label}
                  </div>

                  {/* Badge (Ngày tuổi) */}
                  <div className={cn(
                      "mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium border select-none transition-all",
                      isViewing
                        ? "bg-[#53A88B] text-white border-[#53A88B]"
                        : isActualCurrent 
                            ? "bg-[#53A88B]/10 text-[#53A88B] border-[#53A88B]/20" 
                            : "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
                    {item.desc}
                  </div>
                  
                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                      <div className={cn(
                          "absolute top-[7px] left-[50%] w-full h-[2px]",
                          item.status !== 'future' ? "bg-[#53A88B]/50" : "bg-slate-200"
                      )} />
                  )}
                </div>
            )
          })}
        </div>
        
        {/* Legend / Note */}
        <div className="flex justify-center gap-6 mt-6 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#53A88B]"></div>
                <span>Đang xem</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-[#53A88B]"></div>
                <span>Hiện tại (Thực tế)</span>
            </div>
        </div>
      </div>
    </div>
  )
}