"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type Barn = {
  id: string
  name: string
}

// 1. Định nghĩa kiểu dữ liệu cho bệnh
type Disease = {
  id: string
  name: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  selectedPigIds: string[]
  regularPens: Barn[]
  isolationPens: Barn[]
  // 2. Thêm prop nhận danh sách bệnh
  diseases: Disease[] 
  onSubmit: (payload: any) => void
}

export default function TransferBarnModal({
  isOpen,
  onClose,
  selectedPigIds,
  regularPens,
  isolationPens,
  diseases,
  onSubmit,
}: Props) {
  const [type, setType] = useState<"isolation" | "normal">("normal")

  const [diseaseDate, setDiseaseDate] = useState("")
  // diseaseType ở đây sẽ lưu UUID của bệnh được chọn
  const [diseaseType, setDiseaseType] = useState("") 
  const [symptom, setSymptom] = useState("")

  const [targetBarnId, setTargetBarnId] = useState("")

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    setTargetBarnId("")
  }, [type])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (selectedPigIds.length === 0) {
      alert("Chưa chọn heo")
      return
    }

    if (!targetBarnId) {
      alert("Vui lòng chọn chuồng đích")
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
        targetBarnId,
        diseaseDate,
        diseaseType, // Đây giờ là UUID
        symptom,
      })
    } else {
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
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Chuyển chuồng</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <label className="text-sm font-semibold">Hình thức chuyển</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={type === "normal"}
                  onCheckedChange={() => setType("normal")}
                />
                Chuyển chuồng thường
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={type === "isolation"}
                  onCheckedChange={() => setType("isolation")}
                />
                Chuyển heo bệnh sang chuồng cách ly
              </label>
            </div>
          </div>

          {/* TRƯỜNG HỢP 1: CHUYỂN THƯỜNG */}
          {type === "normal" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">Chọn chuồng mới (Chuồng thịt)</label>
              <select
                className="w-full border rounded p-2 text-sm"
                value={targetBarnId}
                onChange={(e) => setTargetBarnId(e.target.value)}
              >
                <option value="">-- Chọn chuồng --</option>
                {regularPens.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: CÁCH LY */}
          {type === "isolation" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Chọn chuồng cách ly</label>
                <select
                    className="w-full border rounded p-2 text-sm bg-red-50 border-red-200"
                    value={targetBarnId}
                    onChange={(e) => setTargetBarnId(e.target.value)}
                >
                    <option value="">-- Chọn chuồng cách ly --</option>
                    {isolationPens.map((b) => (
                    <option key={b.id} value={b.id}>
                        {b.name}
                    </option>
                    ))}
                </select>
              </div>

              <div className="space-y-4 border rounded-lg p-4 bg-red-50">
                <div>
                  <label className="text-sm font-semibold">Ngày phát bệnh</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2 text-sm"
                    value={diseaseDate}
                    onChange={(e) => setDiseaseDate(e.target.value)}
                  />
                </div>

                {/* 4. ĐỔI INPUT THÀNH SELECT ĐỂ CHỌN BỆNH */}
                <div>
                  <label className="text-sm font-semibold">Loại bệnh</label>
                  <select
                    className="w-full border rounded p-2 text-sm"
                    value={diseaseType}
                    onChange={(e) => setDiseaseType(e.target.value)}
                  >
                    <option value="">-- Chọn loại bệnh --</option>
                    {diseases.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Triệu chứng ban đầu</label>
                  <textarea
                    className="w-full border rounded p-2 text-sm"
                    rows={3}
                    placeholder="Sốt, bỏ ăn, ho..."
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex justify-end gap-2 border-t">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Xác nhận chuyển</Button>
        </div>
      </div>
    </div>
  )
}