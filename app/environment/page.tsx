"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { AlertDialog } from "./components/alert-dialog"
import { EnvironmentTable } from "./components/environment-table"
export interface EnvironmentAlert {
  id: string
  pen: string
  type: "temperature" | "humidity" | "other"
  message: string
  value: number
  unit: string
  timestamp: string
  recommendations: string
}

export interface EnvironmentData {
  id: string
  stt: number
  pen: string
  temperature: number
  humidity: number
  status: string
  water: number
  alert?: EnvironmentAlert
}

export default function EnvironmentPage() {
  const [selectedDate, setSelectedDate] = useState("20/11/2025")
  const [selectedAlert, setSelectedAlert] = useState<EnvironmentAlert | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const [environmentData] = useState<EnvironmentData[]>([
    {
      id: "1",
      stt: 1,
      pen: "A001",
      temperature: 35,
      humidity: 70,
      status: "warning",
      water: 500,
      alert: {
        id: "alert-1",
        pen: "A001",
        type: "temperature",
        message: "Nhiệt độ cao vượt ngưỡng an toàn!",
        value: 35,
        unit: "°C",
        timestamp: "10:45, 20/11/2025",
        recommendations:
          "Kiểm tra và bật hệ thống phun sương làm mát. Mở toàn bộ cửa thông gió và quạt hút công suất tối đa. Kiểm tra lại nếu mất độ mát (số lượng con) trong chuồng.",
      },
    },
    {
      id: "2",
      stt: 2,
      pen: "A002",
      temperature: 30,
      humidity: 70,
      status: "normal",
      water: 500,
    },
    {
      id: "3",
      stt: 3,
      pen: "A003",
      temperature: 29,
      humidity: 70,
      status: "normal",
      water: 500,
    },
  ])

  const handleAlertClick = (alert: EnvironmentAlert) => {
    setSelectedAlert(alert)
    setIsAlertOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Môi trường</h1>
        <p className="text-muted-foreground mt-1">Chi tiết</p>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <Input type="text" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-32" />
        <Calendar className="w-5 h-5 text-primary cursor-pointer" />
      </div>

      {/* Table */}
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <EnvironmentTable data={environmentData} onAlertClick={handleAlertClick} />
        </CardContent>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog isOpen={isAlertOpen} onOpenChange={setIsAlertOpen} alert={selectedAlert} />
    </div>
  )
}
