"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function BarnDetailPage() {
  const router = useRouter()

  // mock data
  const barn = {
    name: "Chuồng A1",
    pigs: 80,
    capacity: 100,
    temperature: 32,
    humidity: 78,
    status: "Cảnh báo",
  }

  const pigs = [
    { id: "00030001", tag: "0001", weight: 50 },
    { id: "00030002", tag: "0002", weight: 52 },
    { id: "00030003", tag: "0003", weight: 48 },
  ]

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>

        <h1 className="text-lg font-semibold">{barn.name}</h1>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Xóa chuồng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== INFO CARD ===== */}
      <div className="rounded-lg border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Số heo</span>
          <span className="font-medium">
            {barn.pigs} / {barn.capacity}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>🌡 Nhiệt độ</span>
          <span className="font-medium text-orange-500">
            {barn.temperature}°C
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>💧 Độ ẩm</span>
          <span className="font-medium">{barn.humidity}%</span>
        </div>

        <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
          {barn.status}
        </span>
      </div>

      {/* ===== TABLE ===== */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium">Danh sách heo</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>STT</TableHead>
              <TableHead>Mã số</TableHead>
              <TableHead>Mã tai</TableHead>
              <TableHead className="text-right">Trọng lượng (kg)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pigs.map((pig, index) => (
              <TableRow key={pig.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pig.id}</TableCell>
                <TableCell>{pig.tag}</TableCell>
                <TableCell className="text-right">
                  {pig.weight}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ===== ACTION ===== */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Chuyển chuồng</Button>
        <Button>Tiếp nhận heo</Button>
      </div>
    </div>
  )
}
