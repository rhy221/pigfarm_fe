import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { useState } from "react"
import AddFeedingFormulaModal from "@/app/feeding/components/add_feeding"


export default function FeedingAdjust() {
  const [openModal, setOpenModal] = useState(false)
  const [formulas, setFormulas] = useState<any[]>([])

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <Table>
        <TableHeader className="bg-emerald-600">
          <TableRow>
            <TableHead className="text-white">Tên công thức</TableHead>
            <TableHead className="text-white">Định lượng</TableHead>
            <TableHead className="text-white">Giai đoạn</TableHead>
            <TableHead className="text-white">Thành phần</TableHead>
            <TableHead className="text-white">Giờ cho ăn</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {formulas.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-400">
                Chưa có công thức
              </TableCell>
            </TableRow>
          )}

          {formulas.map((f, index) => (
            <TableRow key={index}>
              <TableCell>{f.name}</TableCell>
              <TableCell>{f.amount}</TableCell>
              <TableCell>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                  {f.stage}
                </span>
              </TableCell>
              <TableCell>{f.ingredients}</TableCell>
              <TableCell>⏰ {f.feedingTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

      <Button
        variant="outline"
        className="text-emerald-600 border-emerald-500"
        onClick={() => setOpenModal(true)}
      >
        + Thêm công thức
      </Button>

      <AddFeedingFormulaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(data) => {
          setFormulas(prev => [...prev, data])
        }}
      />

      <div className="flex justify-end gap-2">
        <Button variant="destructive">Hủy bỏ</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Lưu
        </Button>
      </div>
    </div>
  )
}
