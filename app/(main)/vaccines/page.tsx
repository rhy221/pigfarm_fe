"use client"

import { useState } from "react"
import CalendarHeader from "@/app/(main)/vaccines/components/vaccine_calendar_header"
import Calendar from "@/app/(main)/vaccines/components/vaccine_calendar"
import VaccineSample from "@/app/(main)/vaccines/components/vaccine_sample"

export type VaccineTab = "vaccines" | "vaccines_sample"

export default function CalendarPage() {
  const [tab, setTab] = useState<VaccineTab>("vaccines")

  return (
    <div className="p-6 space-y-4">
      <CalendarHeader tab={tab} onChangeTab={setTab} />

      {tab === "vaccines" && <Calendar />}
      {tab === "vaccines_sample" && <VaccineSample />}
    </div>
  )
}