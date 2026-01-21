"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Task,
  User,
  Barn,
  ShiftType,
  TaskType,
  TaskStatus,
  SHIFT_LABELS,
  TASK_TYPE_LABELS,
  STATUS_LABELS,
  ROLE_PERMISSIONS,
} from "../types";

interface AddEditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  defaultDate?: string | null;
  defaultShift?: ShiftType | null;
  users: User[];
  barns: Barn[];
  onSave: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => void;
}

export function AddEditTaskDialog({
  open,
  onOpenChange,
  task,
  defaultDate,
  defaultShift,
  users,
  barns,
  onSave,
}: AddEditTaskDialogProps) {
  const isEditing = !!task;

  // Initialize form state based on task or defaults - no useEffect needed
  const getInitialDate = () => {
    if (task) {
      const [year, month, day] = task.date.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    if (defaultDate) {
      const [year, month, day] = defaultDate.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

  const getInitialShift = () => {
    if (task) return task.shift;
    return defaultShift || "morning";
  };

  // Form state
  const [date, setDate] = useState<Date | undefined>(getInitialDate);
  const [shift, setShift] = useState<ShiftType>(getInitialShift);
  const [barnId, setBarnId] = useState<string>(task?.barnId || "");
  const [userId, setUserId] = useState<string>(task?.userId || "");
  const [taskType, setTaskType] = useState<TaskType>(
    task?.taskType || "feeding"
  );
  const [taskDescription, setTaskDescription] = useState(
    task?.taskDescription || ""
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");
  const [notes, setNotes] = useState(task?.notes || "");

  // Reset form when dialog opens with different task or closes
  useEffect(() => {
    if (open) {
      if (task) {
        // Parse date in local timezone (avoid UTC conversion)
        const [year, month, day] = task.date.split("-").map(Number);
        setDate(new Date(year, month - 1, day));
        setShift(task.shift);
        setBarnId(task.barnId);
        setUserId(task.userId);
        setTaskType(task.taskType);
        setTaskDescription(task.taskDescription);
        setStatus(task.status);
        setNotes(task.notes || "");
      } else {
        if (defaultDate) {
          const [year, month, day] = defaultDate.split("-").map(Number);
          setDate(new Date(year, month - 1, day));
        } else {
          setDate(new Date());
        }
        setShift(defaultShift || "morning");
        setBarnId("");
        setUserId("");
        setTaskType("feeding");
        setTaskDescription("");
        setStatus("pending");
        setNotes("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task?.id]);

  // Filter users based on task type (role permissions)
  const filteredUsers = users.filter((user) => {
    const role = user.role || "employee"; // Default to employee if role is undefined
    const allowedTaskTypes = ROLE_PERMISSIONS[role];
    return allowedTaskTypes?.includes(taskType) ?? true;
  });

  // When task type changes, check if current user is still valid
  const handleTaskTypeChange = (newTaskType: TaskType) => {
    setTaskType(newTaskType);

    // Check if current user is allowed for this task type
    if (userId) {
      const user = users.find((e) => e.id === userId);
      if (user) {
        const role = user.role || "employee";
        const allowedTaskTypes = ROLE_PERMISSIONS[role];
        if (!allowedTaskTypes?.includes(newTaskType)) {
          setUserId("");
        }
      }
    }
  };

  const handleSave = () => {
    if (!date || !barnId || !userId || !taskDescription.trim()) {
      return; // Basic validation
    }

    const barn = barns.find((b) => b.id === barnId);
    const user = users.find((e) => e.id === userId);

    if (!barn || !user) return;

    // Format date as YYYY-MM-DD in local timezone (avoid UTC conversion)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const taskData = {
      ...(task?.id && { id: task.id }),
      date: formattedDate,
      shift,
      barnId,
      barnName: barn.name,
      userId,
      userName: user.name,
      taskType,
      taskDescription: taskDescription.trim(),
      status,
      notes: notes.trim() || undefined,
    };

    onSave(taskData);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Chọn ngày";
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa phân công" : "Thêm phân công mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin phân công công việc."
              : "Điền thông tin để tạo phân công công việc mới."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date picker */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="date" className="sm:text-right">
              Ngày <span className="text-red-500">*</span>
            </Label>
            <div className="sm:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Shift select */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="shift" className="sm:text-right">
              Ca làm <span className="text-red-500">*</span>
            </Label>
            <Select
              value={shift}
              onValueChange={(v) => setShift(v as ShiftType)}
            >
              <SelectTrigger className="sm:col-span-3">
                <SelectValue placeholder="Chọn ca làm" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SHIFT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Barn select */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="barn" className="sm:text-right">
              Chuồng <span className="text-red-500">*</span>
            </Label>
            <Select value={barnId} onValueChange={setBarnId}>
              <SelectTrigger className="sm:col-span-3">
                <SelectValue placeholder="Chọn chuồng" />
              </SelectTrigger>
              <SelectContent>
                {barns.map((barn) => (
                  <SelectItem key={barn.id} value={barn.id}>
                    {barn.name} {barn.code ? `(${barn.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task type select */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label
              htmlFor="taskType"
              className="sm:text-right whitespace-nowrap"
            >
              Loại công việc <span className="text-red-500">*</span>
            </Label>
            <Select value={taskType} onValueChange={handleTaskTypeChange}>
              <SelectTrigger className="sm:col-span-3">
                <SelectValue placeholder="Chọn loại công việc" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User select */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="user" className="sm:text-right">
              Nhân viên <span className="text-red-500">*</span>
            </Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="sm:col-span-3">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} (
                      {user.role === "veterinarian"
                        ? "Bác sĩ"
                        : user.role === "admin"
                          ? "Quản lý"
                          : "Nhân viên"}
                      )
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="-" disabled>
                    Không có nhân viên phù hợp
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {filteredUsers.length === 0 && (
              <p className="sm:col-span-3 sm:col-start-2 text-xs text-muted-foreground">
                Không có nhân viên có quyền thực hiện loại công việc này
              </p>
            )}
          </div>

          {/* Task description */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="description" className="sm:text-right">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Nhập mô tả công việc"
              className="sm:col-span-3"
            />
          </div>

          {/* Status (only in edit mode) */}
          {isEditing && (
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="status" className="sm:text-right">
                Trạng thái
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-start sm:gap-4">
            <Label htmlFor="notes" className="sm:text-right sm:pt-2">
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú (không bắt buộc)"
              className="sm:col-span-3"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!date || !barnId || !userId || !taskDescription.trim()}
          >
            {isEditing ? "Cập nhật" : "Tạo phân công"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
