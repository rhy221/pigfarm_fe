"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExpenseTable } from "./components/expense-table"
import { ExpenseDialog } from "./components/expense-dialog"


export interface Expense {
  id: string
  number: string
  category: string
  amount: number
  date: string
  status: "completed" | "pending" | "cancelled"
  notes?: string
}

export default function CostsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      number: "SP001",
      category: "Nhà cung cấp",
      amount: 0,
      date: "18/11/2025",
      status: "completed",
    },
    {
      id: "2",
      number: "SP002",
      category: "Nhân công",
      amount: 50000000,
      date: "19/11/2025",
      status: "pending",
    },
    {
      id: "3",
      number: "SP003",
      category: "Khác",
      amount: 300000,
      date: "19/11/2025",
      status: "completed",
    },
  ])

  const handleCreateExpense = () => {
    setSelectedExpense(null)
    setIsDialogOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDialogOpen(true)
  }

  const handleSaveExpense = (formData: Partial<Expense>) => {
    if (selectedExpense) {
      // Edit mode
      setExpenses(expenses.map((exp) => (exp.id === selectedExpense.id ? { ...exp, ...formData } : exp)))
    } else {
      // Create mode
      const newExpense: Expense = {
        id: Date.now().toString(),
        number: formData.number || "",
        category: formData.category || "",
        amount: formData.amount || 0,
        date: formData.date || "",
        status: formData.status || "pending",
        notes: formData.notes,
      }
      setExpenses([...expenses, newExpense])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chi phí</h1>
          <p className="text-muted-foreground mt-1">Quản lý chi phí trại nuôi</p>
        </div>
        <Button onClick={handleCreateExpense} className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          Lập phiếu chi
        </Button>
      </div>

      {/* Table */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={expenses} onEdit={handleEditExpense} />
        </CardContent>
      </Card>

      {/* Dialog */}
      <ExpenseDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expense={selectedExpense}
        onSave={handleSaveExpense}
      />
    </div>
  )
}
