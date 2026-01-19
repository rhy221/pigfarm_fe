"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import {
  fetchVaccineSamples,
  VaccineSampleItem,
} from "@/app/api/vaccines"

export default function VaccineSample() {
  const [samples, setSamples] = useState<VaccineSampleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVaccineSamples().then(data => {
      setSamples(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="w-12 text-center py-2"></th>
              <th className="text-left px-3 py-2">Tên vắc-xin</th>
              <th className="text-left px-3 py-2">Liều lượng</th>
              <th className="text-left px-3 py-2">Tuổi tiêm</th>
              <th className="text-left px-3 py-2">Ghi chú</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-slate-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}

            {!loading && samples.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-slate-400">
                  Chưa có mẫu vắc-xin
                </td>
              </tr>
            )}

            {samples.map(item => (
              <tr
                key={item.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >
                <td className="text-center">
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
                <td className="px-3 py-2">{item.name}</td>
                <td className="px-3 py-2">{item.dose}</td>
                <td className="px-3 py-2">{item.age}</td>
                <td className="px-3 py-2 text-slate-400">
                  {item.note || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="text-emerald-600 border-emerald-500"
        >
          <Plus size={16} className="mr-1" />
          Thêm mũi tiêm
        </Button>

        <div className="flex gap-2">
          <Button variant="destructive">Hủy</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Lưu
          </Button>
        </div>
      </div>

      {/* GỢI Ý TIÊM – để mock trước */}
      <div className="border-2 border-orange-400 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-orange-500 font-semibold">
          ☀️ Gợi ý tiêm
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 ${
                i === 0
                  ? "bg-emerald-500 text-white"
                  : "border-emerald-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">FMD</h4>
                <span className="text-xs">
                  2ml/con
                  <br />
                  112 ngày tuổi
                </span>
              </div>

              <p className="text-sm mt-2">
                Thương lái/kiểm dịch thường yêu cầu nếu xuất đi xa
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
