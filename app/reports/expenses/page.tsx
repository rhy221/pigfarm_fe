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
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";

interface ExpenseReportData {
  expenses?: Array<{
    id: string;
    category: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export default function ExpensesReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [reportData, setReportData] = useState<ExpenseReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const currentMonthStr = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
        const data = await reportApi.getExpensesReport({ month: currentMonthStr });
        setReportData(data);
      } catch (error) {
        console.error("Error fetching expenses report:", error);
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
    reportData?.expenses?.map((expense) => ({
      id: expense.id,
      maPhieu: expense.id,
      ngayPhatSinh: expense.date,
      loaiChiPhi: expense.category,
      soTien: expense.amount,
      tinhTrang:
        expense.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán",
    })) || [];

  // Filter logic
  const filteredData = mappedData.filter((item) => {
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
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
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

        <div className="ml-auto text-sm text-gray-500 italic hidden lg:block">
            * Dữ liệu tổng hợp trong tháng {selectedMonth}/{selectedYear}
        </div>
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
