"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import FeedingTimeline from "./feeding_timeline"
import { feedingApi } from "@/app/api/feeding"
import { Loader2 } from "lucide-react"

type FeedingDetail = {
  penName: string
  formulaName: string
  ingredientsText: string
  pigCount: number
  amountPerPig: number
  dailyTotalAmount: string // Cập nhật tên field
  stageTotalAmount: string // Cập nhật tên field
}

export default function FeedingSchedule() {
  const [batchId, setBatchId] = useState<string>("")
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [details, setDetails] = useState<FeedingDetail[]>([])
  const [loading, setLoading] = useState(false)

  // Hàm fetch data chính
  const fetchPlan = async (bId: string, sIndex: number | null) => {
      if (!bId) return
      try {
        setLoading(true)
        // Gọi API với stageIndex (nếu sIndex null thì gửi undefined để server tự tính current)
        const res = await feedingApi.getFeedingPlan(bId, sIndex ?? undefined)
        setDetails(res.details || [])
        
        // Cập nhật lại selectedStage nếu server trả về (cho lần load đầu tiên)
        if (sIndex === null && res.selectedStage !== undefined) {
            setSelectedStage(res.selectedStage)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
  }

  // Khi selectedStage hoặc batchId thay đổi -> Gọi API
  useEffect(() => {
    if (batchId) {
        fetchPlan(batchId, selectedStage)
    }
  }, [batchId, selectedStage])

  return (
    <div className="space-y-6">
      {/* 1. TIMELINE SECTION */}
      {/* Truyền callback để update stage */}
      <FeedingTimeline 
        onBatchChange={(id) => {
            setBatchId(id)
            setSelectedStage(null) // Reset stage về auto khi đổi lứa
        }} 
        onStageSelect={setSelectedStage}
        selectedStage={selectedStage}
      />

      {/* 2. TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                🍽️ Chi tiết khẩu phần ăn
                {selectedStage !== null && (
                    <span className="text-sm font-normal text-[#53A88B] bg-[#53A88B]/10 px-2 py-0.5 rounded-md">
                        (Tháng {selectedStage + 1})
                    </span>
                )}
            </h3>
            <span className="text-xs text-slate-500 bg-white border px-2 py-1 rounded-md">
                Tổng: {details.length} chuồng
            </span>
        </div>

        <Table>
          <TableHeader className="bg-[#53A88B]">
            <TableRow className="hover:bg-[#53A88B]">
              <TableHead className="text-white font-bold w-[10%] pl-4">Chuồng</TableHead>
              <TableHead className="text-white font-bold w-[20%]">Công thức</TableHead>
              <TableHead className="text-white font-bold w-[30%]">Thành phần</TableHead>
              <TableHead className="text-white font-bold text-center w-[10%]">Số heo</TableHead>
              <TableHead className="text-white font-bold text-center w-[15%]">Lượng ngày</TableHead>
              <TableHead className="text-white font-bold text-center w-[15%] pr-4">Tổng tiêu hao (Tháng)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                   <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Loader2 className="animate-spin w-6 h-6 text-[#53A88B]" />
                      <span>Đang tải dữ liệu...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : details.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                  Không tìm thấy công thức phù hợp cho giai đoạn này
                </TableCell>
              </TableRow>
            ) : (
              details.map((row, i) => (
                <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-[#53A88B] pl-4">{row.penName}</TableCell>
                  <TableCell className="font-medium text-slate-700">
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100 text-xs font-bold whitespace-nowrap">
                        {row.formulaName}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500" title={row.ingredientsText}>
                    {row.ingredientsText}
                  </TableCell>
                  <TableCell className="text-center font-medium">{row.pigCount}</TableCell>
                  <TableCell className="text-center font-medium text-slate-600">
                    <div className="flex flex-col">
                        <span>{row.dailyTotalAmount}</span>
                        <span className="text-[10px] text-slate-400">({row.amountPerPig}g/con)</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-800 bg-slate-50/50 pr-4">
                    {row.stageTotalAmount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}