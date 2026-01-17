import http from "../http";

export const reportApi = {
  // Herd Report
  getHerdReport: async (params?: { date?: string; pen?: string }) => {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(([, v]) => v != null)
      ) as Record<string, string>
    ).toString();
    const response = await http.get(`/report/herd${query ? `?${query}` : ""}`);
    return response.data;
  },

  // Inventory Report
  getInventoryReport: async (params?: { month?: string }) => {
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
};
