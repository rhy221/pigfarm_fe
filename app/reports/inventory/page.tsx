"use client";

import { useState, useEffect } from "react";
import { reportApi } from "@/lib/api";
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

const chartConfig = {
  value: {
    label: "Tồn kho",
    color: "#53A88B",
  },
};

interface InventoryItem {
  materialId: string;
  materialName: string;
  openingStock: number;
  changeAmount: number;
  closingStock: number;
}

interface InventoryReportData {
  items?: InventoryItem[];
  trends?: Array<{ month: string; value: number }>;
}

export default function InventoryReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedType, setSelectedType] = useState("all");
  const [reportData, setReportData] = useState<InventoryReportData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Get current month in YYYY-MM format
        const currentMonthStr = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
        
        const data = await reportApi.getInventoryReport({
          month: currentMonthStr,
        });
        setReportData(data);
      } catch (error) {
        console.error("Error fetching inventory report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Map backend data to frontend format
  const mappedData =
    reportData?.items?.map((item, index) => ({
      id: index + 1,
      vatTu: item.materialName || "N/A",
      tonDau: item.openingStock || 0,
      phatSinh: item.changeAmount || 0,
      tonCuoi: item.closingStock || 0,
    })) || [];

  // Filter logic
  const filteredData = mappedData.filter((item) => {
    if (
      selectedType !== "all" &&
      !item.vatTu.toLowerCase().includes(selectedType)
    )
      return false;
    return true;
  });

  const chartData = reportData?.trends || [];

  // Generate Year Options (2020 - Current)
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
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
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              // Disable future months if current year is selected
              const isDisabled = parseInt(selectedYear) === currentYear && month > currentMonth;
              return (
                <SelectItem key={month} value={month.toString()} disabled={isDisabled}>
                  Tháng {month}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Chọn năm" />
          </SelectTrigger>
          <SelectContent>
             {years.map((year) => (
              <SelectItem key={year} value={year}>
                Năm {year}
              </SelectItem>
            ))}
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

         <div className="ml-auto text-sm text-gray-500 italic hidden sm:block">
            * Dữ liệu chốt sổ đến cuối tháng {selectedMonth}/{selectedYear}
        </div>
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
