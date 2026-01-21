// Types for Task Management

export type UserRole = "admin" | "employee" | "veterinarian";

export type ShiftType = "morning" | "afternoon" | "night";

export type TaskType =
  | "feeding"
  | "cleaning"
  | "health_check"
  | "vaccination"
  | "monitoring"
  | "other";

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  email?: string;
}

export interface Barn {
  id: string;
  name: string;
  code: string;
  capacity: number;
  currentCount: number;
}

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD format
  shift: ShiftType;
  barnId: string;
  barnName: string;
  userId: string;
  userName: string;
  taskType: TaskType;
  taskDescription: string;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: {
    morning: Task | null;
    afternoon: Task | null;
    night: Task | null;
  };
}

export type ViewMode = "month" | "week" | "day";

// Role permissions for viewing tasks
export const ROLE_PERMISSIONS: Record<UserRole, TaskType[]> = {
  admin: [
    "feeding",
    "cleaning",
    "health_check",
    "vaccination",
    "monitoring",
    "other",
  ],
  employee: ["feeding", "cleaning"],
  veterinarian: ["health_check", "vaccination"],
};

// Task type labels in Vietnamese
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  feeding: "Cho ăn",
  cleaning: "Vệ sinh",
  health_check: "Khám bệnh",
  vaccination: "Tiêm vắc-xin",
  monitoring: "Giám sát",
  other: "Khác",
};

// Shift labels in Vietnamese
export const SHIFT_LABELS: Record<ShiftType, string> = {
  morning: "Sáng",
  afternoon: "Chiều",
  night: "Đêm",
};

// Status labels in Vietnamese
export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Chờ thực hiện",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

// Day of week labels in Vietnamese
export const DAY_OF_WEEK_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
