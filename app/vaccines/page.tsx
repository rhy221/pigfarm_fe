import CalendarHeader from "@/app/vaccines/components/vaccine_calendar_header"
import Calendar from "@/app/vaccines/components/vaccine_calendar"

export default function CalendarPage() {
  return (
    <div className="p-6 space-y-4">
        <CalendarHeader />
        <Calendar />
    </div>
  )
}
