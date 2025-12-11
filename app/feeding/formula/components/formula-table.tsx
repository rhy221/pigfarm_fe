"use client"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface FormulaItem {
  id: string
  name: string
  quantity: string
  stage: string
  components: string
  feedingTimes: string[]
}

const data: FormulaItem[] = [
  {
    id: "1",
    name: "Cám gạo",
    quantity: "— gram/con",
    stage: "Môi về đến 30kg",
    components: "50% Cám, 50% Bột cá",
    feedingTimes: ["8:30", "14:00"],
  },
  {
    id: "2",
    name: "Thức ăn công nghiệp",
    quantity: "— gram/con",
    stage: "30kg đến 60kg",
    components: "40% Cám, 30% Bột cá, 30% Chất xơ",
    feedingTimes: ["8:00", "12:00", "16:00"],
  },
  {
    id: "3",
    name: "Bột",
    quantity: "— gram/con",
    stage: "60kg đến xuất chuồng",
    components: "50% Cám, 25% Bột cá, 25% Chất xơ",
    feedingTimes: ["7:00", "13:00"],
  },
]

const columns: ColumnDef<FormulaItem>[] = [
  {
    accessorKey: "name",
    header: "Tên công thức",
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Định lượng trên con heo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.getValue("quantity")}</span>
        <input
          type="text"
          placeholder="Nhập số"
          className="w-24 px-2 py-1 border border-border rounded bg-input text-foreground text-sm"
        />
      </div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Giai đoạn",
  },
  {
    accessorKey: "components",
    header: "Thành phần",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue("components") as string).split(",").map((comp, idx) => (
          <Badge key={idx} variant="outline" className="bg-primary/5">
            {comp.trim()}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "feedingTimes",
    header: "Giờ cho ăn",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {(row.getValue("feedingTimes") as string[]).map((time, idx) => (
          <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
            {time}
          </Badge>
        ))}
      </div>
    ),
  },
]

export function FeedingFormulaTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="border border-primary/30 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-primary/30">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-primary font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-primary/20 hover:bg-primary/5 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Thêm công thức
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent"
          >
            Hủy bỏ
          </Button>
          <Button className="bg-primary hover:bg-primary-dark text-white">Lưu</Button>
        </div>
      </div>
    </div>
  )
}
