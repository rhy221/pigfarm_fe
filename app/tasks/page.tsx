"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task, ViewMode, ShiftType } from "./types";
import { TaskCalendar } from "./components/task-calendar";
import { AddEditTaskDialog } from "./components/add-edit-task-dialog";
import { TaskDetailDialog } from "./components/task-detail-dialog";
import { taskApi } from "@/lib/api";

export default function TasksPage() {
  const isMobile = useIsMobile();

  // State
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to current date
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    isMobile ? "week" : "month"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [pens, setPens] = useState<any[]>([]);

  // Fetch tasks from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, employeesData, pensData] = await Promise.all([
          taskApi.getTasks() || [],
          taskApi.getEmployees() || [],
          taskApi.getPens() || [],
        ]);

        interface ApiEmployee {
          id: string;
          name: string;
        }

        interface ApiPen {
          id: string;
          name: string;
        }

        // Ensure we have arrays
        const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
        const safeEmployeesData = Array.isArray(employeesData) ? employeesData : [];
        const safePensData = Array.isArray(pensData) ? pensData : [];

        // Transform API data to match Task interface
        const transformedTasks = safeTasksData.map((task) => ({
          id: task.id,
          date: task.date || new Date().toISOString().split("T")[0],
          shift: (task.shift as ShiftType) || "morning",
          employeeId: task.employeeId || "",
          employeeName: task.employeeName || "Chưa phân công",
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
        setEmployees(
          safeEmployeesData.map((e: any) => ({
            id: e.id,
            name: e.name,
            role: e.role || "employee",
          }))
        );
        setPens(
          safePensData.map((p: any) => ({
            id: p.id,
            name: p.name || p.pen_name || "",
            code: p.code || "",
            capacity: p.capacity || 0,
            currentCount: p.currentCount || 0,
          }))
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftType | null>(null);

  // Get current month/year display text
  const monthYearText = useMemo(() => {
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
  }, [currentDate]);

  // Navigation handlers
  const goToPrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (viewMode === "week") {
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
      if (viewMode === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (viewMode === "week") {
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

  // Task CRUD handlers
  const handleAddTask = (date?: string, shift?: ShiftType) => {
    setSelectedTask(null);
    setSelectedDate(date || null);
    setSelectedShift(shift || null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedDate(null);
    setSelectedShift(null);
    setIsDetailDialogOpen(false);
    setIsAddEditDialogOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setIsDetailDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    try {
      if (taskData.id) {
        // Update existing task
        await taskApi.updateTask(taskData.id, {
          taskDescription: taskData.taskDescription,
          barnId: taskData.barnId,
          employeeId: taskData.employeeId,
          taskType: taskData.taskType,
          status: taskData.status,
          notes: taskData.notes,
          shift: taskData.shift,
          date: taskData.date,
        });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskData.id
              ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
              : t
          )
        );
      } else {
        // Add new task
        const newTask = await taskApi.createTask({
          taskDescription: taskData.taskDescription,
          barnId: taskData.barnId,
          employeeId: taskData.employeeId,
          taskType: taskData.taskType,
          status: taskData.status,
          notes: taskData.notes,
          shift: taskData.shift,
          date: taskData.date,
        });

        const transformedTask: Task = {
          id: newTask.id,
          date: newTask.date,
          shift: newTask.shift as ShiftType,
          employeeId: newTask.employeeId,
          employeeName: newTask.employeeName,
          barnId: newTask.barnId,
          barnName: newTask.barnName,
          taskType: newTask.taskType as any,
          taskDescription: newTask.taskDescription,
          status: newTask.status as any,
          notes: newTask.notes,
          createdAt: newTask.createdAt,
          updatedAt: newTask.updatedAt,
        };

        setTasks((prev) => [...prev, transformedTask]);
      }

      setIsAddEditDialogOpen(false);
      setSelectedTask(null);
      setSelectedDate(null);
      setSelectedShift(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // View mode icons
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
      <div className="flex flex-col gap-4 p-4 border-b bg-background sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Navigation */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold sm:text-2xl">
            Phân công công việc
          </h1>
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
            <span className="px-2 text-sm font-medium min-w-[120px] text-center">
              {monthYearText}
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
            {(["month", "week", "day"] as ViewMode[]).map((mode) => (
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

          {/* Add Task Button */}
          <Button size="sm" className="h-8" onClick={() => handleAddTask()}>
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Thêm phân công</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto p-4">
        <TaskCalendar
          currentDate={currentDate}
          viewMode={viewMode}
          tasks={tasks}
          onAddTask={handleAddTask}
          onViewTask={handleViewTask}
        />
      </div>

      {/* Dialogs */}
      <AddEditTaskDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        task={selectedTask}
        defaultDate={selectedDate}
        defaultShift={selectedShift}
        employees={employees}
        barns={pens}
        onSave={handleSaveTask}
      />

      <TaskDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        task={selectedTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
