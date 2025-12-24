"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Task,
  ViewMode,
  ShiftType,
  SHIFT_LABELS,
  TASK_TYPE_LABELS,
  DAY_OF_WEEK_LABELS,
} from "../types";

interface TaskCalendarProps {
  currentDate: Date;
  viewMode: ViewMode;
  tasks: Task[];
  onAddTask: (date?: string, shift?: ShiftType) => void;
  onViewTask: (task: Task) => void;
}

// Helper to format date as YYYY-MM-DD
const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Helper to check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Helper to check if date is in current month
const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return (
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear()
  );
};

// Get all dates for month view (including days from prev/next month to fill grid)
const getMonthDates = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1);
  // Last day of month
  const lastDay = new Date(year, month + 1, 0);

  // Start from Sunday of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End on Saturday of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Get all dates for week view
const getWeekDates = (date: Date): Date[] => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }

  return dates;
};

// Task type colors
const TASK_TYPE_COLORS: Record<string, string> = {
  feeding: "bg-green-100 text-green-700 border-green-200",
  cleaning: "bg-blue-100 text-blue-700 border-blue-200",
  health_check: "bg-yellow-100 text-yellow-700 border-yellow-200",
  vaccination: "bg-purple-100 text-purple-700 border-purple-200",
  monitoring: "bg-orange-100 text-orange-700 border-orange-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

// Shift colors
const SHIFT_COLORS: Record<ShiftType, string> = {
  morning: "border-l-amber-400",
  afternoon: "border-l-sky-400",
  night: "border-l-indigo-400",
};

// DayCell component for month/week view
interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  tasks: Task[];
  viewMode: ViewMode;
  onAddTask: (date: string, shift?: ShiftType) => void;
  onViewTask: (task: Task) => void;
}

function DayCell({
  date,
  isCurrentMonth,
  tasks,
  viewMode,
  onAddTask,
  onViewTask,
}: DayCellProps) {
  const dateKey = formatDateKey(date);
  const dayTasks = tasks.filter((t) => t.date === dateKey);
  const shifts: ShiftType[] = ["morning", "afternoon", "night"];

  const tasksByShift = useMemo(() => {
    const grouped: Record<ShiftType, Task[]> = {
      morning: [],
      afternoon: [],
      night: [],
    };
    dayTasks.forEach((task) => {
      grouped[task.shift].push(task);
    });
    return grouped;
  }, [dayTasks]);

  const isCompact = viewMode === "month";

  return (
    <div
      className={cn(
        "min-h-[120px] border-r border-b p-1 transition-colors",
        "hover:bg-muted/30",
        !isCurrentMonth && "bg-muted/10 opacity-50",
        isToday(date) && "bg-primary/5 ring-2 ring-primary ring-inset"
      )}
    >
      {/* Date header */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
            isToday(date) && "bg-primary text-primary-foreground"
          )}
        >
          {date.getDate()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
          onClick={() => onAddTask(dateKey)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Shifts */}
      <div className="space-y-0.5">
        {shifts.map((shift) => {
          const shiftTasks = tasksByShift[shift];

          return (
            <div
              key={shift}
              className={cn(
                "relative rounded-sm border-l-2 pl-1 py-0.5 min-h-6",
                SHIFT_COLORS[shift],
                "cursor-pointer hover:bg-muted/50",
                shiftTasks.length === 0 && "opacity-40"
              )}
              onClick={() => {
                if (shiftTasks.length > 0) {
                  onViewTask(shiftTasks[0]);
                } else {
                  onAddTask(dateKey, shift);
                }
              }}
            >
              {shiftTasks.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  {shiftTasks.slice(0, isCompact ? 1 : 2).map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "text-xs truncate rounded px-1 py-0.5 border",
                        TASK_TYPE_COLORS[task.taskType]
                      )}
                      title={`${task.taskDescription} - ${task.employeeName}`}
                    >
                      <span className="font-medium">{task.barnName}</span>
                      {!isCompact && (
                        <span className="text-[10px] ml-1 opacity-70">
                          {task.employeeName.split(" ").pop()}
                        </span>
                      )}
                    </div>
                  ))}
                  {shiftTasks.length > (isCompact ? 1 : 2) && (
                    <span className="text-[10px] text-muted-foreground pl-1">
                      +{shiftTasks.length - (isCompact ? 1 : 2)} khác
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground italic">
                  {isCompact ? "" : "(trống)"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Day view component
interface DayViewProps {
  date: Date;
  tasks: Task[];
  onAddTask: (date: string, shift?: ShiftType) => void;
  onViewTask: (task: Task) => void;
}

function DayView({ date, tasks, onAddTask, onViewTask }: DayViewProps) {
  const dateKey = formatDateKey(date);
  const dayTasks = tasks.filter((t) => t.date === dateKey);
  const shifts: ShiftType[] = ["morning", "afternoon", "night"];

  const tasksByShift = useMemo(() => {
    const grouped: Record<ShiftType, Task[]> = {
      morning: [],
      afternoon: [],
      night: [],
    };
    dayTasks.forEach((task) => {
      grouped[task.shift].push(task);
    });
    return grouped;
  }, [dayTasks]);

  const shiftTimeRanges: Record<ShiftType, string> = {
    morning: "06:00 - 12:00",
    afternoon: "12:00 - 18:00",
    night: "18:00 - 06:00",
  };

  return (
    <div className="space-y-4">
      {/* Date header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-16 h-16 rounded-lg",
            isToday(date) ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <span className="text-xs uppercase">
            {DAY_OF_WEEK_LABELS[date.getDay()]}
          </span>
          <span className="text-2xl font-bold">{date.getDate()}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {date.toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dayTasks.length} công việc được phân công
          </p>
        </div>
      </div>

      {/* Shifts */}
      <div className="space-y-4">
        {shifts.map((shift) => {
          const shiftTasks = tasksByShift[shift];

          return (
            <div
              key={shift}
              className={cn(
                "rounded-lg border-l-4 bg-card shadow-sm",
                SHIFT_COLORS[shift]
              )}
            >
              {/* Shift header */}
              <div className="flex items-center justify-between p-3 border-b">
                <div>
                  <h3 className="font-semibold">{SHIFT_LABELS[shift]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {shiftTimeRanges[shift]}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTask(dateKey, shift)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm
                </Button>
              </div>

              {/* Tasks */}
              <div className="p-3">
                {shiftTasks.length > 0 ? (
                  <div className="space-y-2">
                    {shiftTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border cursor-pointer",
                          "hover:shadow-md transition-shadow",
                          TASK_TYPE_COLORS[task.taskType]
                        )}
                        onClick={() => onViewTask(task)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {task.barnName}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {TASK_TYPE_LABELS[task.taskType]}
                            </Badge>
                          </div>
                          <p className="font-medium">{task.taskDescription}</p>
                          <p className="text-sm text-muted-foreground">
                            Nhân viên: {task.employeeName}
                          </p>
                        </div>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : task.status === "in_progress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {task.status === "completed"
                            ? "Hoàn thành"
                            : task.status === "in_progress"
                            ? "Đang làm"
                            : "Chờ xử lý"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">Không có công việc</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onAddTask(dateKey, shift)}
                    >
                      Thêm công việc mới
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TaskCalendar({
  currentDate,
  viewMode,
  tasks,
  onAddTask,
  onViewTask,
}: TaskCalendarProps) {
  // Day view
  if (viewMode === "day") {
    return (
      <DayView
        date={currentDate}
        tasks={tasks}
        onAddTask={onAddTask}
        onViewTask={onViewTask}
      />
    );
  }

  // Get dates based on view mode
  const dates =
    viewMode === "month"
      ? getMonthDates(currentDate)
      : getWeekDates(currentDate);

  // Week day headers
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center py-2 text-sm font-medium",
              index === 0 && "text-red-500"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={cn(
          "grid grid-cols-7",
          viewMode === "month" ? "auto-rows-fr" : "auto-rows-[200px]"
        )}
      >
        {dates.map((date, index) => (
          <div key={index} className="group">
            <DayCell
              date={date}
              isCurrentMonth={isCurrentMonth(date, currentDate)}
              tasks={tasks}
              viewMode={viewMode}
              onAddTask={onAddTask}
              onViewTask={onViewTask}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-3 border-t bg-muted/20">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="font-medium">Ca làm:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border-l-2 border-l-amber-400 bg-amber-50"></span>
            <span>Sáng</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border-l-2 border-l-sky-400 bg-sky-50"></span>
            <span>Chiều</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm border-l-2 border-l-indigo-400 bg-indigo-50"></span>
            <span>Đêm</span>
          </div>
          <span className="mx-2 text-muted-foreground">|</span>
          <span className="font-medium">Loại:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></span>
            <span>Cho ăn</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200"></span>
            <span>Vệ sinh</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-purple-100 border border-purple-200"></span>
            <span>Tiêm vắc-xin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
