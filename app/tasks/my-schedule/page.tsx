"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  CalendarDays,
  User,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { taskApi } from "@/lib/api";
import {
  Task,
  ViewMode,
  ShiftType,
  SHIFT_LABELS,
  TASK_TYPE_LABELS,
  STATUS_LABELS,
  DAY_OF_WEEK_LABELS,
  ROLE_PERMISSIONS,
  Employee,
} from "../types";
import { TaskDetailDialog } from "../components/task-detail-dialog";

// Helper functions
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
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

export default function MySchedulePage() {
  const isMobile = useIsMobile();

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    isMobile ? "day" : "week"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, employeesData] = await Promise.all([
          taskApi.getTasks() || [],
          taskApi.getEmployees() || [],
        ]);

        const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
        const safeEmployeesData = Array.isArray(employeesData)
          ? employeesData
          : [];

        // Hardcoded user (Trần Thanh Bình)
        const hardcodedUser = {
          id: "16d0fc9a-52df-4f58-9ea7-832fbd1f6756",
          name: "Trần Thanh Bình",
          role: "employee" as const,
          email: "thanhbinhtran123@gmail.com",
          phone: "0987654321",
        };

        setUser(hardcodedUser);

        const transformedTasks = safeTasksData.map((task) => ({
          id: task.id,
          date: task.date || new Date().toISOString().split("T")[0],
          shift: (task.shift as ShiftType) || "morning",
          userId: task.userId || "",
          userName: task.userName || "Chưa phân công",
          barnId: task.barnId || "",
          barnName: task.barnName || "Chưa chọn",
          taskType: (task.taskType as any) || "other",
          taskDescription: task.taskDescription || "",
          status: (task.status as any) || "pending",
          notes: task.notes || "",
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || new Date().toISOString(),
        }));

        setTasks(transformedTasks);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchData();
  }, []);

  // Filter tasks based on user role
  const allowedTaskTypes = useMemo(() => {
    if (!user) return [];
    const role = user.role || "employee";
    return ROLE_PERMISSIONS[role] || [];
  }, [user]);

  // Filter tasks for current user
  const myTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter((task) => {
      // Check if task type is allowed for this role
      const isAllowedType = allowedTaskTypes.includes(task.taskType);
      // Check if task is assigned to this user
      const isAssignedToMe = task.userId === user.id;

      return isAllowedType && isAssignedToMe;
    });
  }, [allowedTaskTypes, user, tasks]);

  // Get date range based on view mode
  const dateRange = useMemo(() => {
    const dates: Date[] = [];

    if (viewMode === "day") {
      dates.push(new Date(currentDate));
    } else if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        dates.push(d);
      }
    } else {
      // Month view - just show current week for simplicity in my schedule
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        dates.push(d);
      }
    }

    return dates;
  }, [currentDate, viewMode]);

  // Get tasks for display based on date range
  const tasksInRange = useMemo(() => {
    const dateKeys = dateRange.map((d) => formatDateKey(d));
    return myTasks.filter((task) => dateKeys.includes(task.date));
  }, [myTasks, dateRange]);

  // Get current period text
  const periodText = useMemo(() => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } else {
      const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  }, [currentDate, viewMode]);

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month" || viewMode === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };

  const goToNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month" || viewMode === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // View task
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };
  const handleCompleteTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      await taskApi.updateTask(taskId, {
        status: "completed",
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: "completed", updatedAt: new Date().toISOString() }
            : t
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };
  // Role display
  const roleLabels: Record<string, string> = {
    admin: "Quản lý",
    employee: "Nhân viên",
    veterinarian: "Bác sĩ thú y",
  };

  // View mode config
  const viewModeIcons: Record<ViewMode, React.ReactNode> = {
    month: <LayoutGrid className="h-4 w-4" />,
    week: <CalendarDays className="h-4 w-4" />,
    day: <List className="h-4 w-4" />,
  };

  const viewModeLabels: Record<ViewMode, string> = {
    month: "Tháng",
    week: "Tuần",
    day: "Ngày",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border-b bg-background">
        {/* Title row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">
                Lịch làm việc của tôi
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.name || "Người dùng"}</span>
                <Badge variant="outline" className="text-xs">
                  {roleLabels[user?.role || "employee"]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Allowed task types indicator */}
          <div className="flex flex-wrap items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-1">
              Công việc:
            </span>
            {allowedTaskTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className={cn("text-xs", TASK_TYPE_COLORS[type])}
              >
                {TASK_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Navigation */}
          <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[100px] text-center truncate">
              {periodText}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Today button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8"
          >
            Hôm nay
          </Button>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-lg border bg-card p-1">
            {(["week", "day"] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode(mode)}
              >
                {viewModeIcons[mode]}
                <span className="ml-1 hidden sm:inline">
                  {viewModeLabels[mode]}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === "day" ? (
          /* Day View */
          <DayScheduleView
            date={currentDate}
            tasks={tasksInRange}
            onViewTask={handleViewTask}
          />
        ) : (
          /* Week View */
          <WeekScheduleView
            dates={dateRange}
            tasks={tasksInRange}
            onViewTask={handleViewTask}
          />
        )}

        {/* Empty state */}
        {tasksInRange.length === 0 && (
          <Card className="mt-4">
            <CardContent className="py-8 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Không có công việc nào trong khoảng thời gian này
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Detail Dialog (read-only for employees) */}
      <TaskDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        task={selectedTask}
        onEdit={() => {}} // Disabled for employee view
        onDelete={() => {}} // Disabled for employee view
        onComplete={handleCompleteTask}
        readonly={true}
      />
    </div>
  );
}

// Day Schedule View Component
interface DayScheduleViewProps {
  date: Date;
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

function DayScheduleView({ date, tasks, onViewTask }: DayScheduleViewProps) {
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

  const SHIFT_COLORS: Record<ShiftType, string> = {
    morning: "border-l-amber-400",
    afternoon: "border-l-sky-400",
    night: "border-l-indigo-400",
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
            })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dayTasks.length} công việc hôm nay
          </p>
        </div>
      </div>

      {/* Shifts */}
      <div className="space-y-4">
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
              <div className="p-3 border-b">
                <h3 className="font-semibold">{SHIFT_LABELS[shift]}</h3>
                <p className="text-xs text-muted-foreground">
                  {shiftTimeRanges[shift]}
                </p>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-2">
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
                    </div>
                    <Badge variant={STATUS_BADGE_VARIANTS[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week Schedule View Component
interface WeekScheduleViewProps {
  dates: Date[];
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

function WeekScheduleView({ dates, tasks, onViewTask }: WeekScheduleViewProps) {
  const shifts: ShiftType[] = ["morning", "afternoon", "night"];

  const SHIFT_COLORS: Record<ShiftType, string> = {
    morning: "border-l-amber-400 bg-amber-50/50",
    afternoon: "border-l-sky-400 bg-sky-50/50",
    night: "border-l-indigo-400 bg-indigo-50/50",
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "text-center py-2 border-r last:border-r-0",
              isToday(date) && "bg-primary/10"
            )}
          >
            <p className="text-xs text-muted-foreground">
              {DAY_OF_WEEK_LABELS[date.getDay()]}
            </p>
            <p
              className={cn(
                "text-lg font-semibold",
                isToday(date) && "text-primary"
              )}
            >
              {date.getDate()}
            </p>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7">
        {dates.map((date, dateIndex) => {
          const dateKey = formatDateKey(date);
          const dayTasks = tasks.filter((t) => t.date === dateKey);

          return (
            <div
              key={dateIndex}
              className={cn(
                "min-h-[200px] border-r last:border-r-0 p-1",
                isToday(date) && "bg-primary/5"
              )}
            >
              {shifts.map((shift) => {
                const shiftTasks = dayTasks.filter((t) => t.shift === shift);
                if (shiftTasks.length === 0) return null;

                return shiftTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "mb-1 p-2 rounded border-l-2 cursor-pointer text-xs",
                      "hover:shadow transition-shadow",
                      task.status === "completed" && "opacity-60 bg-gray-50",
                      SHIFT_COLORS[task.shift],
                      TASK_TYPE_COLORS[task.taskType]
                    )}
                    onClick={() => onViewTask(task)}
                  >
                    <p
                      className={cn(
                        "font-medium truncate",
                        task.status === "completed" &&
                          "line-through text-muted-foreground"
                      )}
                    >
                      {task.barnName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {SHIFT_LABELS[task.shift]}
                    </p>
                  </div>
                ));
              })}

              {dayTasks.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">-</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
