"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import FeedingTimeline from "./feeding_timeline"
import { feedingApi } from "@/app/api/feeding"

/* ================= TYPES ================= */
type FeedingDetail = {
  penName: string
  formulaName: string
  ingredientsText: string
  pigCount: number
  amountPerPig: number
  totalFeedAmount: string
}

/* ================= COMPONENT ================= */
export default function FeedingSchedule() {
  const [batchId, setBatchId] = useState<string>("")
  const [details, setDetails] = useState<FeedingDetail[]>([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH TABLE DATA ================= */
  useEffect(() => {
    if (!batchId) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await feedingApi.getFeedingPlan(batchId)
        setDetails(res.details || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [batchId])

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* TIMELINE + CHỌN LỨA */}
      <FeedingTimeline onBatchChange={setBatchId} />

      {/* TABLE */}
      <Table>
        <TableHeader className="bg-emerald-600">
          <TableRow>
            <TableHead className="text-white">Chuồng</TableHead>
            <TableHead className="text-white">Công thức</TableHead>
            <TableHead className="text-white">Thành phần</TableHead>
            <TableHead className="text-white">Số heo</TableHead>
            <TableHead className="text-white">Lượng / con</TableHead>
            <TableHead className="text-white">Tổng lượng</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : details.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            details.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.penName}</TableCell>
                <TableCell className="font-medium">
                  {row.formulaName}
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {row.ingredientsText}
                </TableCell>
                <TableCell>{row.pigCount}</TableCell>
                <TableCell>{row.amountPerPig} g</TableCell>
                <TableCell className="font-semibold">
                  {row.totalFeedAmount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
