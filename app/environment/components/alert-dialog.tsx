"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EnvironmentAlert } from "../page"

interface AlertDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  alert: EnvironmentAlert | null
}

export function AlertDialog({ isOpen, onOpenChange, alert }: AlertDialogProps) {
  if (!alert) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 text-lg">Cảnh báo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Alert Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Chuồng</p>
              <p className="text-muted-foreground">{alert.pen}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Cảnh báo</p>
              <p className="text-red-600 font-medium">{alert.message}</p>
            </div>
          </div>

          {/* Current Value */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Thông số hiện tại</p>
              <p className="text-muted-foreground">
                {alert.value} {alert.unit}
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Thời gian phát hiện</p>
              <p className="text-muted-foreground">{alert.timestamp}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="border-t pt-4">
            <p className="font-semibold text-foreground mb-2">Đề xuất giải pháp</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{alert.recommendations}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
