"use client";

import { useState, useEffect, useMemo } from "react";
import { reportApi } from "@/lib/api";
import { useWarehouses, useWarehouseCategories } from "@/hooks/use-inventory";
import { useInventoryReport } from "@/hooks/use-reports";
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
import { exportToPDF, formatNumberForPDF } from "@/lib/pdf-export";
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
  productId: string;
  productName: string;
  productCode: string;
  openingStock: number;
  receivedQuantity: number;
  issuedQuantity: number;
  closingStock: number;
  avgCost: number;
  totalValue: number;
}

interface InventoryReportData {
  month: string;
  warehouseId?: string;
  warehouseName?: string;
  items?: InventoryItem[];
  trends?: Array<{ month: string; value: number }>;
}

export default function InventoryReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Temporary filter states
  const [tempMonth, setTempMonth] = useState(currentMonth.toString());
  const [tempYear, setTempYear] = useState(currentYear.toString());
  const [tempWarehouse, setTempWarehouse] = useState("all");
  const [tempCategory, setTempCategory] = useState("all");

  // Applied filter states
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  // Fetch warehouses and categories using hooks
  const { data: warehousesData } = useWarehouses();
  const warehouses = warehousesData || [];
  const { data: categoriesData } = useWarehouseCategories();
  const categories = categoriesData || [];

  // Fetch trends data only once on initial load (6 months trend)
  const { data: trendsData } = useInventoryReport({
    month: `${currentYear}-all`,
    warehouseId: undefined,
    categoryId: undefined,
  });

  // Fetch filtered report data
  const { data: reportData, isLoading: loading } = useInventoryReport({
    month:
      selectedMonth === "all"
        ? `${selectedYear}-all`
        : `${selectedYear}-${selectedMonth.padStart(2, "0")}`,
    warehouseId: selectedWarehouse === "all" ? undefined : selectedWarehouse,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
  });

  const handleSubmit = () => {
    setSubmitting(true);
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setSelectedWarehouse(tempWarehouse);
    setSelectedCategory(tempCategory);
    setTimeout(() => setSubmitting(false), 300);
  };

  const handleExportPDF = () => {
    const warehouseName =
      warehouses.find((w) => w.id === selectedWarehouse)?.name || "Tất cả kho";
    const categoryName =
      categories.find((c) => c.id === selectedCategory)?.name || "Tất cả loại";
    const periodText =
      selectedMonth === "all"
        ? `Năm ${selectedYear}`
        : `Tháng ${selectedMonth}/${selectedYear}`;

    const totalOpening = filteredData.reduce(
      (sum: number, item: any) => sum + item.tonDau,
      0
    );
    const totalReceived = filteredData.reduce(
      (sum: number, item: any) => sum + item.nhap,
      0
    );
    const totalIssued = filteredData.reduce(
      (sum: number, item: any) => sum + item.xuat,
      0
    );
    const totalClosing = filteredData.reduce(
      (sum: number, item: any) => sum + item.tonCuoi,
      0
    );

    exportToPDF({
      title: "Bao cao Ton kho",
      subtitle: `Kho: ${warehouseName} | Loai: ${categoryName} | Ky: ${periodText}`,
      columns: [
        { header: "Ma SP", dataKey: "maSP", width: 25 },
        { header: "Vat tu / Nguyen lieu", dataKey: "vatTu", width: 60 },
        { header: "Ton dau", dataKey: "tonDau", width: 20 },
        { header: "Nhap", dataKey: "nhap", width: 20 },
        { header: "Xuat", dataKey: "xuat", width: 20 },
        { header: "Ton cuoi", dataKey: "tonCuoi", width: 20 },
      ],
      data: filteredData,
      summaryData: [
        { label: "Tong ton dau", value: formatNumberForPDF(totalOpening) },
        { label: "Tong nhap", value: formatNumberForPDF(totalReceived) },
        { label: "Tong xuat", value: formatNumberForPDF(totalIssued) },
        { label: "Tong ton cuoi", value: formatNumberForPDF(totalClosing) },
      ],
      filename: `bao-cao-ton-kho-${selectedYear}-${selectedMonth}.pdf`,
      orientation: "portrait",
    });
  };

  // Map backend data to frontend format
  const filteredData = useMemo(() => {
    const mappedData =
      reportData?.items?.map((item: InventoryItem, index: number) => ({
        id: index + 1,
        maSP: item.productCode || "N/A",
        vatTu: item.productName || "N/A",
        tonDau: item.openingStock || 0,
        nhap: item.receivedQuantity || 0,
        xuat: item.issuedQuantity || 0,
        tonCuoi: item.closingStock || 0,
        donGia: item.avgCost || 0,
        giaTri: item.totalValue || 0,
      })) || [];

    return mappedData;
  }, [reportData]);

  const chartData = useMemo(() => {
    return trendsData?.trends || [];
  }, [trendsData]);

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

      {/* Chart - Load once on initial page load */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Select value={tempMonth} onValueChange={setTempMonth}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              // Disable future months if current year is selected
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

        <Select value={tempWarehouse} onValueChange={setTempWarehouse}>
          <SelectTrigger className="w-full sm:w-[200px] cursor-pointer">
            <SelectValue placeholder="Chọn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả kho</SelectItem>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.id}>
                {wh.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tempCategory} onValueChange={setTempCategory}>
          <SelectTrigger className="w-full sm:w-[200px] cursor-pointer">
            <SelectValue placeholder="Chọn loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
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

        <div className="ml-auto text-sm text-gray-500 italic hidden sm:block">
          * Dữ liệu chốt sổ{" "}
          {selectedMonth === "all"
            ? `đến cuối năm ${selectedYear}`
            : `đến cuối tháng ${selectedMonth}/${selectedYear}`}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Mã SP</TableHead>
              <TableHead className="font-semibold">
                Vật tư / Nguyên liệu
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tồn đầu
              </TableHead>
              <TableHead className="font-semibold text-right">Nhập</TableHead>
              <TableHead className="font-semibold text-right">Xuất</TableHead>
              <TableHead className="font-semibold text-right">
                Tồn cuối
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell className="text-gray-600">{row.maSP}</TableCell>
                <TableCell className="font-medium">{row.vatTu}</TableCell>
                <TableCell className="text-right">{row.tonDau}</TableCell>
                <TableCell className="text-right text-green-600">
                  {row.nhap}
                </TableCell>
                <TableCell className="text-right text-orange-600">
                  {row.xuat}
                </TableCell>
                <TableCell className="text-right font-semibold text-[#53A88B]">
                  {row.tonCuoi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng tồn đầu</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredData.reduce(
              (sum: number, item: any) => sum + item.tonDau,
              0
            )}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng nhập</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredData.reduce(
              (sum: number, item: any) => sum + item.nhap,
              0
            )}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Tổng xuất</p>
          <p className="text-2xl font-bold text-orange-600">
            {filteredData.reduce(
              (sum: number, item: any) => sum + item.xuat,
              0
            )}
          </p>
        </div>
        <div className="p-4 bg-[#53A88B]/10 rounded-lg">
          <p className="text-sm text-gray-600">Tổng tồn cuối</p>
          <p className="text-2xl font-bold text-[#53A88B]">
            {filteredData.reduce(
              (sum: number, item: any) => sum + item.tonCuoi,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
