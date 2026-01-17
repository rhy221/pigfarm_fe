"use client"

import { useState } from "react"
import FeedingHeader from "./components/feeding_header"
import FeedingSchedule from "./components/feeding_schedule"
import FeedingAdjust from "./components/feeding_adjust"

export type FeedingTab = "schedule" | "adjust"

export default function FeedingPage() {
  const [tab, setTab] = useState<FeedingTab>("schedule")

  return (
    <div className="p-6 space-y-4">
      <FeedingHeader tab={tab} onChangeTab={setTab} />

      {tab === "schedule" && <FeedingSchedule />}
      {tab === "adjust" && <FeedingAdjust />}
    </div>
  )
}
