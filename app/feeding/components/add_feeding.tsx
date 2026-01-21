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

type FeedingFormula = {
  name: string
  amount: string
  stage: string
  ingredients: string
  feedingTime: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: FeedingFormula) => void
}

export default function AddFeedingFormulaModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FeedingFormula>({
    name: "",
    amount: "",
    stage: "",
    ingredients: "",
    feedingTime: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    if (!form.name || !form.amount || !form.stage) return
    onSubmit(form)
    setForm({
      name: "",
      amount: "",
      stage: "",
      ingredients: "",
      feedingTime: "",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>➕ Thêm công thức ăn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Tên công thức (vd: Cám gạo)"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            name="amount"
            placeholder="Định lượng (vd: 300 gram/con)"
            value={form.amount}
            onChange={handleChange}
          />

          <Input
            name="stage"
            placeholder="Giai đoạn (vd: Mới về đến 30kg)"
            value={form.stage}
            onChange={handleChange}
          />

          <Textarea
            name="ingredients"
            placeholder="Thành phần (vd: 50% Cám • 50% Bột cá)"
            value={form.ingredients}
            onChange={handleChange}
          />

          <Input
            name="feedingTime"
            placeholder="Giờ cho ăn (vd: 6h - 12h - 18h)"
            value={form.feedingTime}
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
