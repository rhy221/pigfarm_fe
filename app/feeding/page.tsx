"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FeedingScheduleTable } from "./components/feeding-schedule-table"
import { FeedingTimeline } from "./components/feeding-timeline"

export default function FeedingPage() {
  const [selectedTime, setSelectedTime] = useState("9:00")

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cho ăn</h1>
          <p className="text-muted-foreground mt-1">Quản lý thời biểu và lịch cho ăn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Lịch cho ăn</Button>
          <Button className="bg-primary hover:bg-primary-dark text-white">Điều chỉnh</Button>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <FeedingTimeline selectedTime={selectedTime} onSelectTime={setSelectedTime} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">{selectedTime}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">15 chuồng phải cho ăn</p>
            </div>
            <Button className="bg-primary hover:bg-primary-dark text-white">Đã cho ăn</Button>
          </div>
        </CardHeader>
        <CardContent>
          <FeedingScheduleTable />
        </CardContent>
      </Card>
    </div>
  )
}
