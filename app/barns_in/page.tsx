"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { ArrowLeft, ChevronDown } from "lucide-react"

/* ================= TYPES ================= */
type PigRow = {
  id: number
  code: string
  earTag: string
  weight?: number
}

/* ================= PAGE ================= */
export default function PigIntakePage() {
  const router = useRouter()

  /* ===== FORM ===== */
  const [batch, setBatch] = React.useState("")
  const [selectedBarn, setSelectedBarn] = React.useState<string | null>(null)

  /* giả lập danh sách chuồng trống */
  const emptyBarns = ["A001", "A002", "B001"]

  /* ===== INLINE FLOW ===== */
  const [showCount, setShowCount] = React.useState(false)
  const [showDetail, setShowDetail] = React.useState(false)

  /* ===== COUNT ===== */
  const [count, setCount] = React.useState(0)

  /* ===== DETAIL ===== */
  const [rows, setRows] = React.useState<PigRow[]>([])

  const createRows = () => {
    const data: PigRow[] = Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      code: `PIG-${batch}-${i + 1}`,
      earTag: "",
    }))
    setRows(data)
    setShowDetail(true)
  }

  const updateRow = (
    id: number,
    field: keyof PigRow,
    value: string | number
  ) => {
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">Tiếp nhận heo</span>
      </div>

      {/* ================= FORM ================= */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Lứa">
          <input
            type="text"
            className="input"
            placeholder="Nhập lứa (vd: 03)"
            value={batch}
            onChange={e => setBatch(e.target.value)}
          />
        </Field>

        <Field label="Chuồng">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedBarn ?? "Chọn chuồng trống"}
                <ChevronDown className="size-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {emptyBarns.map(b => (
                <DropdownMenuItem
                  key={b}
                  onClick={() => setSelectedBarn(b)}
                >
                  Chuồng {b}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!batch || !selectedBarn}
          onClick={() => {
            setShowCount(true)
            setShowDetail(false)
          }}
        >
          Lưu
        </Button>
      </div>

      {/* ================= NHẬP SỐ LƯỢNG ================= */}
      {showCount && (
        <div className="mt-8 space-y-4">
          <SectionTitle title="Nhập số lượng" />

          <Field label="Số lượng con">
            <input
              type="number"
              min={1}
              className="input"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
            />
          </Field>

          <div className="flex justify-end">
            <Button disabled={count <= 0} onClick={createRows}>
              Tạo danh sách
            </Button>
          </div>
        </div>
      )}

      {/* ================= CHI TIẾT ================= */}
      {showDetail && (
        <div className="mt-10 space-y-4">
          <SectionTitle title="Chi tiết từng con" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã số</TableHead>
                <TableHead>Mã tai</TableHead>
                <TableHead>Trọng lượng</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    <input
                      className="table-input"
                      value={r.code}
                      onChange={e =>
                        updateRow(r.id, "code", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      className="table-input"
                      value={r.earTag}
                      onChange={e =>
                        updateRow(r.id, "earTag", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      className="table-input"
                      value={r.weight ?? ""}
                      onChange={e =>
                        updateRow(r.id, "weight", Number(e.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowDetail(false)}
            >
              Hủy
            </Button>
            <Button>Xác nhận</Button>
          </div>
        </div>
      )}

      {/* ===== STYLES ===== */}
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

/* ================= COMPONENTS ================= */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="relative flex items-center">
      <div className="flex-grow border-t" />
      <span className="mx-3 text-sm text-muted-foreground">{title}</span>
      <div className="flex-grow border-t" />
    </div>
  )
}
