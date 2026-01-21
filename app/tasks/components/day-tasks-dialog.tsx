"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Task,
  ShiftType,
  SHIFT_LABELS,
  TASK_TYPE_LABELS,
  STATUS_LABELS,
} from "../types";

interface DayTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  tasks: Task[];
  onViewTask: (task: Task) => void;
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

// Status colors
const STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  completed: "default",
  in_progress: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

// Shift colors
const SHIFT_COLORS: Record<ShiftType, string> = {
  morning: "border-l-amber-400",
  afternoon: "border-l-sky-400",
  night: "border-l-indigo-400",
};

export function DayTasksDialog({
  open,
  onOpenChange,
  date,
  tasks,
  onViewTask,
}: DayTasksDialogProps) {
  if (!date) return null;

  const shifts: ShiftType[] = ["morning", "afternoon", "night"];

  const tasksByShift = shifts.reduce(
    (acc, shift) => {
      acc[shift] = tasks.filter((t) => t.shift === shift);
      return acc;
    },
    {} as Record<ShiftType, Task[]>
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Công việc ngày {formatDate(date)}</DialogTitle>
          <DialogDescription>
            Tổng {tasks.length} công việc được phân công
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {shifts.map((shift) => {
            const shiftTasks = tasksByShift[shift];
            if (shiftTasks.length === 0) return null;

            return (
              <div
                key={shift}
                className={cn(
                  "rounded-lg border-l-4 bg-card shadow-sm",
                  SHIFT_COLORS[shift]
                )}
              >
                {/* Shift header */}
                <div className="p-3 border-b bg-muted/30">
                  <h3 className="font-semibold">{SHIFT_LABELS[shift]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {shiftTasks.length} công việc
                  </p>
                </div>

                {/* Tasks */}
                <div className="p-3 space-y-2">
                  {shiftTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        "hover:shadow-md hover:scale-[1.02]",
                        task.status === "completed"
                          ? "opacity-60 bg-gray-50"
                          : "",
                        TASK_TYPE_COLORS[task.taskType]
                      )}
                      onClick={() => {
                        onViewTask(task);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {/* Task type & status */}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {TASK_TYPE_LABELS[task.taskType]}
                            </Badge>
                            <Badge
                              variant={STATUS_BADGE_VARIANTS[task.status]}
                              className="text-xs"
                            >
                              {STATUS_LABELS[task.status]}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p
                            className={cn(
                              "font-medium text-sm mb-1 line-clamp-2",
                              task.status === "completed" &&
                                "line-through text-muted-foreground"
                            )}
                          >
                            {task.taskDescription}
                          </p>

                          {/* Employee & Barn */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>👤 {task.userName}</span>
                            <span>🏠 {task.barnName}</span>
                          </div>

                          {/* Notes */}
                          {task.notes && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                              📝 {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">📋</p>
              <p>Chưa có công việc nào được phân công</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
