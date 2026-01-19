"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  fetchAvailablePens,
  fetchVaccines,
  createVaccinationSchedule,
  type Pen,
  type Vaccine,
} from "@/app/api/vaccines"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddVaccineModal({
  isOpen,
  onClose,
  onSuccess,
}: ModalProps) {
  /* ================= STATE ================= */

  const [pens, setPens] = useState<Pen[]>([])
  const [vaccines, setVaccines] = useState<Vaccine[]>([])

  const [selectedPens, setSelectedPens] = useState<Pen[]>([])
  const [inputType, setInputType] = useState<"system" | "manual">("system")

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [vaccineName, setVaccineName] = useState("")
  const [stage, setStage] = useState(1)
  const [selectedColor, setSelectedColor] = useState("#52d195")

  const [loading, setLoading] = useState(false)

  const colors = ["#52d195", "#e68d5c", "#f3ba5f", "#e13e51", "#2d2e2e", "#97c9c9"]

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = "hidden"

    fetchAvailablePens().then(setPens)
    fetchVaccines().then(setVaccines)

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  /* ================= HELPERS ================= */

  const resetForm = () => {
    setSelectedPens([])
    setInputType("system")
    setDate("")
    setTime("")
    setVaccineName("")
    setStage(1)
    setSelectedColor("#52d195")
  }

  const addPen = (pen: Pen) => {
    if (selectedPens.some(p => p.id === pen.id)) return
    setSelectedPens(prev => [...prev, pen])
  }

  const removePen = (id: string) => {
    setSelectedPens(prev => prev.filter(p => p.id !== id))
  }

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!date || !time || !vaccineName || selectedPens.length === 0) {
      alert("Vui lòng nhập đầy đủ thông tin")
      return
    }

    try {
      setLoading(true)

      await createVaccinationSchedule({
        date,
        time,
        vaccineName,
        stage,
        color: selectedColor,
        penIds: selectedPens.map(p => p.id),
      })

      resetForm()
      onSuccess?.()
      onClose()
    } catch (error) {
      alert("Tạo lịch tiêm thất bại")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={() => {
          resetForm()
          onClose()
        }}
      />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Thêm Lịch Tiêm</h2>
          <button
            onClick={() => {
              resetForm()
              onClose()
            }}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {/* Chọn chuồng */}
          <div className="space-y-2">
            <label className="text-sm font-bold">Chuồng áp dụng</label>

            <div className="flex flex-wrap gap-2">
              {selectedPens.map(pen => (
                <span
                  key={pen.id}
                  className="bg-slate-100 px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  {pen.name}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removePen(pen.id)}
                  />
                </span>
              ))}
            </div>

            <select
              className="w-full border rounded p-2 text-sm"
              defaultValue=""
              onChange={e => {
                const pen = pens.find(p => p.id === e.target.value)
                if (pen) {
                  addPen(pen)
                  e.currentTarget.value = ""
                }
              }}
            >
              <option value="">+ Thêm chuồng</option>
              {pens.map(pen => (
                <option key={pen.id} value={pen.id}>
                  {pen.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày & Giờ */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {/* Vaccine */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={inputType === "system" ? "default" : "ghost"}
                onClick={() => setInputType("system")}
              >
                Hệ thống
              </Button>
              <Button
                variant={inputType === "manual" ? "default" : "ghost"}
                onClick={() => setInputType("manual")}
              >
                Thủ công
              </Button>
            </div>

            {inputType === "system" ? (
              <select
                className="w-full border rounded p-2"
                value={vaccineName}
                onChange={e => setVaccineName(e.target.value)}
              >
                <option value="">-- Chọn vaccine --</option>
                {vaccines.map(v => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                placeholder="Nhập tên vaccine"
                className="w-full border rounded p-2"
                value={vaccineName}
                onChange={e => setVaccineName(e.target.value)}
              />
            )}
          </div>

          {/* Số mũi */}
          <input
            type="number"
            min={1}
            value={stage}
            onChange={e => setStage(Number(e.target.value))}
            className="w-full border rounded p-2"
          />

          {/* Màu */}
          <div className="flex gap-3">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full ${
                  selectedColor === c ? "ring-4 ring-offset-2" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-end gap-3 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              resetForm()
              onClose()
            }}
          >
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </div>
      </div>
    </div>
  )
}
