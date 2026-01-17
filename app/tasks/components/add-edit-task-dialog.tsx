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
  Employee,
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
  employees: Employee[];
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
  employees,
  barns,
  onSave,
}: AddEditTaskDialogProps) {
  const isEditing = !!task;

  // Initialize form state based on task or defaults - no useEffect needed
  const getInitialDate = () => {
    if (task) return new Date(task.date);
    if (defaultDate) return new Date(defaultDate);
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
  const [employeeId, setEmployeeId] = useState<string>(task?.employeeId || "");
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
        setDate(new Date(task.date));
        setShift(task.shift);
        setBarnId(task.barnId);
        setEmployeeId(task.employeeId);
        setTaskType(task.taskType);
        setTaskDescription(task.taskDescription);
        setStatus(task.status);
        setNotes(task.notes || "");
      } else {
        setDate(defaultDate ? new Date(defaultDate) : new Date());
        setShift(defaultShift || "morning");
        setBarnId("");
        setEmployeeId("");
        setTaskType("feeding");
        setTaskDescription("");
        setStatus("pending");
        setNotes("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task?.id]);

  // Filter employees based on task type (role permissions)
  const filteredEmployees = employees.filter((emp) => {
    const allowedTaskTypes = ROLE_PERMISSIONS[emp.role];
    return allowedTaskTypes.includes(taskType);
  });

  // When task type changes, check if current employee is still valid
  const handleTaskTypeChange = (newTaskType: TaskType) => {
    setTaskType(newTaskType);

    // Check if current employee is allowed for this task type
    if (employeeId) {
      const employee = employees.find((e) => e.id === employeeId);
      if (employee) {
        const allowedTaskTypes = ROLE_PERMISSIONS[employee.role];
        if (!allowedTaskTypes.includes(newTaskType)) {
          setEmployeeId("");
        }
      }
    }
  };

  const handleSave = () => {
    if (!date || !barnId || !employeeId || !taskDescription.trim()) {
      return; // Basic validation
    }

    const barn = barns.find((b) => b.id === barnId);
    const employee = employees.find((e) => e.id === employeeId);

    if (!barn || !employee) return;

    const taskData = {
      ...(task?.id && { id: task.id }),
      date: date.toISOString().split("T")[0],
      shift,
      barnId,
      barnName: barn.name,
      employeeId,
      employeeName: employee.name,
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Ngày <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shift" className="text-right">
              Ca làm <span className="text-red-500">*</span>
            </Label>
            <Select
              value={shift}
              onValueChange={(v) => setShift(v as ShiftType)}
            >
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="barn" className="text-right">
              Chuồng <span className="text-red-500">*</span>
            </Label>
            <Select value={barnId} onValueChange={setBarnId}>
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskType" className="text-right whitespace-nowrap">
              Loại công việc <span className="text-red-500">*</span>
            </Label>
            <Select value={taskType} onValueChange={handleTaskTypeChange}>
              <SelectTrigger className="col-span-3">
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

          {/* Employee select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Nhân viên <span className="text-red-500">*</span>
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} (
                      {employee.role === "veterinarian"
                        ? "Bác sĩ"
                        : employee.role === "admin"
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
            {filteredEmployees.length === 0 && (
              <p className="col-span-3 col-start-2 text-xs text-muted-foreground">
                Không có nhân viên có quyền thực hiện loại công việc này
              </p>
            )}
          </div>

          {/* Task description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Nhập mô tả công việc"
              className="col-span-3"
            />
          </div>

          {/* Status (only in edit mode) */}
          {isEditing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú (không bắt buộc)"
              className="col-span-3"
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
            disabled={
              !date || !barnId || !employeeId || !taskDescription.trim()
            }
          >
            {isEditing ? "Cập nhật" : "Tạo phân công"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
