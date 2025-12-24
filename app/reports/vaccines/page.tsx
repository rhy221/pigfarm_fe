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

// Mock data
const mockData = [
  {
    id: 1,
    tenVaccine: "Vắc-xin dịch tả heo",
    loaiBenh: "Dịch tả heo",
    chiPhi: 2500000,
    soHeoTiem: 100,
    soHeoMacBenh: 2,
    tiLeKhoi: 98,
  },
  {
    id: 2,
    tenVaccine: "Vắc-xin tai xanh",
    loaiBenh: "Tai xanh",
    chiPhi: 1800000,
    soHeoTiem: 80,
    soHeoMacBenh: 5,
    tiLeKhoi: 93.75,
  },
  {
    id: 3,
    tenVaccine: "Vắc-xin tụ huyết trùng",
    loaiBenh: "Tụ huyết trùng",
    chiPhi: 3200000,
    soHeoTiem: 120,
    soHeoMacBenh: 3,
    tiLeKhoi: 97.5,
  },
  {
    id: 4,
    tenVaccine: "Vắc-xin phó thương hàn",
    loaiBenh: "Phó thương hàn",
    chiPhi: 2100000,
    soHeoTiem: 90,
    soHeoMacBenh: 4,
    tiLeKhoi: 95.56,
  },
  {
    id: 5,
    tenVaccine: "Vắc-xin viêm mũi teo",
    loaiBenh: "Viêm mũi teo",
    chiPhi: 2800000,
    soHeoTiem: 110,
    soHeoMacBenh: 6,
    tiLeKhoi: 94.55,
  },
];

export default function VaccinesReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedVaccine, setSelectedVaccine] = useState("all");

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Filter logic
  const filteredData = mockData.filter((item) => {
    if (selectedVaccine !== "all" && item.tenVaccine !== selectedVaccine)
      return false;
    return true;
  });

  const totalCost = filteredData.reduce((sum, item) => sum + item.chiPhi, 0);
  const totalPigs = filteredData.reduce((sum, item) => sum + item.soHeoTiem, 0);
  const totalSick = filteredData.reduce((sum, item) => sum + item.soHeoMacBenh, 0);
  const avgEffectiveness =
    filteredData.reduce((sum, item) => sum + item.tiLeKhoi, 0) /
    filteredData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#53A88B]">
            Báo cáo Hiệu quả Vắc-xin
          </h1>
          <p className="text-gray-600 mt-1">
            Đánh giá hiệu quả tiêm phòng vắc-xin
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
          </SelectContent>
        </Select>

        <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Chọn vắc-xin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vắc-xin</SelectItem>
            {mockData.map((item) => (
              <SelectItem key={item.id} value={item.tenVaccine}>
                {item.tenVaccine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Tên vắc-xin</TableHead>
              <TableHead className="font-semibold">Loại bệnh</TableHead>
              <TableHead className="font-semibold text-right">
                Chi phí (VNĐ)
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tổng số heo tiêm
              </TableHead>
              <TableHead className="font-semibold text-right">
                Số heo mắc bệnh sau tiêm
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tỉ lệ khỏi bệnh (%)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.tenVaccine}</TableCell>
                <TableCell>{row.loaiBenh}</TableCell>
                <TableCell className="text-right">
                  {row.chiPhi.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{row.soHeoTiem}</TableCell>
                <TableCell className="text-right text-red-600 font-semibold">
                  {row.soHeoMacBenh}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold ${
                      row.tiLeKhoi >= 95
                        ? "text-green-600"
                        : row.tiLeKhoi >= 90
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {row.tiLeKhoi.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng chi phí</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalCost.toLocaleString()} VNĐ
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng số heo tiêm</p>
          <p className="text-2xl font-bold text-blue-600">{totalPigs}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng số heo mắc bệnh</p>
          <p className="text-2xl font-bold text-red-600">{totalSick}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Hiệu quả trung bình</p>
          <p className="text-2xl font-bold text-green-600">
            {avgEffectiveness.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Analysis */}
      <div className="p-6 bg-linear-to-r from-[#53A88B]/10 to-[#53A88B]/5 rounded-lg">
        <h3 className="text-lg font-semibold text-[#53A88B] mb-2">
          Phân tích hiệu quả
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            • Vắc-xin có hiệu quả cao nhất:{" "}
            <span className="font-semibold">
              {filteredData.reduce((max, item) =>
                item.tiLeKhoi > max.tiLeKhoi ? item : max
              ).tenVaccine}{" "}
              (
              {filteredData
                .reduce((max, item) =>
                  item.tiLeKhoi > max.tiLeKhoi ? item : max
                )
                .tiLeKhoi.toFixed(2)}
              %)
            </span>
          </p>
          <p>
            • Chi phí trung bình mỗi heo:{" "}
            <span className="font-semibold">
              {(totalCost / totalPigs).toLocaleString()} VNĐ
            </span>
          </p>
          <p>
            • Tỉ lệ mắc bệnh sau tiêm:{" "}
            <span className="font-semibold">
              {((totalSick / totalPigs) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
