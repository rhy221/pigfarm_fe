import http from "../http";

export interface TaskResponse {
  id: string;
  date: string;
  shift: "morning" | "afternoon" | "night";
  barnId: string;
  barnName: string;
  employeeId: string;
  employeeName: string;
  taskType: string;
  taskDescription: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  date: string;
  shift: string;
  barnId: string;
  employeeId: string;
  taskType: string;
  taskDescription: string;
  status?: string;
  notes?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export const taskApi = {
  // Get all tasks
  getTasks: async () => {
    const response = await http.get<TaskResponse[]>("/work/tasks");
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string) => {
    const response = await http.get<TaskResponse>(`/work/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (data: CreateTaskDto) => {
    const response = await http.post<TaskResponse>("/work/tasks", data);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, data: UpdateTaskDto) => {
    const response = await http.put<TaskResponse>(`/work/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await http.delete(`/work/tasks/${id}`);
    return response.data;
  },

  // Get employees
  getEmployees: async () => {
    const response = await http.get("/work/employees");
    return response.data;
  },

  // Get pens
  getPens: async () => {
    const response = await http.get("/work/pens");
    return response.data;
  },
};
