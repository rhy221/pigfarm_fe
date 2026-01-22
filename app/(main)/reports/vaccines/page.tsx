"use client";

import { useState, useEffect, useMemo } from "react";
import { reportApi } from "@/lib/api";
import { useVaccineReport } from "@/hooks/use-reports";
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
  exportToPDF,
  formatCurrencyForPDF,
  formatNumberForPDF,
} from "@/lib/pdf-export";

interface VaccineDetail {
  vaccineName: string;
  diseaseName: string;
  cost: number;
  totalVaccinated: number;
  sickCount: number;
  effectivenessRate: number;
}

interface VaccineReportData {
  details?: VaccineDetail[];
}

interface VaccineItem {
  id: number;
  tenVaccine: string;
  loaiBenh: string;
  chiPhi: number;
  soHeoTiem: number;
  soHeoMacBenh: number;
  tiLeKhoi: number;
}

export default function VaccinesReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Temporary filter states
  const [tempMonth, setTempMonth] = useState(currentMonth.toString());
  const [tempYear, setTempYear] = useState(currentYear.toString());
  const [tempVaccine, setTempVaccine] = useState("all");

  // Applied filter states
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedVaccine, setSelectedVaccine] = useState("all");
  const [allVaccines, setAllVaccines] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch report using custom hook
  const { data: reportData, isLoading: loading } = useVaccineReport({
    month:
      selectedMonth === "all"
        ? `${selectedYear}-all`
        : `${selectedYear}-${selectedMonth.padStart(2, "0")}`,
    vaccine: selectedVaccine === "all" ? undefined : selectedVaccine,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const vaccines = await reportApi.getVaccinesList();
        setAllVaccines(vaccines);
      } catch (error) {
        console.error("Error fetching vaccines list:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = () => {
    setSubmitting(true);
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setSelectedVaccine(tempVaccine);
    setTimeout(() => setSubmitting(false), 300);
  };

  const handleExportPDF = () => {
    const periodText =
      selectedMonth === "all"
        ? `Năm ${selectedYear}`
        : `Tháng ${selectedMonth}/${selectedYear}`;

    exportToPDF({
      title: "Bao cao Hieu qua Vaccine",
      subtitle: `Ky: ${periodText}`,
      columns: [
        { header: "Ten vaccine", dataKey: "tenVaccine", width: 45 },
        { header: "Loai benh", dataKey: "loaiBenh", width: 40 },
        { header: "Chi phi", dataKey: "chiPhi", width: 30 },
        { header: "So heo tiem", dataKey: "soHeoTiem", width: 25 },
        { header: "So mac benh", dataKey: "soHeoMacBenh", width: 25 },
        { header: "Ti le khoi (%)", dataKey: "tiLeKhoi", width: 25 },
      ],
      data: filteredData,
      filename: `bao-cao-vaccine-${selectedYear}-${selectedMonth}.pdf`,
      orientation: "landscape",
    });
  };

  // Map backend data to frontend format (no client-side filtering needed)
  const filteredData = useMemo(() => {
    return (
      reportData?.details?.map((detail: VaccineDetail, index: number) => ({
        id: index + 1,
        tenVaccine: detail.vaccineName || "N/A",
        loaiBenh: detail.diseaseName || "N/A",
        chiPhi: detail.cost || 0,
        soHeoTiem: detail.totalVaccinated || 0,
        soHeoMacBenh: detail.sickCount || 0,
        tiLeKhoi: detail.effectivenessRate || 0,
      })) || []
    );
  }, [reportData]);

  const totalCost = filteredData.reduce(
    (sum: number, item: VaccineItem) => sum + item.chiPhi,
    0
  );
  const totalPigs = filteredData.reduce(
    (sum: number, item: VaccineItem) => sum + item.soHeoTiem,
    0
  );
  const totalSick = filteredData.reduce(
    (sum: number, item: VaccineItem) => sum + item.soHeoMacBenh,
    0
  );

  // Calculate weighted average effectiveness: (Total Vaccinated - Total Sick) / Total Vaccinated
  const avgEffectiveness =
    totalPigs > 0 ? ((totalPigs - totalSick) / totalPigs) * 100 : 0;

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
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Select value={tempMonth} onValueChange={setTempMonth}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
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

        <Select value={tempVaccine} onValueChange={setTempVaccine}>
          <SelectTrigger className="w-full sm:w-[250px] cursor-pointer">
            <SelectValue placeholder="Chọn vắc-xin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vắc-xin</SelectItem>
            {allVaccines.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.vaccine_name}
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
          * Dữ liệu tổng hợp{" "}
          {selectedMonth === "all"
            ? `trong năm ${selectedYear}`
            : `trong tháng ${selectedMonth}/${selectedYear}`}
        </div>
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
            {filteredData.map((row: VaccineItem) => (
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
        {filteredData.length > 0 ? (
          <div className="space-y-2 text-gray-700">
            <p>
              • Vắc-xin có hiệu quả cao nhất:{" "}
              <span className="font-semibold">
                {
                  filteredData.reduce((max: VaccineItem, item: VaccineItem) =>
                    item.tiLeKhoi > max.tiLeKhoi ? item : max
                  ).tenVaccine
                }{" "}
                (
                {filteredData
                  .reduce((max: VaccineItem, item: VaccineItem) =>
                    item.tiLeKhoi > max.tiLeKhoi ? item : max
                  )
                  .tiLeKhoi.toFixed(2)}
                %)
              </span>
            </p>
            <p>
              • Chi phí trung bình mỗi heo:{" "}
              <span className="font-semibold">
                {totalPigs > 0 ? (totalCost / totalPigs).toLocaleString() : 0}{" "}
                VNĐ
              </span>
            </p>
            <p>
              • Tỉ lệ mắc bệnh sau tiêm:{" "}
              <span className="font-semibold">
                {totalPigs > 0 ? ((totalSick / totalPigs) * 100).toFixed(2) : 0}
                %
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Không có dữ liệu phân tích cho giai đoạn này.
          </p>
        )}
      </div>
    </div>
  );
}
