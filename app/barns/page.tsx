"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

type Pen = {
  id: string;
  name: string;
  current: number;
  capacity: number;
  temperature: number;
  humidity: number;
  status: "normal" | "warning" | "danger";
};

const stats = {
  totalPigs: 1240,
  activePens: 18,
  tempAlert: 3,
  humidityAlert: 2,
  newPigs7Days: 86,
};

const pens: Pen[] = [
  {
    id: "A1",
    name: "Chuồng A1",
    current: 80,
    capacity: 100,
    temperature: 32,
    humidity: 78,
    status: "warning",
  },
  {
    id: "B2",
    name: "Chuồng B2",
    current: 95,
    capacity: 100,
    temperature: 36,
    humidity: 85,
    status: "danger",
  },
  {
    id: "C1",
    name: "Chuồng C1",
    current: 60,
    capacity: 80,
    temperature: 28,
    humidity: 65,
    status: "normal",
  },
];

const statusMap = {
  normal: {
    label: "Bình thường",
    color: "bg-green-100 text-green-700",
  },
  warning: {
    label: "Cảnh báo",
    color: "bg-yellow-100 text-yellow-700",
  },
  danger: {
    label: "Nguy hiểm",
    color: "bg-red-100 text-red-700",
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ===== KPI CARDS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="🐖 Tổng số heo" value={stats.totalPigs} />
        <StatCard title="🏠 Chuồng hoạt động" value={stats.activePens} />
        <StatCard title="🌡 Chuồng vượt nhiệt" value={stats.tempAlert} alert />
        <StatCard title="💧 Chuồng vượt ẩm" value={stats.humidityAlert} alert />
        <StatCard title="➕ Heo mới (7 ngày)" value={stats.newPigs7Days} />
      </div>

      {/* ===== CORE SCREEN: DANH SÁCH CHUỒNG ===== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách chuồng heo</h2>
        <Button>➕ Tiếp nhận heo mới</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pens.map((pen) => (
          <div
            key={pen.id}
            className="rounded-xl border bg-background p-4 shadow-sm transition hover:shadow-md"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold">{pen.name}</h3>
              <button className="rounded-md p-1 hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Số heo</span>
                <span className="font-medium">
                  {pen.current} / {pen.capacity}
                </span>
              </div>

              <div className="flex justify-between">
                <span>🌡 Nhiệt độ</span>
                <span
                  className={`font-medium ${
                    pen.temperature >= 35
                      ? "text-red-600"
                      : pen.temperature >= 30
                        ? "text-yellow-600"
                        : "text-green-600"
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

            {/* Status */}
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  statusMap[pen.status].color
                }`}
              >
                {statusMap[pen.status].label}
              </span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                Xem chi tiết
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== SUB COMPONENT ===== */

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
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        alert ? "border-red-200 bg-red-50/40" : "bg-background"
      }`}
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
