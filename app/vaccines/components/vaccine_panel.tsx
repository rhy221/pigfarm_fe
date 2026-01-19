"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { fetchVaccinationDetails } from "@/app/api/vaccines"
import { exportVaccinationPdf } from "@/app/vaccines/export"

type VaccinationPen = {
  penId?: string
  penName: string
  status: string
  isReal: boolean
  scheduleId?: string | null
}

type VaccinationGroup = {
  vaccineName: string
  stage: number
  totalPens: number
  pens: VaccinationPen[]
}

type Props = {
  date: Date | null
}

export default function VaccineSidePanel({ date }: Props) {
  const [data, setData] = useState<VaccinationGroup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) return

    const dateStr = date.toISOString().split("T")[0] // YYYY-MM-DD
    setLoading(true)

    fetchVaccinationDetails(dateStr)
      .then((groups) => {
        const transformedGroups: VaccinationGroup[] = groups.map((group) => ({
          ...group,
          pens: group.pens.map((pen) => ({
            ...pen,
            isReal: true,
          })),
        }))
        setData(transformedGroups)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [date])

  if (!date) return null

  const dateString = date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="w-full lg:w-[400px] border-l bg-white h-full flex flex-col p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-emerald-600 font-bold text-lg">{dateString}</h3>
        <Button 
          onClick={() => exportVaccinationPdf(date, data)}
          size="sm" className="bg-[#53A88B] hover:bg-[#45b883] h-8 text-xs">
          Xuất PDF
        </Button>
      </div>

      {loading && (
        <div className="text-center text-sm text-slate-400">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">
          Hôm nay không có lịch tiêm
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="space-y-4">
          {data.map((group, idx) => (
            <div
              key={idx}
              className="rounded-xl p-4 space-y-3 bg-emerald-50"
            >
              {/* Vaccine info */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">
                    {group.vaccineName} – Mũi {group.stage}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {group.totalPens} chuồng
                  </p>
                </div>
              </div>

              {/* Danh sách chuồng */}
              <div className="grid grid-cols-4 gap-2">
                {group.pens.map((pen, i) => (
                  <div
                    key={i}
                    className={`text-[10px] py-1 text-center rounded-md border cursor-pointer transition-colors
                      ${
                        pen.status === "completed"
                          ? "bg-[#53A88B] text-white border-transparent"
                          : "bg-white text-slate-600 border-slate-200"
                      }
                    `}
                  >
                    {pen.penName}
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#53A88B]"
                  />
                  <span className="text-[11px] font-medium text-slate-600">
                    Tất cả
                  </span>
                </div>

                <Button
                  size="sm"
                  className="bg-[#53A88B] hover:bg-[#45b883] h-7 px-3 text-[11px] flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
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
