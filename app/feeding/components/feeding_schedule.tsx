import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import FeedingTimeline from "./feeding_timeline"

const data = [
  {
    chuong: "A101",
    formula: "Cám con",
    amount: "7kg",
    staff: "Văn A",
    status: "Chưa cho ăn",
  },
  {
    chuong: "A101",
    formula: "Bột cá, tôm",
    amount: "7kg",
    staff: "Văn A",
    status: "Đã cho ăn",
  },
]

export default function FeedingSchedule() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <FeedingTimeline />

      <Table>
        <TableHeader className="bg-emerald-600">
          <TableRow>
            <TableHead className="text-white w-10"></TableHead>
            <TableHead className="text-white">Chuồng</TableHead>
            <TableHead className="text-white">Công thức</TableHead>
            <TableHead className="text-white">Định lượng</TableHead>
            <TableHead className="text-white">Phân công</TableHead>
            <TableHead className="text-white">Tình trạng</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <input type="checkbox" />
              </TableCell>
              <TableCell>{row.chuong}</TableCell>
              <TableCell>{row.formula}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.staff}</TableCell>
              <TableCell
                className={
                  row.status === "Đã cho ăn"
                    ? "text-emerald-600 font-medium"
                    : "text-orange-500 font-medium"
                }
              >
                {row.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Đã cho ăn
        </Button>
      </div>
    </div>
  )
}
