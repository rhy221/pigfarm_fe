"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { dashboardApi } from "@/app/api/barns" // Import api vừa tạo

type Pen = {
  id: string
  pen_name: string
  capacity: number
  temperature: number
  humidity: number
  pigs: { id: string }[] // Dựa vào PensService include pigs
}

type DashboardStats = {
  totalPigs: number
  activePens: number
  tempAlert: number
  humidityAlert: number
  newPigs7Days: number
}

const statusMap = {
  normal: { label: "Bình thường", color: "bg-green-100 text-green-700" },
  warning: { label: "Cảnh báo", color: "bg-yellow-100 text-yellow-700" },
  danger: { label: "Nguy hiểm", color: "bg-red-100 text-red-700" },
}

function StatCard({
  title,
  value,
  alert = false,
}: {
  title: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${alert ? "border-red-200 bg-red-50/40" : "bg-background"}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter()
  const [pens, setPens] = React.useState<Pen[]>([])
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, pensData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getPens()
        ])
        setStats(statsData)
        setPens(pensData)
      } catch (error) {
        console.error("Fetch data error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ===== KPI CARDS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="🐖 Tổng số heo" value={stats?.totalPigs || 0} />
        <StatCard title="🏠 Chuồng hoạt động" value={stats?.activePens || 0} />
        <StatCard title="🌡 Chuồng vượt nhiệt" value={stats?.tempAlert || 0} alert />
        <StatCard title="💧 Chuồng vượt ẩm" value={stats?.humidityAlert || 0} alert />
        <StatCard title="➕ Heo mới (7 ngày)" value={stats?.newPigs7Days || 0} />
      </div>

      {/* ===== DANH SÁCH CHUỒNG ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách chuồng heo</h2>
        <Button onClick={() => router.push("/barns_in")}>
          Tiếp nhận heo mới
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pens.map((pen) => {
          const currentPigs = pen.pigs.length
          const status = pen.temperature >= 35 ? "danger" : pen.temperature >= 31 ? "warning" : "normal"
          return (
            <div
              key={pen.id}
              className="rounded-xl border bg-background p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold">{pen.pen_name}</h3>
                <button className="rounded-md p-1 hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Số heo</span>
                  <span className="font-medium">
                    {currentPigs} / {pen.capacity || 100}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>🌡 Nhiệt độ</span>
                  <span
                    className={`font-medium ${
                      pen.temperature >= 35 ? "text-red-600" : 
                      pen.temperature >= 31 ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {pen.temperature}°C
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>💧 Độ ẩm</span>
                  <span className="font-medium">{pen.humidity}%</span>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`font-medium ${
                    pen.temperature >= 35
                      ? "text-red-600"
                      : pen.temperature >= 30
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {statusMap[status as keyof typeof statusMap].label}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push(`/barns/${pen.id}`)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
