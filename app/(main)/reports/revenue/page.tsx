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
import { FileDown, TrendingUp, TrendingDown } from "lucide-react";

interface RevenueReportData {
  revenue?: number;
  expenses?: number;
  profit?: number;
  revenueItems?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
  }>;
  expenseItems?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
  }>;
}

export default function RevenueReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Temporary filter states
  const [tempMonth, setTempMonth] = useState(currentMonth.toString());
  const [tempYear, setTempYear] = useState(currentYear.toString());

  // Applied filter states
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [reportData, setReportData] = useState<RevenueReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch report when component mounts or filters change
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const currentMonthStr = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
        const data = await reportApi.getRevenueReport({
          month: currentMonthStr,
        });
        setReportData(data);
      } catch (error) {
        console.error("Error fetching revenue report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const handleSubmit = () => {
    setSubmitting(true);
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setTimeout(() => setSubmitting(false), 300);
  };

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Calculate totals from API data
  const totalRevenue =
    reportData?.revenue ||
    reportData?.revenueItems?.reduce((sum, item) => sum + item.amount, 0) ||
    0;

  const totalExpense =
    reportData?.expenses ||
    reportData?.expenseItems?.reduce((sum, item) => sum + item.amount, 0) ||
    0;

  const netProfit = reportData?.profit || totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Generate Year Options (2020 - Current)
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

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
          <h1 className="text-2xl font-bold text-[#53A88B]">
            Báo cáo Doanh thu
          </h1>
          <p className="text-gray-600 mt-1">Tổng hợp thu chi và lợi nhuận</p>
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
        <Select value={tempMonth} onValueChange={setTempMonth}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const isDisabled =
                parseInt(tempYear) === currentYear && month > currentMonth;
              return (
                <SelectItem
                  key={month}
                  value={month.toString()}
                  disabled={isDisabled}
                >
                  Tháng {month}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={tempYear} onValueChange={setTempYear}>
          <SelectTrigger className="w-[140px] cursor-pointer">
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

        <Button
          onClick={handleSubmit}
          disabled={submitting || loading}
          className="bg-[#53A88B] hover:bg-[#458F79] text-white disabled:opacity-50 cursor-pointer"
        >
          {submitting || loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang tải...
            </>
          ) : (
            "Xem báo cáo"
          )}
        </Button>

        <div className="ml-auto text-sm text-gray-500 italic hidden lg:block">
          * Dữ liệu tổng hợp trong tháng {selectedMonth}/{selectedYear}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Tổng doanh thu</p>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{totalRevenue.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">VNĐ</p>
        </div>

        <div className="p-6 bg-linear-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Tổng chi phí</p>
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{totalExpense.toLocaleString()}</p>
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
            {(reportData?.revenueItems || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.description}</TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {row.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totalRevenue > 0
                    ? ((row.amount / totalRevenue) * 100).toFixed(1)
                    : 0}
                  %
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
            {(reportData?.expenseItems || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.description}</TableCell>
                <TableCell className="text-right font-semibold text-red-600">
                  {row.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totalExpense > 0
                    ? ((row.amount / totalExpense) * 100).toFixed(1)
                    : 0}
                  %
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
            <p className="text-gray-600">Doanh thu - Chi phí = Lợi nhuận</p>
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
              {reportData?.expenseItems && reportData.expenseItems.length > 0
                ? reportData.expenseItems.reduce((max, item) =>
                    item.amount > max.amount ? item : max
                  ).description
                : "N/A"}
            </div>
            <div>
              <span className="font-medium">Nguồn thu chính:</span>{" "}
              {reportData?.revenueItems && reportData.revenueItems.length > 0
                ? reportData.revenueItems.reduce((max, item) =>
                    item.amount > max.amount ? item : max
                  ).description
                : "N/A"}
            </div>
            <div>
              <span className="font-medium">ROI:</span>{" "}
              {totalExpense > 0
                ? ((netProfit / totalExpense) * 100).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
