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
import { FileDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Mock data for chart
const chartData = [
  { month: "Tháng 1", value: 150 },
  { month: "Tháng 2", value: 165 },
  { month: "Tháng 3", value: 180 },
  { month: "Tháng 4", value: 175 },
  { month: "Tháng 5", value: 190 },
  { month: "Tháng 6", value: 200 },
];

// Mock data for table
const mockTableData = [
  {
    id: 1,
    vatTu: "Thức ăn hỗn hợp",
    tonDau: 500,
    phatSinh: 200,
    tonCuoi: 400,
  },
  {
    id: 2,
    vatTu: "Vitamin tổng hợp",
    tonDau: 100,
    phatSinh: 50,
    tonCuoi: 80,
  },
  {
    id: 3,
    vatTu: "Thuốc kháng sinh",
    tonDau: 80,
    phatSinh: 30,
    tonCuoi: 60,
  },
  {
    id: 4,
    vatTu: "Vắc-xin dịch tả",
    tonDau: 200,
    phatSinh: 100,
    tonCuoi: 150,
  },
  {
    id: 5,
    vatTu: "Thức ăn đặc biệt",
    tonDau: 300,
    phatSinh: 150,
    tonCuoi: 250,
  },
];

const chartConfig = {
  value: {
    label: "Tồn kho",
    color: "#53A88B",
  },
};

export default function InventoryReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Filter logic
  const filteredData = mockTableData.filter((item) => {
    if (
      selectedType !== "all" &&
      !item.vatTu.toLowerCase().includes(selectedType)
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#53A88B]">Báo cáo Tồn kho</h1>
          <p className="text-gray-600 mt-1">Thống kê vật tư và nguyên liệu</p>
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
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Loại vật tư" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="thức ăn">Thức ăn</SelectItem>
            <SelectItem value="thuốc">Thuốc</SelectItem>
            <SelectItem value="vắc-xin">Vắc-xin</SelectItem>
            <SelectItem value="vitamin">Vitamin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">
          Biến động tồn kho 6 tháng
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#53A88B"
                strokeWidth={2}
                dot={{ fill: "#53A88B", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">
                Vật tư / Nguyên liệu
              </TableHead>
              <TableHead className="font-semibold">Tồn đầu</TableHead>
              <TableHead className="font-semibold">Phát sinh</TableHead>
              <TableHead className="font-semibold">Tồn cuối</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.vatTu}</TableCell>
                <TableCell>{row.tonDau}</TableCell>
                <TableCell>{row.phatSinh}</TableCell>
                <TableCell className="font-semibold text-[#53A88B]">
                  {row.tonCuoi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng tồn đầu</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, item) => sum + item.tonDau, 0)}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng phát sinh</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredData.reduce((sum, item) => sum + item.phatSinh, 0)}
          </p>
        </div>
        <div className="p-4 bg-[#53A88B]/10 rounded-lg">
          <p className="text-sm text-gray-600">Tổng tồn cuối</p>
          <p className="text-2xl font-bold text-[#53A88B]">
            {filteredData.reduce((sum, item) => sum + item.tonCuoi, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
