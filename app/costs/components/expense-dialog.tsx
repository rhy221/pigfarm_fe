"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Expense } from "../page"

interface ExpenseDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  expense: Expense | null
  onSave: (formData: Partial<Expense>) => void
}

export function ExpenseDialog({ isOpen, onOpenChange, expense, onSave }: ExpenseDialogProps) {
  const [formData, setFormData] = useState({
    number: "",
    date: "",
    category: "",
    object: "",
    amount: 0,
    status: "pending",
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        number: expense.number,
        date: expense.date,
        category: expense.category,
        object: "",
        amount: expense.amount,
        status: expense.status,
      })
    } else {
      setFormData({
        number: "",
        date: "",
        category: "",
        object: "",
        amount: 0,
        status: "pending",
      })
    }
  }, [expense, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // onSave(formData)
  }

  const isEditMode = !!expense

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-primary text-lg font-semibold">
              {isEditMode ? "Chỉnh sửa" : "Lập phiếu chi"}
            </DialogTitle>
           
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Number */}
            <div className="space-y-1">
              <Label htmlFor="number" className="text-sm font-medium">
                Số phiếu
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="SP004"
                className="text-sm"
              />
            </div>

            {/* Object */}
            <div className="space-y-1">
              <Label htmlFor="object" className="text-sm font-medium">
                Đối tượng
              </Label>
              <Select value={formData.object} onValueChange={(value) => setFormData({ ...formData, object: value })}>
                <SelectTrigger id="object" className="text-sm">
                  <SelectValue placeholder="Nhân công" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nhân công">Nhân công</SelectItem>
                  <SelectItem value="Nhà cung cấp">Nhà cung cấp</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="date" className="text-sm font-medium">
                Ngày phát sinh
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="text-sm"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <Label htmlFor="amount" className="text-sm font-medium">
                Số tiền
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseInt(e.target.value) })}
                placeholder="15000000"
                className="text-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label htmlFor="category" className="text-sm font-medium">
                Loại chi phí
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category" className="text-sm">
                  <SelectValue placeholder="Nhân công" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nhân công">Nhân công</SelectItem>
                  <SelectItem value="Nhà cung cấp">Nhà cung cấp</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label htmlFor="status" className="text-sm font-medium">
                Tình trạng
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "completed" | "pending" | "cancelled",
                  })
                }
              >
                <SelectTrigger id="status" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Công nợ</SelectItem>
                  <SelectItem value="completed">Đã thanh toán</SelectItem>
                  <SelectItem value="cancelled">Hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
