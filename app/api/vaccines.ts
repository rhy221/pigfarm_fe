import { CalendarEvent } from "@/app/vaccines/components/vacccine_calendar"

/**
 * Base API URL
 * VD: http://localhost:3001
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

/**
 * Map màu từ BE → FE (calendar)
 */
const colorMap: Record<string, CalendarEvent["color"]> = {
  "#3B82F6": "blue",
  "#10B981": "green",
  orange: "orange",
  red: "pink",
}

/* =====================================================
 * TYPES
 * ===================================================== */

export type VaccinationPen = {
  penId?: string
  penName: string
  status: "pending" | "completed"
  scheduleId?: string | null
}

export type VaccinationGroup = {
  vaccineName: string
  stage: number
  totalPens: number
  pens: VaccinationPen[]
}

export type VaccineSchedulePayload = {
  date: string        // YYYY-MM-DD
  time: string        // HH:mm
  vaccineName: string
  stage: number
  color: string
  penIds: string[]
}

export type Pen = {
  id: string
  name: string
}

export type Vaccine = {
  id: string
  name: string
}

export type VaccineSampleItem = {
  id: number
  name: string
  dose: string
  age: string
  note?: string
}

/* =====================================================
 * FETCH CALENDAR (THEO THÁNG)
 * GET /health/vaccination/calendar
 * ===================================================== */

export async function fetchVaccinationCalendar(
  month: number,
  year: number
): Promise<CalendarEvent[]> {
  try {
    const res = await fetch(
      `${API_URL}/health/vaccination/calendar?month=${month}&year=${year}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch vaccination calendar")
    }

    const data: Record<string, any[]> = await res.json()
    const events: CalendarEvent[] = []

    Object.entries(data).forEach(([date, items]) => {
      items.forEach(item => {
        events.push({
          id: item.id,
          title: item.name,
          date, // YYYY-MM-DD
          color: colorMap[item.color] || "blue",
        })
      })
    })

    return events
  } catch (error) {
    console.error("fetchVaccinationCalendar error:", error)
    return []
  }
}

/* =====================================================
 * FETCH DETAILS (SIDE PANEL – THEO NGÀY)
 * GET /health/vaccination/details?date=YYYY-MM-DD
 * ===================================================== */

export async function fetchVaccinationDetails(
  date: string
): Promise<VaccinationGroup[]> {
  try {
    const res = await fetch(
      `${API_URL}/health/vaccination/details?date=${date}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch vaccination details")
    }

    return await res.json()
  } catch (error) {
    console.error("fetchVaccinationDetails error:", error)
    return []
  }
}

/* =====================================================
 * CREATE SCHEDULE
 * POST /health/vaccination
 * ===================================================== */

export async function createVaccinationSchedule(
  payload: VaccineSchedulePayload
) {
  const res = await fetch(`${API_URL}/health/vaccination`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Create vaccination schedule failed")
  }

  return res.json()
}

/* =====================================================
 * UPDATE SCHEDULE
 * PUT /health/vaccination/:id
 * ===================================================== */

export async function updateVaccinationSchedule(
  id: string,
  payload: VaccineSchedulePayload
) {
  const res = await fetch(`${API_URL}/health/vaccination/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("Update vaccination schedule failed")
  }

  return res.json()
}

/* =====================================================
 * DELETE SCHEDULE
 * DELETE /health/vaccination/:id
 * ===================================================== */

export async function deleteVaccinationSchedule(id: string) {
  const res = await fetch(
    `${API_URL}/health/vaccination/${id}`,
    { method: "DELETE" }
  )

  if (!res.ok) {
    throw new Error("Delete vaccination schedule failed")
  }
}

/* =====================================================
 * MARK COMPLETED
 * PATCH /health/vaccination/:id/complete
 * ===================================================== */

export async function completeVaccination(id: string) {
  const res = await fetch(
    `${API_URL}/health/vaccination/${id}/complete`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    }
  )

  if (!res.ok) {
    throw new Error("Complete vaccination failed")
  }

  return res.json()
}

/* =====================================================
 * FETCH PENS (CHUỒNG)
 * GET /health/pens
 * ===================================================== */

export async function fetchAvailablePens(): Promise<Pen[]> {
  try {
    const res = await fetch(`${API_URL}/health/pens`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch pens")
    }

    return await res.json()
  } catch (error) {
    console.error("fetchAvailablePens error:", error)
    return []
  }
}

/* =====================================================
 * FETCH VACCINES (HỆ THỐNG)
 * GET /health/vaccines
 * ===================================================== */

export async function fetchVaccines(): Promise<Vaccine[]> {
  try {
    const res = await fetch(`${API_URL}/health/vaccines`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch vaccines")
    }

    return await res.json()
  } catch (error) {
    console.error("fetchVaccines error:", error)
    return []
  }
}

export async function fetchVaccineSamples(): Promise<VaccineSampleItem[]> {
  try {
    const res = await fetch(`${API_URL}/health/vaccine-samples`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Fetch vaccine samples failed")
    }

    return await res.json()
  } catch (error) {
    console.error("fetchVaccineSamples error:", error)
    return []
  }
}
