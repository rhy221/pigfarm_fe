import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

export default function FeedingAdjust() {
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
          <TableRow>
            <TableCell>Cám gạo</TableCell>
            <TableCell>__ gram/con</TableCell>
            <TableCell>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                Mới về đến 30kg
              </span>
            </TableCell>
            <TableCell>50% Cám • 50% Bột cá</TableCell>
            <TableCell>⏰ giờ</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        variant="outline"
        className="text-emerald-600 border-emerald-500"
      >
        + Thêm công thức
      </Button>

      <div className="flex justify-end gap-2">
        <Button variant="destructive">Hủy bỏ</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Lưu
        </Button>
      </div>
    </div>
  )
}
