"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import TransferBarnModal from "@/app/barns_detail/barns_transfer_modal"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
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
  const [openTransfer, setOpenTransfer] = useState(false)


  /* ================= MOCK DATA ================= */
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

  /* ================= SEARCH ================= */
  const [search, setSearch] = React.useState("")

  const filteredPigs = React.useMemo(() => {
    if (!search.trim()) return pigs

    const keyword = search.toLowerCase()

    return pigs.filter(
      pig =>
        pig.id.toLowerCase().includes(keyword) ||
        pig.tag.toLowerCase().includes(keyword)
    )
  }, [search, pigs])

  const [selectedPigIds, setSelectedPigIds] = React.useState<string[]>([])
  const isAllSelected =
  filteredPigs.length > 0 &&
  filteredPigs.every(pig => selectedPigIds.includes(pig.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // bỏ chọn tất cả (chỉ bỏ các con đang hiển thị)
      setSelectedPigIds(prev =>
        prev.filter(id => !filteredPigs.some(p => p.id === id))
      )
    } else {
      // chọn tất cả (chỉ chọn các con đang hiển thị)
      setSelectedPigIds(prev => {
        const ids = filteredPigs.map(p => p.id)
        return Array.from(new Set([...prev, ...ids]))
      })
    }
  }


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

      {/* ===== SEARCH + TABLE ===== */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm theo mã số hoặc mã tai..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <span className="text-sm text-slate-500">
            {filteredPigs.length} con
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>

              <TableHead>STT</TableHead>
              <TableHead>Mã số</TableHead>
              <TableHead>Mã tai</TableHead>
              <TableHead className="text-right">
                Trọng lượng (kg)
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPigs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-slate-400"
                >
                  Không tìm thấy heo phù hợp
                </TableCell>
              </TableRow>
            )}

            {filteredPigs.map((pig, index) => (
              <TableRow key={pig.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPigIds.includes(pig.id)}
                    onCheckedChange={(checked) => {
                      setSelectedPigIds(prev =>
                        checked
                          ? [...prev, pig.id]
                          : prev.filter(id => id !== pig.id)
                      )
                    }}
                  />

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
        <Button
          variant="outline"
          disabled={selectedPigIds.length === 0}
          onClick={() => setOpenTransfer(true)}
        >
          Chuyển chuồng
        </Button>
          <TransferBarnModal
          isOpen={openTransfer}
          onClose={() => setOpenTransfer(false)}
          selectedPigIds={selectedPigIds}
          barns={[
            { id: "B1", name: "Chuồng B1" },
            { id: "C2", name: "Chuồng C2" },
          ]}
          onSubmit={(payload) => {
            console.log("TRANSFER PAYLOAD:", payload)
            // gọi API tại đây
          }}
        />

        {/* <Button>Tiếp nhận heo</Button> */}
      </div>
    </div>
  )
}
