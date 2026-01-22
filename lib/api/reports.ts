import http from "../http";

export const reportApi = {
  // Herd Report
  getHerdReport: async (params?: {
    date?: string;
    month?: string;
    pen?: string;
    batch?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(`/report/herd${query ? `?${query}` : ""}`);
    return response.data;
  },

  // Inventory Report
  getInventoryReport: async (params?: {
    month?: string;
    warehouseId?: string;
    categoryId?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // Vaccine Report
  getVaccineReport: async (params?: { month?: string; vaccine?: string }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/vaccines${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  getVaccinesList: async () => {
    const response = await http.get("/report/vaccines-list");
    return response.data;
  },

  // Expenses Report
  getExpensesReport: async (params?: {
    month?: string;
    category?: string;
    status?: string;
    type?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/expenses${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // Revenue Report
  getRevenueReport: async (params?: { month?: string }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/revenue${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // ===== PHASE 1 & 2 REPORTS =====

  // 1. Expiring Inventory Report
  getExpiringInventoryReport: async (params?: {
    daysThreshold?: number;
    warehouseId?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/expiring${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // 2. Low Stock Report
  getLowStockReport: async (params?: { warehouseId?: string }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/low-stock${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // 3. Aging Inventory Report
  getAgingInventoryReport: async (params?: {
    agingDaysThreshold?: number;
    warehouseId?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/aging${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // 4. Inventory Movement Report
  getInventoryMovementReport: async (params?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
    warehouseId?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/movement${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // 5. Batch Report
  getBatchReport: async (params?: {
    productId?: string;
    warehouseId?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/batch${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  // 6. Stock Card Report
  getStockCardReport: async (params?: {
    productId?: string;
    warehouseId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(
      `/report/inventory/stock-card${query ? `?${query}` : ""}`
    );
    return response.data;
  },
};
