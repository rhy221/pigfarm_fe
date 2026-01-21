"use client"

import { useEffect, useState } from "react"
import { feedingApi } from "@/app/api/feeding"
import { barnsApi } from "@/app/api/barns"

/* ================= TYPES ================= */
type StageType = "normal" | "alert" | "done" | "current"

type TimelineItem = {
  label: string
  desc: string
  isCurrent: boolean
}

type Batch = {
  id: string
  batch_name: string
}

/* ✅ PROPS */
type Props = {
  onBatchChange: (batchId: string) => void
}

/* ================= UTILS ================= */
function getDotStyle(isCurrent: boolean) {
  return isCurrent ? "bg-emerald-500" : "bg-red-500"
}

/* ================= COMPONENT ================= */
export default function FeedingTimeline({ onBatchChange }: Props) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [batchId, setBatchId] = useState("")
  const [timeline, setTimeline] = useState<TimelineItem[]>([])

  /* ===== FETCH BATCHES ===== */
  useEffect(() => {
    const fetchBatches = async () => {
      const res = await barnsApi.getPigBatches()
      setBatches(res)
      if (res.length > 0) {
        setBatchId(res[0].id)
        onBatchChange(res[0].id) // ✅ báo cho cha
      }
    }
    fetchBatches()
  }, [])

  /* ===== FETCH TIMELINE ===== */
  useEffect(() => {
    if (!batchId) return

    const fetchTimeline = async () => {
      const res = await feedingApi.getFeedingPlan(batchId)
      setTimeline(res.timeline || [])
    }

    fetchTimeline()
    onBatchChange(batchId) // ✅ báo cho cha
  }, [batchId])

  return (
    <div className="space-y-4">
      {/* DROPDOWN LỨA */}
      <select
        className="border rounded px-3 py-2 text-sm w-64"
        value={batchId}
        onChange={e => setBatchId(e.target.value)}
      >
        {batches.map(b => (
          <option key={b.id} value={b.id}>
            {b.batch_name}
          </option>
        ))}
      </select>

      {/* TIMELINE */}
      <div className="relative w-full py-6">
        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-emerald-400" />

        <div className="flex justify-between items-center relative">
          {timeline.map((item, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <div className="h-10 w-px bg-emerald-400" />

              <div
                className={`w-6 h-6 rounded-full border-2 border-white ${getDotStyle(
                  item.isCurrent
                )}`}
              />

              <div className="mt-2 text-xs font-medium text-slate-600">
                {item.label}
              </div>

              <div className="absolute -top-14 bg-emerald-600 text-white text-xs px-3 py-1 rounded-md shadow">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
