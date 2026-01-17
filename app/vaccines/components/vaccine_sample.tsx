"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

type VaccineSampleItem = {
  id: number
  name: string
  dose: string
  age: string
  note?: string
}

const mockSamples: VaccineSampleItem[] = [
  { id: 1, name: "Suyễn heo - Mũi 1", dose: "1ml/con", age: "15 ngày tuổi" },
  { id: 2, name: "Tai xanh - Mũi 1", dose: "1ml/con", age: "20 ngày tuổi" },
  { id: 3, name: "CircoVirus - Mũi 1", dose: "1ml/con", age: "100 ngày tuổi" },
  { id: 4, name: "Suyễn heo - Mũi 1", dose: "1ml/con", age: "180 ngày tuổi" },
  { id: 5, name: "Tai xanh - Mũi 1", dose: "1ml/con", age: "221 ngày tuổi" },
  { id: 6, name: "CircoVirus - Mũi 1", dose: "1ml/con", age: "300 ngày tuổi" },
]

export default function VaccineSample() {
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
            {mockSamples.map((item) => (
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

      {/* GỢI Ý TIÊM */}
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
