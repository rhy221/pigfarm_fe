export type CalendarEvent = {
  id: number
  title: string
  date: string // YYYY-MM-DD
  color: "pink" | "blue" | "orange" | "green"
}

export const events: CalendarEvent[] = [
  { id: 1, title: "Suyễn heo - Mũi 1", date: "2025-03-07", color: "pink" },
  { id: 2, title: "Tai xanh - Mũi 1", date: "2025-03-08", color: "orange" },
  { id: 3, title: "CircoVirus - Mũi 1", date: "2025-03-12", color: "blue" },
  { id: 4, title: "Dịch tả heo cổ điển - Mũi 1", date: "2025-03-13", color: "green" },
  { id: 5, title: "Suyễn heo - Mũi 1", date: "2025-03-13", color: "pink" },
]

