"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2, X, Undo2 } from "lucide-react" // Import thêm icon Undo2
import { 
  fetchVaccinationDetails, 
  markVaccinated, 
  revertVaccination, 
  VaccinationGroup 
} from "@/app/api/vaccines"
import { exportVaccinationPdf } from "@/app/(main)/vaccines/export"
import { cn } from "@/lib/utils"

type Props = {
  date: Date | null
}

export default function VaccineSidePanel({ date }: Props) {
  const [data, setData] = useState<VaccinationGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())

  const loadData = () => {
    if (!date) return
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    setLoading(true)
    setSelectedKeys(new Set()) 

    fetchVaccinationDetails(dateStr)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [date])

  if (!date) return null

  const getItemKey = (pen: any) => {
    if (pen.isReal) return `real_${pen.scheduleId}`
    return `forecast_${pen.templateId}_${pen.penId}`
  }

  const toggleItem = (pen: any) => {
    const key = getItemKey(pen)
    const newSet = new Set(selectedKeys)
    if (newSet.has(key)) newSet.delete(key)
    else newSet.add(key)
    setSelectedKeys(newSet)
  }

  const toggleGroup = (group: VaccinationGroup, isChecked: boolean) => {
    const newSet = new Set(selectedKeys)
    group.pens.forEach(pen => {
      if (pen.status !== 'completed') {
        const key = getItemKey(pen)
        if (isChecked) newSet.add(key)
        else newSet.delete(key)
      }
    })
    setSelectedKeys(newSet)
  }

  const handleMarkComplete = async () => {
    if (selectedKeys.size === 0) return
    setProcessing(true)

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
      loadData()
    } catch (e) {
      alert("Có lỗi xảy ra")
    } finally {
      setProcessing(false)
    }
  }

  const handleUndo = async (scheduleId: string) => {
    if (!confirm("Hoàn tác: Hủy xác nhận đã tiêm cho chuồng này?")) return
    
    try {
      if (scheduleId) {
        await revertVaccination(scheduleId)
        loadData() 
      }
    } catch (e) {
      console.error("Chi tiết lỗi hoàn tác:", e);
    
    }
  }

  const dateString = date.toLocaleDateString("vi-VN", {
    weekday: 'long', day: "numeric", month: "long"
  })

  return (
    <div className="w-full h-full flex flex-col bg-white border-l shadow-sm">
      {/* Header Panel */}
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

      {/* Body List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {loading && <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>}

        {!loading && data.length === 0 && (
           <div className="text-center py-10 text-slate-400 italic">Không có lịch tiêm nào.</div>
        )}

        {!loading && data.map((group, idx) => {
          // Logic xác định xem nhóm này đã xong hết chưa
          const isGroupFinished = group.pens.every((p: any) => p.status === 'completed');
          
          const pendingPens = group.pens.filter((p:any) => p.status !== 'completed')
          const isAllChecked = pendingPens.length > 0 && pendingPens.every((p:any) => selectedKeys.has(getItemKey(p)))
          
          return (
            <div key={idx} className={cn(
                "border rounded-xl overflow-hidden shadow-sm transition-all",
                isGroupFinished ? "border-emerald-200 opacity-80" : "border-slate-200"
            )}>
              {/* Group Header */}
              <div className={cn(
                  "p-3 border-b flex justify-between items-center",
                  isGroupFinished ? "bg-emerald-100" : "bg-emerald-50/50"
              )}>
                <div>
                   <div className="flex items-center gap-2">
                        <h4 className="font-bold text-emerald-900">{group.vaccineName}</h4>
                        {isGroupFinished && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Đã xong
                            </span>
                        )}
                   </div>
                   <p className="text-xs text-emerald-600 font-medium">Mũi {group.stage} • {group.totalPens} chuồng</p>
                </div>

                {/* Chỉ hiện checkbox chọn tất cả nếu nhóm CHƯA xong */}
                {!isGroupFinished && pendingPens.length > 0 && (
                   <input 
                      type="checkbox" 
                      checked={isAllChecked}
                      onChange={(e) => toggleGroup(group, e.target.checked)}
                      className="w-5 h-5 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                      title="Chọn tất cả"
                   />
                )}
              </div>

              {/* Group Items */}
              <div className="p-2 grid grid-cols-2 gap-2 bg-white">
                {group.pens.map((pen: any, i) => {
                   const isCompleted = pen.status === 'completed'
                   const isForecast = !pen.isReal
                   const isOverdue = pen.isOverdue
                   const isChecked = selectedKeys.has(getItemKey(pen))

                   return (
                    <div 
                      key={i}
                      // Nếu đã completed thì bấm vào để Hoàn tác, ngược lại bấm để chọn
                      onClick={() => isCompleted ? handleUndo(pen.scheduleId) : toggleItem(pen)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all relative overflow-hidden select-none",
                        isCompleted 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 group" 
                          : isChecked 
                              ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500" 
                              : "bg-white border-slate-200 hover:border-emerald-400",
                        isForecast && !isCompleted && !isOverdue && !isChecked && "border-dashed border-slate-300",
                        isOverdue && !isCompleted && !isChecked && "bg-red-50 border-red-200"
                      )}
                    >
                      {/* Icon trạng thái */}
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-colors",
                        isCompleted ? "bg-emerald-500 border-emerald-500 text-white group-hover:bg-red-500 group-hover:border-red-500" 
                        : isChecked ? "bg-emerald-500 border-emerald-500 text-white"
                        : isOverdue ? "border-red-400 text-red-400"
                        : "border-slate-300 bg-white"
                      )}>
                        {isCompleted ? <Check size={12} className="group-hover:hidden" /> : null}
                        {isCompleted && <Undo2 size={12} className="hidden group-hover:block" />} {/* Icon Undo khi hover */}
                        {!isCompleted && isChecked && <Check size={12} />}
                      </div>

                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center">
                             <span className={cn("font-bold truncate", isOverdue && !isCompleted && "text-red-600")}>
                                {pen.penName}
                             </span>
                         </div>
                         
                         {isForecast && !isCompleted && !isOverdue && <span className="block text-[10px] text-slate-400 italic">Dự kiến</span>}
                         
                         {isOverdue && !isCompleted && (
                            <span className="block text-[9px] text-red-500 font-bold">
                                ⚠️ Trễ {pen.originalDate}
                            </span>
                         )}

                         {isCompleted && <span className="block text-[9px] text-emerald-600 group-hover:text-red-500">Đã tiêm</span>}
                      </div>
                    </div>
                   )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t bg-white">
        <Button 
          className="w-full bg-[#53A88B] hover:bg-[#45b883] text-white font-bold py-6"
          disabled={selectedKeys.size === 0 || processing}
          onClick={handleMarkComplete}
        >
          {processing ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2 w-5 h-5" />}
          Xác nhận đã tiêm ({selectedKeys.size})
        </Button>
      </div>
    </div>
  )
}