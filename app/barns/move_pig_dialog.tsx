"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
}

export function MovePigsDialog({
  open,
  onOpenChange,
  selectedCount,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển chuồng</DialogTitle>
          <DialogDescription>
            Bạn đang chuyển <b>{selectedCount}</b> con heo sang chuồng khác
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Chuồng mới</label>
            <select className="w-full rounded-md border px-3 py-2 text-sm">
              <option value="">Chọn chuồng</option>
              <option value="A">Chuồng A</option>
              <option value="B">Chuồng B</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
              placeholder="Ghi chú chuyển chuồng..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
