"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, TrendingUp, TrendingDown } from "lucide-react";

// Mock data
const mockData = {
  revenues: [
    { id: 1, item: "Bán heo thịt", amount: 450000000, type: "revenue" },
    { id: 2, item: "Bán heo giống", amount: 180000000, type: "revenue" },
    { id: 3, item: "Bán phân hữu cơ", amount: 25000000, type: "revenue" },
  ],
  expenses: [
    { id: 4, item: "Chi phí thức ăn", amount: 280000000, type: "expense" },
    { id: 5, item: "Chi phí thuốc, vắc-xin", amount: 45000000, type: "expense" },
    { id: 6, item: "Chi phí nhân công", amount: 120000000, type: "expense" },
    { id: 7, item: "Chi phí điện nước", amount: 30000000, type: "expense" },
    { id: 8, item: "Chi phí bảo trì", amount: 20000000, type: "expense" },
    { id: 9, item: "Chi phí khác", amount: 15000000, type: "expense" },
  ],
};

export default function RevenueReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  const totalRevenue = mockData.revenues.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalExpense = mockData.expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = (netProfit / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#53A88B]">
            Báo cáo Doanh thu
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng hợp thu chi và lợi nhuận
          </p>
        </div>
        <Button
          onClick={handleExportPDF}
          className="gap-2 bg-[#53A88B] hover:bg-[#458F79]"
        >
          <FileDown className="w-4 h-4" />
          Xuất PDF
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tháng</SelectItem>
            <SelectItem value="1">Tháng 1</SelectItem>
            <SelectItem value="2">Tháng 2</SelectItem>
            <SelectItem value="3">Tháng 3</SelectItem>
            <SelectItem value="4">Tháng 4</SelectItem>
            <SelectItem value="5">Tháng 5</SelectItem>
            <SelectItem value="6">Tháng 6</SelectItem>
            <SelectItem value="7">Tháng 7</SelectItem>
            <SelectItem value="8">Tháng 8</SelectItem>
            <SelectItem value="9">Tháng 9</SelectItem>
            <SelectItem value="10">Tháng 10</SelectItem>
            <SelectItem value="11">Tháng 11</SelectItem>
            <SelectItem value="12">Tháng 12</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Chọn năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">Năm 2024</SelectItem>
            <SelectItem value="2023">Năm 2023</SelectItem>
            <SelectItem value="2022">Năm 2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Tổng doanh thu</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-1">VNĐ</p>
        </div>

        <div className="p-6 bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Tổng chi phí</p>
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {totalExpense.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-1">VNĐ</p>
        </div>

        <div className="p-6 bg-linear-to-br from-[#53A88B] to-[#458F79] text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Lợi nhuận ròng</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{netProfit.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">VNĐ</p>
        </div>

        <div className="p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Tỷ suất lợi nhuận</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{profitMargin.toFixed(1)}%</p>
          <p className="text-xs opacity-75 mt-1">Margin</p>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-green-800">
            Các khoản thu
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Khoản mục</TableHead>
              <TableHead className="font-semibold text-right">
                Số tiền (VNĐ)
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tỷ trọng (%)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.revenues.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.item}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {row.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {((row.amount / totalRevenue) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-green-50 font-bold">
              <TableCell>TỔNG DOANH THU</TableCell>
              <TableCell className="text-right text-green-700">
                {totalRevenue.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Expense Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="bg-red-50 px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-red-800">Các khoản chi</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Khoản mục</TableHead>
              <TableHead className="font-semibold text-right">
                Số tiền (VNĐ)
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tỷ trọng (%)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.expenses.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.item}</TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {row.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {((row.amount / totalExpense) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-red-50 font-bold">
              <TableCell>TỔNG CHI PHÍ</TableCell>
              <TableCell className="text-right text-red-700">
                {totalExpense.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Net Profit Summary */}
      <div className="rounded-lg border-2 border-[#53A88B] bg-linear-to-r from-[#53A88B]/10 to-[#53A88B]/5 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#53A88B] mb-2">
              LỢI NHUẬN RÒNG
            </h3>
            <p className="text-gray-600">
              Doanh thu - Chi phí = Lợi nhuận
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-[#53A88B]">
              {netProfit.toLocaleString()}
            </p>
            <p className="text-lg text-gray-600 mt-1">VNĐ</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#53A88B]/30">
          <h4 className="font-semibold text-gray-700 mb-3">Phân tích:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Chi phí lớn nhất:</span>{" "}
              {mockData.expenses.reduce((max, item) =>
                item.amount > max.amount ? item : max
              ).item}
            </div>
            <div>
              <span className="font-medium">Nguồn thu chính:</span>{" "}
              {mockData.revenues.reduce((max, item) =>
                item.amount > max.amount ? item : max
              ).item}
            </div>
            <div>
              <span className="font-medium">ROI:</span>{" "}
              {((netProfit / totalExpense) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
