const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/* ================= TYPES ================= */
export type Pen = {
  id: string
  name: string
  currentPigs: number
  capacity: number
  temperature: number
  humidity: number
  status: "normal" | "warning" | "danger"
  statusLabel: string
  color: string
}

export type DashboardStats = {
  totalPigs: number
  activePens: number
  tempAlert: number
  humidityAlert: number
  newPigs7Days: number
}

export type Pig = {
  id: string
  earTagNumber: string
  weight: number
  growthStage: string | null
  createdAt: string

  breed: {
    id: string
    name: string
  }

  status: {
    id: string
    name: string
  }
}


/* ================= API ================= */
export const barnsApi = {
  // ===== DASHBOARD STATS =====
  // GET /pig/stats
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_URL}/pig/stats`)
    if (!res.ok) throw new Error("Failed to fetch stats")
    return res.json()
  },

    // ===== DANH SÁCH CHUỒNG =====
    // GET /pig/pens
    getPens: async (): Promise<Pen[]> => {
      const res = await fetch(`${API_URL}/pig/pens`)
      if (!res.ok) throw new Error("Failed to fetch pens")

      const data = await res.json()

      return data.map((item: any) => ({
        id: item.id,
        name: item.name ?? "Chuồng không tên",
        currentPigs: item.currentPigs ?? 0,
        capacity: item.capacity ?? 0,
        temperature: item.temperature ?? 0,
        humidity: item.humidity ?? 0,
        status: item.status ?? "normal",
        statusLabel: item.statusLabel ?? "",
        color: item.color ?? "green",
      }))
    },

  // ===== TIẾP NHẬN HEO (IMPORT BATCH) =====
  // POST /pig/import-batch
  importBatch: async (payload: {
    existingBatchId?: string | null
    batchName?: string
    penId: string
    breedId?: string
    arrivalDate: string
    quantity: number
    daysOld: number
    vaccineIds: string[]
  }) => {
    const res = await fetch(`${API_URL}/pig/import-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Lỗi khi tiếp nhận heo")
    }

    return res.json()
  },

  // ===== CẬP NHẬT CHI TIẾT HEO (HÀNG LOẠT) =====
  // PUT /pig/update-details
  updatePigDetails: async (payload: {
      items: {
        id: string
        earTag: string
        weight: number
      }[]
    }) => {
    const res = await fetch(`${API_URL}/pig/update-details`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Lỗi cập nhật heo")
    }

    return res.json()
  },

  // ===== DANH SÁCH CHUỒNG CÁCH LY =====
  // GET /pig/isolation-pens
  getIsolationPens: async (): Promise<{ id: string; name: string }[]> => {
    const res = await fetch(`${API_URL}/pig/isolation-pens`)
    if (!res.ok) throw new Error("Failed to fetch isolation pens")

    const data = await res.json()

    return data.map((item: any) => ({
      id: item.id,
      name: item.pen_name || item.name || "Chuồng cách ly",
    }))
  },

  // ===== CHUYỂN CHUỒNG =====
  // POST /pig/transfer
  transferPigs: async (payload: {
    pig_ids: string[]
    from_pen_id: string
    to_pen_id: string
    transfer_type: "NORMAL" | "ISOLATION"
  }) => {
    const res = await fetch(`${API_URL}/pig/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || "Lỗi chuyển chuồng")
    }

    return res.json()
  },

  /* ===== GIỐNG ===== */
getBreeds: async (): Promise<{ id: string; name: string }[]> => {
  const res = await fetch(`${API_URL}/pig/breeds`)
  if (!res.ok) throw new Error("Failed to fetch breeds")

  const data = await res.json()

  return data.map((b: any) => ({
    id: b.id,
    name: b.breed_name
  }))
},

/* ===== VACCINE ===== */
getVaccines: async (): Promise<{ id: string; name: string }[]> => {
  const res = await fetch(`${API_URL}/vaccination/vaccine-list`)
  if (!res.ok) throw new Error("Failed to fetch vaccines")
  return res.json()
},

// ===== DANH SÁCH HEO TRONG CHUỒNG =====
// GET /pig/pen/{penId}
getPigsByPenId: async (penId: string): Promise<Pig[]> => {
  const res = await fetch(`${API_URL}/pig/pen/${penId}`)
  if (!res.ok) throw new Error("Failed to fetch pigs in pen")

  const data = await res.json()

  return data.map((p: any) => ({
    id: p.id,
    earTagNumber: p.ear_tag_number,
    weight: p.weight,
    growthStage: p.growth_stage,
    createdAt: p.created_at,

    breed: {
      id: p.pig_breeds?.id,
      name: p.pig_breeds?.breed_name,
    },

    status: {
      id: p.pig_statuses?.id,
      name: p.pig_statuses?.status_name,
    },
  }))
},

    // GET /pig/batches
    getPigBatches: async () => {
      const res = await fetch(`${API_URL}/pig/batches`)

      if (!res.ok) {
        throw new Error("Lỗi lấy danh sách lứa heo")
      }

      return res.json() as Promise<{
        id: string
        batch_name: string
        arrival_date: string
      }[]>
    },

    // ===== CHUYỂN CHUỒNG (THƯỜNG / CÁCH LY) =====
    // POST /pig/transfer
    transferPig: async (payload: {
      pigIds: string[]
      targetPenId: string
      isIsolation: boolean
      diseasedAt?: string
      diseaseId?: string
      symptoms?: string
    }) => {
      const res = await fetch(`${API_URL}/pig/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Lỗi khi chuyển chuồng")
      }

      return res.json()
    },
}
