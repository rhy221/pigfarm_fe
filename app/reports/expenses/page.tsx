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
import { FileDown } from "lucide-react";

// Mock data
const mockData = [
  {
    id: 1,
    maPhieu: "CP001",
    ngayPhatSinh: "2024-01-15",
    loaiChiPhi: "Thức ăn",
    soTien: 15000000,
    tinhTrang: "Đã thanh toán",
  },
  {
    id: 2,
    maPhieu: "CP002",
    ngayPhatSinh: "2024-01-18",
    loaiChiPhi: "Thuốc",
    soTien: 5000000,
    tinhTrang: "Đã thanh toán",
  },
  {
    id: 3,
    maPhieu: "CP003",
    ngayPhatSinh: "2024-01-20",
    loaiChiPhi: "Vắc-xin",
    soTien: 8000000,
    tinhTrang: "Chưa thanh toán",
  },
  {
    id: 4,
    maPhieu: "CP004",
    ngayPhatSinh: "2024-01-22",
    loaiChiPhi: "Bảo trì",
    soTien: 3000000,
    tinhTrang: "Đã thanh toán",
  },
  {
    id: 5,
    maPhieu: "CP005",
    ngayPhatSinh: "2024-01-25",
    loaiChiPhi: "Điện nước",
    soTien: 2500000,
    tinhTrang: "Chưa thanh toán",
  },
  {
    id: 6,
    maPhieu: "CP006",
    ngayPhatSinh: "2024-01-28",
    loaiChiPhi: "Thức ăn",
    soTien: 12000000,
    tinhTrang: "Đã thanh toán",
  },
  {
    id: 7,
    maPhieu: "CP007",
    ngayPhatSinh: "2024-02-02",
    loaiChiPhi: "Nhân công",
    soTien: 18000000,
    tinhTrang: "Chưa thanh toán",
  },
  {
    id: 8,
    maPhieu: "CP008",
    ngayPhatSinh: "2024-02-05",
    loaiChiPhi: "Thuốc",
    soTien: 4500000,
    tinhTrang: "Đã thanh toán",
  },
];

export default function ExpensesReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Filter logic
  const filteredData = mockData.filter((item) => {
    if (selectedCategory !== "all" && item.loaiChiPhi !== selectedCategory)
      return false;
    if (selectedStatus !== "all" && item.tinhTrang !== selectedStatus)
      return false;
    return true;
  });

  const totalExpense = filteredData.reduce((sum, item) => sum + item.soTien, 0);
  const paidExpense = filteredData
    .filter((item) => item.tinhTrang === "Đã thanh toán")
    .reduce((sum, item) => sum + item.soTien, 0);
  const unpaidExpense = filteredData
    .filter((item) => item.tinhTrang === "Chưa thanh toán")
    .reduce((sum, item) => sum + item.soTien, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#53A88B]">Báo cáo Chi phí</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý chi phí hoạt động
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

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Loại chi phí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="Thức ăn">Thức ăn</SelectItem>
            <SelectItem value="Thuốc">Thuốc</SelectItem>
            <SelectItem value="Vắc-xin">Vắc-xin</SelectItem>
            <SelectItem value="Bảo trì">Bảo trì</SelectItem>
            <SelectItem value="Điện nước">Điện nước</SelectItem>
            <SelectItem value="Nhân công">Nhân công</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Tình trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng chi phí</p>
          <p className="text-2xl font-bold text-orange-600">
            {totalExpense.toLocaleString()} VNĐ
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Đã thanh toán</p>
          <p className="text-2xl font-bold text-green-600">
            {paidExpense.toLocaleString()} VNĐ
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">Chưa thanh toán</p>
          <p className="text-2xl font-bold text-red-600">
            {unpaidExpense.toLocaleString()} VNĐ
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã phiếu</TableHead>
              <TableHead className="font-semibold">Ngày phát sinh</TableHead>
              <TableHead className="font-semibold">Loại chi phí</TableHead>
              <TableHead className="font-semibold text-right">
                Số tiền (VNĐ)
              </TableHead>
              <TableHead className="font-semibold">Tình trạng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.maPhieu}</TableCell>
                <TableCell>
                  {new Date(row.ngayPhatSinh).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{row.loaiChiPhi}</TableCell>
                <TableCell className="text-right font-semibold">
                  {row.soTien.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.tinhTrang === "Đã thanh toán"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      row.tinhTrang === "Đã thanh toán"
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                  >
                    {row.tinhTrang}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Analysis */}
      <div className="p-6 bg-linear-to-r from-[#53A88B]/10 to-[#53A88B]/5 rounded-lg">
        <h3 className="text-lg font-semibold text-[#53A88B] mb-3">
          Phân tích chi phí
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Chi phí theo loại:
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              {Array.from(
                new Set(filteredData.map((item) => item.loaiChiPhi))
              ).map((category) => {
                const categoryTotal = filteredData
                  .filter((item) => item.loaiChiPhi === category)
                  .reduce((sum, item) => sum + item.soTien, 0);
                return (
                  <div key={category} className="flex justify-between">
                    <span>• {category}:</span>
                    <span className="font-semibold">
                      {categoryTotal.toLocaleString()} VNĐ
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Thống kê:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>• Số phiếu chi:</span>
                <span className="font-semibold">{filteredData.length}</span>
              </div>
              <div className="flex justify-between">
                <span>• Chi phí trung bình:</span>
                <span className="font-semibold">
                  {(totalExpense / filteredData.length).toLocaleString()} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span>• Tỉ lệ thanh toán:</span>
                <span className="font-semibold">
                  {((paidExpense / totalExpense) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
