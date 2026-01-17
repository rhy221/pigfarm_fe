"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Plus } from "lucide-react"
import { ArrowLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { ChevronDown } from "lucide-react"

type PigRow = {
  id: number
  code: string
  earTag: string
  weight?: number
}



export default function PigIntakePage() {
  const [rows, setRows] = React.useState<PigRow[]>([
    { id: 1, code: "00030001", earTag: "0001", weight: 50 },
    { id: 2, code: "00030002", earTag: "0002" },
  ])

  const addRow = () => {
    const nextId = rows.length + 1
    setRows([
      ...rows,
      {
        id: nextId,
        code: `0003000${nextId}`,
        earTag: `000${nextId}`,
      },
    ])
  }

  const updateWeight = (id: number, value: string) => {
    setRows(prev =>
      prev.map(r =>
        r.id === id ? { ...r, weight: Number(value) } : r
      )
    )
  }

  const router = useRouter()

  const [selectedBarn, setSelectedBarn] = React.useState("A001")
  const [breed, setBreed] = React.useState("Landrace")

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-1">
                    Chuồng {selectedBarn}
                    <ChevronDown className="size-4 opacity-70" />
                </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSelectedBarn("A001")}>
                    Chuồng A001
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedBarn("A002")}>
                    Chuồng A002
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedBarn("B001")}>
                    Chuồng B001
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    </div>

      {/* ===== FORM THÔNG TIN ===== */}
      <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2">
        <div className="space-y-3">
          <Field label="Ngày">
            <input type="date" className="input" defaultValue="2025-10-21" />
          </Field>

          <Field label="Lứa">
            <input type="text" className="input" defaultValue="03" />
          </Field>

          <Field label="Ngày tuổi">
            <input type="number" className="input" defaultValue={30} />
          </Field>
        </div>

        <div className="space-y-3">
          <Field label="Giống">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                >
                    {breed}
                    <ChevronDown className="size-4 opacity-60" />
                </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onClick={() => setBreed("Landrace")}>
                    Landrace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBreed("Yorkshire")}>
                    Yorkshire
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Field>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Vaccine</span>
            <Button size="icon-sm" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ===== ACTIONS TOP ===== */}
      <div className="flex justify-end gap-2">
        <Button> Xác nhận </Button>
        <Button variant="destructive"> Hủy </Button>
      </div>
        <div className="relative my-6 flex items-center">
        {/* Line */}
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
        </div>

        {/* Title */}
        <span className="relative bg-white pr-3 text-sm text-muted-foreground">
            Chi tiết
        </span>
        </div>
      {/* ===== TABLE ===== */}
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-4 mb-2">
          {/* <span className="text-sm text-muted-foreground">Chi tiết</span> */}
          <div className="flex gap-2">
            <Button size="sm">Lưu</Button>
            <Button size="sm" variant="destructive">
              Xóa
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>STT</TableHead>
              <TableHead>Mã số</TableHead>
              <TableHead>Mã tai</TableHead>
              <TableHead>Trọng lượng</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <input
                    className="table-input"
                    defaultValue={row.code}
                  />
                </TableCell>
                <TableCell>
                  <input
                    className="table-input"
                    defaultValue={row.earTag}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="table-input"
                    value={row.weight ?? ""}
                    onChange={e =>
                      updateWeight(row.id, e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}

            {/* Add row */}
            <TableRow>
              <TableCell colSpan={5}>
                <button
                  onClick={addRow}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Thêm dòng
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ===== STYLE SHORTCUT ===== */}
      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 6px;
          border: 1px solid hsl(var(--border));
          padding: 6px 10px;
          font-size: 14px;
        }
        .table-input {
          width: 100%;
          border-bottom: 1px solid hsl(var(--border));
          padding: 4px 2px;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

/* ===== FIELD ===== */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
