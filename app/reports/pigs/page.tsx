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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileDown, CalendarIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data for donut chart (Đàn heo)
const chartData = [
  { name: "Heo khỏe", value: 40, color: "#059669" },
  { name: "Heo bệnh", value: 40, color: "#EAB308" },
  { name: "Heo chết", value: 20, color: "#EF4444" },
];

// Mock data for herd table (Đàn heo)
const herdTableData = [
  { id: 1, stt: 1, chuong: "A001", soHeoKhoe: 50, soHeoBinh: 50, soHeoChết: 50, soHeoXuatChuong: 50 },
  { id: 2, stt: 2, chuong: "A002", soHeoKhoe: 45, soHeoBinh: 30, soHeoChết: 10, soHeoXuatChuong: 25 },
  { id: 3, stt: 3, chuong: "B001", soHeoKhoe: 60, soHeoBinh: 20, soHeoChết: 5, soHeoXuatChuong: 35 },
  { id: 4, stt: 4, chuong: "B002", soHeoKhoe: 55, soHeoBinh: 25, soHeoChết: 8, soHeoXuatChuong: 40 },
  { id: 5, stt: 5, chuong: "C001", soHeoKhoe: 48, soHeoBinh: 35, soHeoChết: 12, soHeoXuatChuong: 30 },
];

// Mock data for pigs in pens table (Heo tại chuồng)
const pigsInPensData = [
  { id: 1, stt: 1, chuong: "A1", lua: "L001", maSo: "H001", trongLuong: 85.5, trangThai: "Khỏe mạnh" },
  { id: 2, stt: 2, chuong: "A1", lua: "L001", maSo: "H002", trongLuong: 82.3, trangThai: "Khỏe mạnh" },
  { id: 3, stt: 3, chuong: "A2", lua: "L002", maSo: "H003", trongLuong: 78.9, trangThai: "Cần theo dõi" },
  { id: 4, stt: 4, chuong: "A2", lua: "L002", maSo: "H004", trongLuong: 90.2, trangThai: "Khỏe mạnh" },
  { id: 5, stt: 5, chuong: "B1", lua: "L003", maSo: "H005", trongLuong: 88.7, trangThai: "Khỏe mạnh" },
  { id: 6, stt: 6, chuong: "B1", lua: "L003", maSo: "H006", trongLuong: 75.5, trangThai: "Cần theo dõi" },
  { id: 7, stt: 7, chuong: "B2", lua: "L004", maSo: "H007", trongLuong: 92.1, trangThai: "Khỏe mạnh" },
  { id: 8, stt: 8, chuong: "B2", lua: "L004", maSo: "H008", trongLuong: 86.4, trangThai: "Khỏe mạnh" },
];

const chartConfig = {
  heoKhoe: { label: "Heo khỏe", color: "#059669" },
  heoBinh: { label: "Heo bệnh", color: "#EAB308" },
  heoChét: { label: "Heo chết", color: "#EF4444" },
};

export default function PigReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPen, setSelectedPen] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [activeTab, setActiveTab] = useState("herd");

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Filter pigs in pens data
  const filteredPigsData = pigsInPensData.filter((item) => {
    if (selectedPen !== "all" && item.chuong !== selectedPen) return false;
    if (selectedBatch !== "all" && item.lua !== selectedBatch) return false;
    return true;
  });

  const totalPigs = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#53A88B]">
            Báo cáo Heo
          </h1>
          <p className="text-gray-600 mt-1">
            Thống kê tổng quan và chi tiết về đàn heo
          </p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2 bg-[#53A88B] hover:bg-[#458F79]">
          <FileDown className="w-4 h-4" />
          Xuất PDF
        </Button>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white rounded-lg border">
        <span className="text-sm font-medium text-gray-700">Chọn ngày:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd/MM/yyyy", { locale: vi })
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button 
          onClick={() => {
            if (selectedDate) {
              alert(`Xem báo cáo ngày: ${format(selectedDate, "dd/MM/yyyy", { locale: vi })}`);
              // TODO: Gọi API hoặc filter dữ liệu theo ngày đã chọn
            }
          }}
          className="bg-[#53A88B] hover:bg-[#458F79] text-white"
          disabled={!selectedDate}
        >
          Xem báo cáo
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="herd" className="data-[state=active]:bg-[#53A88B] data-[state=active]:text-white">
            Đàn heo
          </TabsTrigger>
          <TabsTrigger value="pens" className="data-[state=active]:bg-[#53A88B] data-[state=active]:text-white">
            Heo tại chuồng
          </TabsTrigger>
        </TabsList>

        {/* Tab: Đàn heo */}
        <TabsContent value="herd" className="space-y-6 mt-6">
          {/* Chart Section */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Phân bố tình trạng đàn heo</h3>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{item.value}%</span>
                      <p className="text-sm text-gray-500">
                        {Math.round((item.value / 100) * totalPigs)} con
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Herd Table */}
          <div className="rounded-md border overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-[#53A88B]">STT</TableHead>
                  <TableHead className="font-bold text-[#53A88B]">Chuồng</TableHead>
                  <TableHead className="font-bold text-[#53A88B]">Số heo khỏe</TableHead>
                  <TableHead className="font-bold text-[#53A88B]">Số heo bệnh</TableHead>
                  <TableHead className="font-bold text-[#53A88B]">Số heo chết</TableHead>
                  <TableHead className="font-bold text-[#53A88B]">Số heo đã xuất chuồng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {herdTableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.stt}</TableCell>
                    <TableCell className="font-medium">{row.chuong}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">{row.soHeoKhoe}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-semibold">{row.soHeoBinh}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-semibold">{row.soHeoChết}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-semibold">{row.soHeoXuatChuong}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo khỏe</p>
              <p className="text-3xl font-bold">
                {herdTableData.reduce((sum, item) => sum + item.soHeoKhoe, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo bệnh</p>
              <p className="text-3xl font-bold">
                {herdTableData.reduce((sum, item) => sum + item.soHeoBinh, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo chết</p>
              <p className="text-3xl font-bold">
                {herdTableData.reduce((sum, item) => sum + item.soHeoChết, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Đã xuất chuồng</p>
              <p className="text-3xl font-bold">
                {herdTableData.reduce((sum, item) => sum + item.soHeoXuatChuong, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Heo tại chuồng */}
        <TabsContent value="pens" className="space-y-6 mt-6">
          {/* Additional Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedPen} onValueChange={setSelectedPen}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Chọn chuồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuồng</SelectItem>
                <SelectItem value="A1">Chuồng A1</SelectItem>
                <SelectItem value="A2">Chuồng A2</SelectItem>
                <SelectItem value="B1">Chuồng B1</SelectItem>
                <SelectItem value="B2">Chuồng B2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Chọn lứa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lứa</SelectItem>
                <SelectItem value="L001">Lứa L001</SelectItem>
                <SelectItem value="L002">Lứa L002</SelectItem>
                <SelectItem value="L003">Lứa L003</SelectItem>
                <SelectItem value="L004">Lứa L004</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pigs in Pens Table */}
          <div className="rounded-md border overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">STT</TableHead>
                  <TableHead className="font-semibold">Chuồng</TableHead>
                  <TableHead className="font-semibold">Lứa</TableHead>
                  <TableHead className="font-semibold">Mã số</TableHead>
                  <TableHead className="font-semibold">Trọng lượng (kg)</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPigsData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.stt}</TableCell>
                    <TableCell className="font-medium">{row.chuong}</TableCell>
                    <TableCell>{row.lua}</TableCell>
                    <TableCell>{row.maSo}</TableCell>
                    <TableCell>{row.trongLuong}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.trangThai === "Khỏe mạnh" ? "default" : "secondary"}
                        className={
                          row.trangThai === "Khỏe mạnh"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }
                      >
                        {row.trangThai}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Tổng số heo</p>
              <p className="text-2xl font-bold text-[#53A88B]">{filteredPigsData.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trọng lượng trung bình</p>
              <p className="text-2xl font-bold text-[#53A88B]">
                {(filteredPigsData.reduce((sum, item) => sum + item.trongLuong, 0) / filteredPigsData.length).toFixed(1)} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Khỏe mạnh</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredPigsData.filter((item) => item.trangThai === "Khỏe mạnh").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cần theo dõi</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredPigsData.filter((item) => item.trangThai === "Cần theo dõi").length}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
