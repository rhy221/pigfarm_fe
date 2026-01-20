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
    name: string
    dose: string
    age: string
    note?: string
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
    note: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    if (!form.name || !form.dose || !form.age) return
    onSubmit(form)
    setForm({ name: "", dose: "", age: "", note: "" })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>➕ Thêm mẫu tiêm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Tên vắc-xin"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="dose"
            placeholder="Liều lượng (vd: 1ml/con)"
            value={form.dose}
            onChange={handleChange}
          />

          <Input
            name="age"
            placeholder="Tuổi tiêm (vd: 15 ngày tuổi)"
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
