"use client"
import { Card, CardContent } from "@/components/ui/card"
import { FeedingFormulaTable } from "./components/formula-table"

export default function FeedingFormulaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Công thức cho ăn</h1>
          <p className="text-muted-foreground mt-1">Quản lý các công thức dinh dưỡng</p>
        </div>
      </div>

      {/* Formula Table */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <FeedingFormulaTable />
        </CardContent>
      </Card>
    </div>
  )
}
