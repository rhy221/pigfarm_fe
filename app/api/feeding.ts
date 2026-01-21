import axios from "axios"

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
})

/* ================= TYPES ================= */
export type FeedingFormulaItem = {
  productId: string
  percentage: number
}

export type FeedingFormulaPayload = {
  name: string
  startDay: number
  amountPerPig: number
  items: FeedingFormulaItem[]
}

export type FeedingFormula = {
  id: string
  name: string
  description?: string
  items: FeedingFormulaItem[]
  createdAt: string
}

export type FeedingProduct = {
  id: string
  name: string
}

export type FeedingFormulaPayload2 = {
  name: string
  startDay: number
  amountPerPig: number
  items: {
    productId: string
    percentage: number
  }[]
}

type FeedingPlanResponse = {
  timeline: {
    label: string        // "Tháng 1"
    desc: string         // "0 - 29 ngày"
    startDay: number
    endDay: number
    isCurrent: boolean
    status: "current" | "future" | "past"
  }[]
}

type FeedingDetail = {
  penName: string
  formulaName: string
  ingredientsText: string
  pigCount: number
  amountPerPig: number
  totalFeedAmount: string
}

/* ================= API ================= */
export const feedingApi = {
  /* ===== TẠO CÔNG THỨC ===== */
  createFormula(payload: FeedingFormulaPayload2) {
    return api
      .post("/feeding/formula", payload)
      .then(res => res.data)
  },

  /* ===== LẤY DANH SÁCH CÔNG THỨC ===== */
  getFormulas() {
    return api
      .get<FeedingFormula[]>("/feeding/formulas")
      .then(res => res.data)
  },

  /* ===== CẬP NHẬT CÔNG THỨC ===== */
  updateFormula(id: string, payload: FeedingFormulaPayload) {
    return api
      .put(`/feeding/formula/${id}`, payload)
      .then(res => res.data)
  },

  /* ===== XOÁ CÔNG THỨC ===== */
  deleteFormula(id: string) {
    return api
      .delete(`/feeding/formula/${id}`)
      .then(res => res.data)
  },

  /* ===== TÍNH LỊCH CHO ĂN THEO LỨA ===== */
  getFeedingPlan(batchId: string) {
    return api
      .get(`/feeding/plan/${batchId}`)
      .then(res => res.data)
  },  

  /**
   * Lấy danh sách nguyên liệu thức ăn (type = feed)
   */
  fetchFeedProducts: async (search?: string): Promise<FeedingProduct[]> => {
    const res = await api.get("/warehouse-categories/products", {
      params: {
        type: "feed",      // 👈 cố định cho feeding
        search,            // optional
      },
    })

    return res.data
  },
}
