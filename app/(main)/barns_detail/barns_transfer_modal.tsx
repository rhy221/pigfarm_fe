"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type Barn = {
  id: string
  name: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  selectedPigIds: string[]
  barns: Barn[] // danh sách chuồng thường
  onSubmit: (payload: any) => void
}

export default function TransferBarnModal({
  isOpen,
  onClose,
  selectedPigIds,
  barns,
  onSubmit,
}: Props) {
  const [type, setType] = useState<"isolation" | "normal">("normal")

  // isolation
  const [diseaseDate, setDiseaseDate] = useState("")
  const [diseaseType, setDiseaseType] = useState("")
  const [symptom, setSymptom] = useState("")

  // normal
  const [targetBarnId, setTargetBarnId] = useState("")

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (selectedPigIds.length === 0) {
      alert("Chưa chọn heo")
      return
    }

    if (type === "isolation") {
      if (!diseaseDate || !diseaseType) {
        alert("Vui lòng nhập đầy đủ thông tin bệnh")
        return
      }

      onSubmit({
        type: "isolation",
        pigIds: selectedPigIds,
        diseaseDate,
        diseaseType,
        symptom,
      })
    } else {
      if (!targetBarnId) {
        alert("Vui lòng chọn chuồng mới")
        return
      }

      onSubmit({
        type: "normal",
        pigIds: selectedPigIds,
        targetBarnId,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Chuyển chuồng</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* TYPE */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">
              Hình thức chuyển
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={type === "normal"}
                  onCheckedChange={() => setType("normal")}
                />
                Chuyển chuồng thường
              </label>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={type === "isolation"}
                  onCheckedChange={() => setType("isolation")}
                />
                Chuyển heo bệnh sang chuồng cách ly
              </label>
            </div>
          </div>

          {/* NORMAL */}
          {type === "normal" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Chuồng mới
              </label>
              <select
                className="w-full border rounded p-2 text-sm"
                value={targetBarnId}
                onChange={e => setTargetBarnId(e.target.value)}
              >
                <option value="">-- Chọn chuồng --</option>
                {barns.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ISOLATION */}
          {type === "isolation" && (
            <div className="space-y-4 border rounded-lg p-4 bg-red-50">
              <div>
                <label className="text-sm font-semibold">
                  Ngày phát bệnh
                </label>
                <input
                  type="date"
                  className="w-full border rounded p-2 text-sm"
                  value={diseaseDate}
                  onChange={e => setDiseaseDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Loại bệnh
                </label>
                <input
                  className="w-full border rounded p-2 text-sm"
                  placeholder="VD: PRRS, Dịch tả..."
                  value={diseaseType}
                  onChange={e => setDiseaseType(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Triệu chứng ban đầu
                </label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  placeholder="Sốt, bỏ ăn, ho..."
                  value={symptom}
                  onChange={e => setSymptom(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 flex justify-end gap-2 border-t">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Xác nhận chuyển
          </Button>
        </div>
      </div>
    </div>
  )
}
