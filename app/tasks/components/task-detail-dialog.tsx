"use client";

import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Pencil,
  Trash2,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Task, SHIFT_LABELS, TASK_TYPE_LABELS, STATUS_LABELS } from "../types";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  readonly?: boolean;
}

// Task type colors
const TASK_TYPE_COLORS: Record<string, string> = {
  feeding: "bg-green-100 text-green-700 border-green-200",
  cleaning: "bg-blue-100 text-blue-700 border-blue-200",
  health_check: "bg-yellow-100 text-yellow-700 border-yellow-200",
  vaccination: "bg-purple-100 text-purple-700 border-purple-200",
  monitoring: "bg-orange-100 text-orange-700 border-orange-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

// Status icons
const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  in_progress: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  pending: <Circle className="h-4 w-4 text-gray-400" />,
  cancelled: <Circle className="h-4 w-4 text-red-400" />,
};

// Status colors
const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export function TaskDetailDialog({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onComplete,
  readonly = false,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const formatDate = (dateStr: string) => {
    // Parse date in local timezone (YYYY-MM-DD format)
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shiftTimeRanges: Record<string, string> = {
    morning: "06:00 - 12:00",
    afternoon: "12:00 - 18:00",
    night: "18:00 - 06:00",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">
                {task.taskDescription}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Chi tiết phân công công việc
              </DialogDescription>
            </div>
            <Badge className={cn("ml-2", STATUS_COLORS[task.status])}>
              {STATUS_ICONS[task.status]}
              <span className="ml-1">{STATUS_LABELS[task.status]}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task Type Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-sm px-3 py-1",
                TASK_TYPE_COLORS[task.taskType]
              )}
            >
              {TASK_TYPE_LABELS[task.taskType]}
            </Badge>
          </div>

          <Separator />

          {/* Info Grid */}
          <div className="grid gap-4">
            {/* Date & Shift */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày làm việc</p>
                <p className="font-medium">{formatDate(task.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ca làm việc</p>
                <p className="font-medium">
                  {SHIFT_LABELS[task.shift]} ({shiftTimeRanges[task.shift]})
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Chuồng</p>
                <p className="font-medium">{task.barnName}</p>
              </div>
            </div>

            {/* Employee */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Nhân viên phụ trách
                </p>
                <p className="font-medium">{task.userName}</p>
              </div>
            </div>

            {/* Notes */}
            {task.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="font-medium">{task.notes}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Tạo lúc: {formatDateTime(task.createdAt)}</p>
            <p>Cập nhật: {formatDateTime(task.updatedAt)}</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {task.status !== "completed" && onComplete && (
            <Button
              variant="default"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={() => {
                onComplete(task.id);
                onOpenChange(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Hoàn thành
            </Button>
          )}

          {!readonly && (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onEdit(task)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa phân công này không? Hành động
                      này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(task.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
