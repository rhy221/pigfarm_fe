// src/services/api.ts
const API_URL = 'http://localhost:3001'; // Thay đổi theo URL của backend

export const dashboardApi = {
  // Lấy thống kê KPI
  getStats: async () => {
    const res = await fetch(`${API_URL}/pig/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Lấy danh sách chuồng (Bao gồm nhiệt độ/độ ẩm random từ BE)
  getPens: async () => {
    const res = await fetch(`${API_URL}/pig/pens`);
    if (!res.ok) throw new Error('Failed to fetch pens');
    return res.json();
  },
  // Lấy chi tiết 1 chuồng (bao gồm danh sách heo bên trong)
  getPenDetail: async (id: string) => {
    const res = await fetch(`${API_URL}/pens/${id}`); // Giả định endpoint của bạn là /pens/:id
    if (!res.ok) throw new Error('Failed to fetch pen detail');
    return res.json();
  }
};