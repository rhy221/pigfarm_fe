"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    vaccineName: string
    dosage: string
    daysOld: number
    stage: number
    notes?: string
  }) => void
}

export default function AddVaccineSampleModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    dose: "",
    age: "",
    stage: 1, // Mặc định mũi 1
    note: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    if (!form.name || !form.dose || !form.age) {
        alert("Vui lòng nhập đủ tên, liều lượng và ngày tuổi!")
        return
    }

    // --- SỬA Ở ĐÂY: Map dữ liệu form sang format chuẩn ---
    onSubmit({
        vaccineName: form.name,
        dosage: form.dose,
        daysOld: parseInt(form.age) || 0, // Ép kiểu sang số nguyên
        stage: Number(form.stage) || 1,   // Ép kiểu sang số nguyên
        notes: form.note
    })

    // Reset form
    setForm({ name: "", dose: "", age: "", stage: 1, note: "" })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>➕ Thêm mẫu tiêm thủ công</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Tên vắc-xin"
            value={form.name}
            onChange={handleChange}
          />

          <div className="flex gap-2">
             <div className="w-1/3">
                <Input
                    name="stage"
                    type="number"
                    min={1}
                    placeholder="Mũi số"
                    value={form.stage}
                    onChange={(e) => setForm({...form, stage: Number(e.target.value)})}
                />
             </div>
             <div className="w-2/3">
                <Input
                    name="dose"
                    placeholder="Liều (vd: 1ml/con)"
                    value={form.dose}
                    onChange={handleChange}
                />
             </div>
          </div>

          <Input
            name="age"
            type="number" // Đổi input type thành number
            placeholder="Tuổi tiêm (số ngày tuổi)"
            value={form.age}
            onChange={handleChange}
          />

          <Textarea
            name="note"
            placeholder="Ghi chú (không bắt buộc)"
            value={form.note}
            onChange={handleChange}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSubmit}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}