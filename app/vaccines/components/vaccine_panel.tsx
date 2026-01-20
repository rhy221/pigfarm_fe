"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { fetchVaccinationDetails, markVaccinated, VaccinationGroup } from "@/app/api/vaccines"
import { exportVaccinationPdf } from "@/app/vaccines/export"
import { cn } from "@/lib/utils"

type Props = {
  date: Date | null
}

export default function VaccineSidePanel({ date }: Props) {
  const [data, setData] = useState<VaccinationGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())

  // 1. Fetch dữ liệu
  const loadData = () => {
    if (!date) return
    const dateStr = date.toISOString().split("T")[0]
    setLoading(true)
    setSelectedKeys(new Set()) // Reset selection khi đổi ngày

    fetchVaccinationDetails(dateStr)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [date])

  if (!date) return null

  // 2. Helper tạo key duy nhất cho checkbox
  const getItemKey = (pen: any) => {
    if (pen.isReal) return `real_${pen.scheduleId}`
    return `forecast_${pen.templateId}_${pen.penId}`
  }

  // 3. Xử lý Checkbox từng cái
  const toggleItem = (pen: any) => {
    const key = getItemKey(pen)
    const newSet = new Set(selectedKeys)
    if (newSet.has(key)) newSet.delete(key)
    else newSet.add(key)
    setSelectedKeys(newSet)
  }

  // 4. Xử lý Checkbox "Tất cả" của 1 nhóm vaccine
  const toggleGroup = (group: VaccinationGroup, isChecked: boolean) => {
    const newSet = new Set(selectedKeys)
    group.pens.forEach(pen => {
      // Chỉ cho chọn những cái chưa hoàn thành
      if (pen.status !== 'completed') {
        const key = getItemKey(pen)
        if (isChecked) newSet.add(key)
        else newSet.delete(key)
      }
    })
    setSelectedKeys(newSet)
  }

  // 5. Submit "Đã tiêm"
  const handleMarkComplete = async () => {
    if (selectedKeys.size === 0) return
    setProcessing(true)

    // Convert keys back to payload object
    const itemsToUpdate: any[] = []
    
    data.forEach(group => {
      group.pens.forEach(pen => {
        const key = getItemKey(pen)
        if (selectedKeys.has(key)) {
          itemsToUpdate.push({
            isReal: pen.isReal,
            scheduleId: pen.scheduleId,
            templateId: pen.templateId,
            penId: pen.penId
          })
        }
      })
    })

    try {
      await markVaccinated(itemsToUpdate)
      loadData() // Reload lại để cập nhật trạng thái xanh
    } catch (e) {
      alert("Có lỗi xảy ra")
    } finally {
      setProcessing(false)
    }
  }

  const dateString = date.toLocaleDateString("vi-VN", {
    weekday: 'long', day: "numeric", month: "long"
  })

  return (
    <div className="w-full h-full flex flex-col bg-white border-l shadow-sm">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-slate-50">
        <div>
           <p className="text-xs text-slate-500 uppercase font-bold">Chi tiết ngày</p>
           <h3 className="text-emerald-700 font-bold text-lg capitalize">{dateString}</h3>
        </div>
        <Button 
          onClick={() => exportVaccinationPdf(date, data)}
          variant="outline" size="sm" className="text-emerald-600 border-emerald-200">
          Xuất PDF
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>}

        {!loading && data.length === 0 && (
           <div className="text-center py-10 text-slate-400 italic">Không có lịch tiêm nào.</div>
        )}

        {!loading && data.map((group, idx) => {
          // Check xem group này đã được tick full chưa
          const pendingPens = group.pens.filter(p => p.status !== 'completed')
          const isAllChecked = pendingPens.length > 0 && pendingPens.every(p => selectedKeys.has(getItemKey(p)))
          
          return (
            <div key={idx} className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-emerald-50/50 p-3 border-b flex justify-between items-center">
                <div>
                   <h4 className="font-bold text-emerald-900">{group.vaccineName}</h4>
                   <p className="text-xs text-emerald-600 font-medium">Mũi {group.stage} • {group.totalPens} chuồng</p>
                </div>
                {/* Group Checkbox */}
                {pendingPens.length > 0 && (
                   <input 
                      type="checkbox" 
                      checked={isAllChecked}
                      onChange={(e) => toggleGroup(group, e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                   />
                )}
              </div>

              <div className="p-2 grid grid-cols-2 gap-2">
                {group.pens.map((pen, i) => {
                   const isCompleted = pen.status === 'completed'
                   const isForecast = !pen.isReal
                   const isChecked = selectedKeys.has(getItemKey(pen))

                   return (
                    <div 
                      key={i}
                      onClick={() => !isCompleted && toggleItem(pen)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all",
                        isCompleted 
                          ? "bg-emerald-100 border-emerald-200 text-emerald-800 opacity-80" 
                          : isChecked 
                              ? "bg-blue-50 border-blue-300 ring-1 ring-blue-300" 
                              : "bg-white border-slate-100 hover:border-emerald-300",
                        isForecast && !isCompleted && "border-dashed border-orange-300 bg-orange-50/30"
                      )}
                    >
                      {/* Icon trạng thái */}
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center border",
                        isCompleted ? "bg-emerald-500 border-emerald-500 text-white" 
                        : isChecked ? "bg-blue-500 border-blue-500 text-white"
                        : "border-slate-300"
                      )}>
                        {isCompleted && <Check size={10} />}
                        {isChecked && <Check size={10} />}
                      </div>

                      <div className="flex-1">
                         <span className="font-bold">{pen.penName}</span>
                         {isForecast && !isCompleted && <span className="block text-[9px] text-orange-500 italic">Dự kiến</span>}
                         {isCompleted && <span className="block text-[9px] text-emerald-600">Đã xong</span>}
                      </div>
                    </div>
                   )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-white">
        <Button 
          className="w-full bg-[#53A88B] hover:bg-[#45b883] text-white"
          disabled={selectedKeys.size === 0 || processing}
          onClick={handleMarkComplete}
        >
          {processing ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2 w-4 h-4" />}
          Xác nhận đã tiêm ({selectedKeys.size})
        </Button>
      </div>
    </div>
  )
}