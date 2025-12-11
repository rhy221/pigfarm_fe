"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FeedingRecord {
  id: string
  penId: string
  formula: string
  quantity: string
  assigned: string
  status: "completed" | "pending" | "incomplete"
}

const data: FeedingRecord[] = [
  {
    id: "1",
    penId: "A101",
    formula: "Cám com",
    quantity: "7kg",
    assigned: "Văn A",
    status: "completed",
  },
  {
    id: "2",
    penId: "A101",
    formula: "Bột cá, tôm",
    quantity: "7kg",
    assigned: "Văn A",
    status: "completed",
  },
  {
    id: "3",
    penId: "A101",
    formula: "Thức ăn công nghiệp",
    quantity: "7kg",
    assigned: "Văn A",
    status: "completed",
  },
  {
    id: "4",
    penId: "A101",
    formula: "Bột cá, tôm",
    quantity: "7kg",
    assigned: "Văn A",
    status: "incomplete",
  },
  {
    id: "5",
    penId: "A101",
    formula: "Thức ăn công nghiệp",
    quantity: "7kg",
    assigned: "Văn A",
    status: "pending",
  },
  {
    id: "6",
    penId: "A101",
    formula: "Cám com",
    quantity: "7kg",
    assigned: "Văn A",
    status: "incomplete",
  },
]

const columns: ColumnDef<FeedingRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 50,
  },
  {
    accessorKey: "penId",
    header: "Chuồng",
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.getValue("penId")}</span>,
  },
  {
    accessorKey: "formula",
    header: "Công thức",
  },
  {
    accessorKey: "quantity",
    header: "Định lượng",
  },
  {
    accessorKey: "assigned",
    header: "Phân công",
  },
  {
    accessorKey: "status",
    header: "Tình trạng",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "completed" ? "default" : status === "incomplete" ? "destructive" : "secondary"}
          className={
            status === "completed"
              ? "bg-success text-white"
              : status === "incomplete"
                ? "bg-warning text-white"
                : "bg-muted text-foreground"
          }
        >
          {status === "completed" ? "Chỉ cho ăn" : status === "incomplete" ? "Chưa cho ăn" : "Dã cho ăn"}
        </Badge>
      )
    },
  },
]

export function FeedingScheduleTable() {
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Trước
        </Button>
        <span className="text-sm text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Sau
        </Button>
      </div>
    </div>
  )
}
