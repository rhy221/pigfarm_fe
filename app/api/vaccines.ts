import { CalendarEvent } from "@/app/vaccines/components/vacccine_calendar"

/**
 * Base API URL
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001" 

/* =====================================================
 * TYPES
 * ===================================================== */

export type VaccinationPen = {
  scheduleId?: string | null 
  templateId?: string        
  penId?: string            
  penName: string
  status: string             
  isReal: boolean            
}

export type VaccinationGroup = {
  vaccineName: string
  stage: number
  totalPens: number
  pens: VaccinationPen[]
}

export type VaccineSuggestion = {
  vaccineId: string
  name: string
  daysOld: number
  dosage: string
  description: string;
  color: string;
}

export type VaccineSampleItem = {
  id: string
  name: string
  dose: string
  age: string     
  note?: string
  
  vaccineId?: string 
  stage?: number
  daysOld?: number
}

export type Pen = {
  id: string
  name: string
}

export type Vaccine = {
  id: string
  name: string
}

/* =====================================================
 * 1. LỊCH TỔNG QUAN (CALENDAR)
 * GET /health/vaccination/calendar
 * ===================================================== */
export async function fetchVaccinationCalendar(
  month: number,
  year: number
): Promise<CalendarEvent[]> {
  try {
    const res = await fetch(
      `${API_URL}/vaccination/calendar?month=${month}&year=${year}`,
      { cache: "no-store" }
    )
    if (!res.ok) throw new Error("Failed fetch calendar")

    const data: Record<string, any[]> = await res.json()
    const events: CalendarEvent[] = []

    Object.entries(data).forEach(([date, items]) => {
      items.forEach(item => {
        let color: CalendarEvent["color"] = "blue"
        if (item.status === 'completed') color = "green"
        else if (item.type === 'forecast') color = "orange"
        
        events.push({
          id: item.id,
          title: item.name,
          date: date, 
          color: color,
        } as any)
      })
    })

    return events
  } catch (error) {
    console.error(error)
    return []
  }
}

/* =====================================================
 * 2. CHI TIẾT NGÀY (SIDE PANEL)
 * GET /health/vaccination/details
 * ===================================================== */
export async function fetchVaccinationDetails(date: string): Promise<VaccinationGroup[]> {
  try {
    const res = await fetch(`${API_URL}/vaccination/details?date=${date}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed fetch details")
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

/* =====================================================
 * 3. ĐÁNH DẤU ĐÃ TIÊM (QUAN TRỌNG)
 * PATCH /health/vaccination/complete
 * ===================================================== */
export async function markVaccinated(items: any[]) {
  const res = await fetch(`${API_URL}/vaccination/complete`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }), 
  })

  if (!res.ok) throw new Error("Failed to mark completed")
  return res.json()
}

/* =====================================================
 * 4. TẠO LỊCH THỦ CÔNG
 * POST /health/vaccination/manual
 * ===================================================== */
export async function createVaccinationSchedule(payload: any) {
  const res = await fetch(`${API_URL}/vaccination/manual`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // 🔥 GỬI NGUYÊN PAYLOAD
  })

  if (!res.ok) throw new Error("Failed create schedule")
  return res.json()
}


/* =====================================================
 * 5. MẪU TIÊM CHỦNG (TEMPLATES)
 * GET /vaccination/templates
 * ===================================================== */
export async function fetchVaccineSamples(): Promise<VaccineSampleItem[]> {
  const res = await fetch(`${API_URL}/vaccination/templates`, { cache: "no-store" })
  
  if (!res.ok) {
    console.error("Lỗi fetchVaccineSamples:", res.status, res.statusText);
    return [] 
  }
  
  const data = await res.json()
  
  return data.map((t: any) => ({
    id: t.id,
    name: t.vaccineName,    
    dose: t.dosage,         
    age: t.daysOldText,     
    note: t.notes,          
    
    vaccineId: t.vaccineId,
    stage: t.stage,
    daysOld: t.daysOld
  }))
}

/* =====================================================
 * 6. GỢI Ý TIÊM (SUGGESTIONS)
 * GET /health/templates/suggestions
 * ===================================================== */
export async function fetchVaccineSuggestions(): Promise<VaccineSuggestion[]> {
  const res = await fetch(`${API_URL}/vaccination/templates/suggestions`, { cache: "no-store" })
  if (!res.ok) return []
  return await res.json()
}

/* =====================================================
 * FETCH PENS (CHUỒNG)
 * GET /health/pens
 * ===================================================== */
export async function fetchAvailablePens(): Promise<{id: string, name: string}[]> {
  try {
    const res = await fetch(`${API_URL}/health/pens`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch pens")
    }

    const data = await res.json()
    
    return data.map((item: any) => ({
        id: item.id,
        name: item.pen_name || item.name || "Chuồng không tên" 
    }))

  } catch (error) {
    console.error("fetchAvailablePens error:", error)
    return []
  }
}

/* =====================================================
 * FETCH VACCINES (HỆ THỐNG)
 * GET /health/vaccines
 * ===================================================== */
export async function fetchVaccines(): Promise<{id: string, name: string}[]> {
  try {
    const res = await fetch(`${API_URL}/vaccination/vaccine-list`, {
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

export async function saveVaccinationTemplates(data: any[]) {
  const res = await fetch(`${API_URL}/vaccination/templates`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Save failed")
  return res.json()
}
export async function deleteTemplateItem(id: string) {
  await fetch(`${API_URL}/vaccination/templates/item/${id}`, { method: "DELETE" })
}

export async function addTemplateItem(data: any) {
  const res = await fetch(`${API_URL}/vaccination/templates/item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add template item");
  return res.json();
}