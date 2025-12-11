"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { EnvironmentData, EnvironmentAlert } from "../page"

interface EnvironmentTableProps {
  data: EnvironmentData[]
  onAlertClick: (alert: EnvironmentAlert) => void
}

export function EnvironmentTable({ data, onAlertClick }: EnvironmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary/5 hover:bg-primary/5">
          <TableHead className="text-primary font-semibold">STT</TableHead>
          <TableHead className="text-primary font-semibold">Chuồng</TableHead>
          <TableHead className="text-primary font-semibold">Nhiệt độ (độ C)</TableHead>
          <TableHead className="text-primary font-semibold">Độ ẩm (%)</TableHead>
          <TableHead className="text-primary font-semibold">Thông thường/Gió</TableHead>
          <TableHead className="text-primary font-semibold">Lương nước tiêu thụ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            className={row.status === "warning" ? "bg-red-50 hover:bg-red-100 cursor-pointer" : "hover:bg-slate-50"}
            onClick={() => row.alert && onAlertClick(row.alert)}
          >
            <TableCell className="font-medium">{row.stt}</TableCell>
            <TableCell className="font-medium">{row.pen}</TableCell>
            <TableCell>{row.temperature}</TableCell>
            <TableCell>{row.humidity}</TableCell>
            <TableCell>
              {row.status === "warning" ? (
                <span className="text-red-600 font-medium cursor-pointer hover:underline">Cảnh báo</span>
              ) : (
                <span className="text-green-600 font-medium">Bình thường</span>
              )}
            </TableCell>
            <TableCell>{row.water} Lít</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
