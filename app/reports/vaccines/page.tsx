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

interface VaccineDetail {
  vaccineName: string;
  diseaseName: string;
  cost: number;
  pigsVaccinated: number;
  pigsSick: number;
  effectivenessRate: number;
}

interface VaccineReportData {
  details?: VaccineDetail[];
}

export default function VaccinesReportPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedVaccine, setSelectedVaccine] = useState("all");
  const [reportData, setReportData] = useState<VaccineReportData | null>(null);
  const [allVaccines, setAllVaccines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const currentMonthStr = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;
        const data = await reportApi.getVaccineReport({ month: currentMonthStr });
        setReportData(data);
      } catch (error) {
        console.error("Error fetching vaccine report:", error);
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
    reportData?.details?.map((detail, index) => ({
      id: index + 1,
      tenVaccine: detail.vaccineName || "N/A",
      loaiBenh: detail.diseaseName || "N/A",
      chiPhi: detail.cost || 0,
      soHeoTiem: detail.totalVaccinated || 0,
      soHeoMacBenh: detail.sickCount || 0,
      tiLeKhoi: detail.effectivenessRate || 0,
    })) || [];

  // Filter logic
  const filteredData = mappedData.filter((item) => {
    if (selectedVaccine !== "all" && item.tenVaccine !== selectedVaccine)
      return false;
    return true;
  });

  const totalCost = filteredData.reduce((sum, item) => sum + item.chiPhi, 0);
  const totalPigs = filteredData.reduce((sum, item) => sum + item.soHeoTiem, 0);
  const totalSick = filteredData.reduce(
    (sum, item) => sum + item.soHeoMacBenh,
    0
  );
  
  // Calculate weighted average effectiveness: (Total Vaccinated - Total Sick) / Total Vaccinated
  const avgEffectiveness = totalPigs > 0 
    ? ((totalPigs - totalSick) / totalPigs) * 100 
    : 0;

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

        <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Chọn vắc-xin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vắc-xin</SelectItem>
            {allVaccines.map((v) => (
              <SelectItem key={v.id} value={v.vaccine_name}>
                {v.vaccine_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-gray-500 italic hidden lg:block">
            * Dữ liệu tổng hợp trong tháng {selectedMonth}/{selectedYear}
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
        {filteredData.length > 0 ? (
          <div className="space-y-2 text-gray-700">
            <p>
              • Vắc-xin có hiệu quả cao nhất:{" "}
              <span className="font-semibold">
                {
                  filteredData.reduce((max, item) =>
                    item.tiLeKhoi > max.tiLeKhoi ? item : max
                  ).tenVaccine
                }{" "}
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
                {totalPigs > 0 ? (totalCost / totalPigs).toLocaleString() : 0} VNĐ
              </span>
            </p>
            <p>
              • Tỉ lệ mắc bệnh sau tiêm:{" "}
              <span className="font-semibold">
                {totalPigs > 0 ? ((totalSick / totalPigs) * 100).toFixed(2) : 0}%
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Không có dữ liệu phân tích cho giai đoạn này.</p>
        )}
      </div>
    </div>
  );
}
