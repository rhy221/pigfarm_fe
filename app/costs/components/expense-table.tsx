"use client"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Expense } from "../page"

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
}

const getStatusDisplay = (status: string) => {
  const statusMap: Record<string, { label: string; variant: string }> = {
    completed: { label: "Đã thanh toán", variant: "default" },
    pending: { label: "Công nợ", variant: "secondary" },
    cancelled: { label: "Hủy", variant: "destructive" },
  }
  return statusMap[status] || { label: status, variant: "default" }
}

export function ExpenseTable({ expenses, onEdit }: ExpenseTableProps) {
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "id",
      header: "STT",
      cell: (info) => (info.row.index + 1).toString(),
    },
    {
      accessorKey: "number",
      header: "Số phiếu",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "category",
      header: "Đối tượng",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "category",
      header: "Loại chi phí",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "amount",
      header: "Số tiền",
      cell: (info) => {
        const amount = info.getValue() as number
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)
      },
    },
    {
      accessorKey: "date",
      header: "Ngày phát sinh",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: "Tình trạng",
      cell: (info) => {
        const status = info.getValue() as string
        const display = getStatusDisplay(status)
        return <Badge variant={display.variant as "default" | "secondary" | "destructive"}>{display.label}</Badge>
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <button onClick={() => onEdit(row.original)} className="text-primary hover:underline text-sm font-medium">
          Chỉnh sửa
        </button>
      ),
    },
  ]

  const table = useReactTable({
    data: expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-foreground font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-border hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Tổng: {expenses.length} phiếu</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}
