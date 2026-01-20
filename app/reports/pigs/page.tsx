"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const chartConfig = {
  heoKhoe: { label: "Heo khỏe", color: "#059669" },
  heoBinh: { label: "Heo bệnh", color: "#EAB308" },
  heoChét: { label: "Heo chết", color: "#EF4444" },
  heoXuat: { label: "Heo đã xuất", color: "#3B82F6" },
};

interface PenData {
  penId: string;
  penName: string;
  healthyCount: number;
  sickCount: number;
  deadCount: number;
  shippedCount: number;
}

interface HerdReportData {
  date?: string;
  totalPigs?: number;
  pens?: PenData[];
}

export default function PigReportsPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Temporary filter states
  const [tempMonth, setTempMonth] = useState(currentMonth.toString());
  const [tempYear, setTempYear] = useState(currentYear.toString());
  const [tempPen, setTempPen] = useState("all");
  const [tempBatch, setTempBatch] = useState("all");

  // Applied filter states
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedPen, setSelectedPen] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [activeTab, setActiveTab] = useState("herd");
  const [reportData, setReportData] = useState<HerdReportData | null>(null);
  const [allPens, setAllPens] = useState<PenData[]>([]); // Store all pens for filter
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        // Logic: If current month/year selected, use today.
        // Else, use the last day of the selected month to get the "closing" report.
        let targetDateStr = "";
        const isCurrent =
          parseInt(selectedYear) === new Date().getFullYear() &&
          parseInt(selectedMonth) === new Date().getMonth() + 1;

        if (isCurrent) {
          targetDateStr = new Date().toISOString().split("T")[0];
        } else {
          // Get last day of selected month
          const lastDay = new Date(
            parseInt(selectedYear),
            parseInt(selectedMonth),
            0
          );
          targetDateStr = format(lastDay, "yyyy-MM-dd");
        }

        // Prepare query params
        const params: any = {};
        if (targetDateStr) params.date = targetDateStr;
        if (selectedPen !== "all") params.pen = selectedPen;
        if (selectedBatch !== "all") params.batch = selectedBatch;

        const data = await reportApi.getHerdReport(params);
        console.log("Herd report data:", data);
        console.log("Pens count:", data?.pens?.length || 0);

        setReportData(data);

        // Populate filter options only if we don't have them yet (and we are not currently filtering by pen, which would restrict the list)
        if (data?.pens && selectedPen === "all" && allPens.length === 0) {
          setAllPens(data.pens);
        } else if (
          data?.pens &&
          selectedPen === "all" &&
          data.pens.length > allPens.length
        ) {
          // Update if we somehow got more pens
          setAllPens(data.pens);
        }
      } catch (error) {
        console.error("Error fetching herd report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedMonth, selectedYear, selectedPen, selectedBatch, activeTab]); // Add dependencies

  const handleSubmit = () => {
    setSubmitting(true);
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setSelectedPen(tempPen);
    setSelectedBatch(tempBatch);
    setTimeout(() => setSubmitting(false), 300);
  };

  const handleExportPDF = () => {
    alert("Xuất PDF (chức năng sẽ được triển khai sau)");
  };

  // Map backend data to frontend format
  const mappedHerdTable = useMemo(() => {
    return (
      reportData?.pens?.map((pen, index) => ({
        id: index + 1,
        stt: index + 1,
        chuong: pen.penName || pen.penId,
        soHeoKhoe: pen.healthyCount || 0,
        soHeoBinh: pen.sickCount || 0,
        soHeoChết: pen.deadCount || 0,
        soHeoXuatChuong: pen.shippedCount || 0,
      })) || []
    );
  }, [reportData]);

  // Calculate chart data from API response
  const totalHealthy =
    reportData?.pens?.reduce(
      (sum: number, p) => sum + (p.healthyCount || 0),
      0
    ) || 0;
  const totalSick =
    reportData?.pens?.reduce((sum: number, p) => sum + (p.sickCount || 0), 0) ||
    0;
  const totalDead =
    reportData?.pens?.reduce((sum: number, p) => sum + (p.deadCount || 0), 0) ||
    0;
  const totalShipped =
    reportData?.pens?.reduce(
      (sum: number, p) => sum + (p.shippedCount || 0),
      0
    ) || 0;

  const mappedChartData = [
    { name: "Heo khỏe", value: totalHealthy, color: "#059669" },
    { name: "Heo bệnh", value: totalSick, color: "#EAB308" },
    { name: "Heo chết", value: totalDead, color: "#EF4444" },
    { name: "Heo đã xuất", value: totalShipped, color: "#3B82F6" },
  ];

  // Filter pigs in pens data (backend doesn't provide individual pig data yet)
  const filteredPigsData: unknown[] = [];

  const totalPigs = mappedChartData.reduce((sum, item) => sum + item.value, 0);

  const chartDataSource = mappedChartData;
  const herdTableSource = mappedHerdTable;

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
          <h1 className="text-2xl font-bold text-[#53A88B]">Báo cáo Heo</h1>
          <p className="text-gray-600 mt-1">
            Thống kê tổng quan và chi tiết về đàn heo
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

      {/* Date Filter (Month/Year) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-white rounded-lg border">
        <span className="text-sm font-medium text-gray-700">
          Thời gian báo cáo:
        </span>

        <Select value={tempMonth} onValueChange={setTempMonth}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
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

        <div className="ml-auto text-sm text-gray-500 italic">
          * Dữ liệu được tính đến{" "}
          {parseInt(selectedYear) === currentYear &&
          parseInt(selectedMonth) === currentMonth
            ? "hôm nay"
            : "cuối tháng"}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          // Reset to default state "like first load"
          setTempMonth(currentMonth.toString());
          setTempYear(currentYear.toString());
          setTempPen("all");
          setTempBatch("all");
          setSelectedMonth(currentMonth.toString());
          setSelectedYear(currentYear.toString());
          setSelectedPen("all");
          setSelectedBatch("all");
        }}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger
            value="herd"
            className="data-[state=active]:bg-[#53A88B] data-[state=active]:text-white"
          >
            Đàn heo
          </TabsTrigger>
          <TabsTrigger
            value="pens"
            className="data-[state=active]:bg-[#53A88B] data-[state=active]:text-white"
          >
            Heo tại chuồng
          </TabsTrigger>
        </TabsList>

        {/* Tab: Đàn heo */}
        <TabsContent value="herd" className="space-y-6 mt-6">
          {/* Chart Section */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">
              Phân bố tình trạng đàn heo
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataSource}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartDataSource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                {chartDataSource.map((item) => (
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
                      <span className="text-2xl font-bold">
                        {totalPigs > 0
                          ? ((item.value / totalPigs) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                      <p className="text-sm text-gray-500">{item.value} con</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo khỏe</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoKhoe, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo bệnh</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoBinh, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo chết</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoChết, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Đã xuất chuồng</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce(
                  (sum, item) => sum + item.soHeoXuatChuong,
                  0
                )}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Heo tại chuồng */}
        <TabsContent value="pens" className="space-y-6 mt-6">
          {/* Additional Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={tempPen} onValueChange={setTempPen}>
              <SelectTrigger className="w-full sm:w-[200px] cursor-pointer">
                <SelectValue placeholder="Chọn chuồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuồng</SelectItem>
                {allPens.map((pen) => (
                  <SelectItem key={pen.penId} value={pen.penId}>
                    {pen.penName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tempBatch} onValueChange={setTempBatch}>
              <SelectTrigger className="w-full sm:w-[200px] cursor-pointer">
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

            <Button
              onClick={handleSubmit}
              disabled={submitting || loading}
              className="bg-[#53A88B] hover:bg-[#458F79] text-white w-full sm:w-auto disabled:opacity-50 cursor-pointer"
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
          </div>

          {/* Herd Table (Reused) */}
          <div className="rounded-md border overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-[#53A88B]">
                    STT
                  </TableHead>
                  <TableHead className="font-bold text-[#53A88B]">
                    Chuồng
                  </TableHead>
                  <TableHead className="font-bold text-[#53A88B]">
                    Số heo khỏe
                  </TableHead>
                  <TableHead className="font-bold text-[#53A88B]">
                    Số heo bệnh
                  </TableHead>
                  <TableHead className="font-bold text-[#53A88B]">
                    Số heo chết
                  </TableHead>
                  <TableHead className="font-bold text-[#53A88B]">
                    Số heo đã xuất chuồng
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {herdTableSource.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.stt}</TableCell>
                    <TableCell className="font-medium">{row.chuong}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">
                        {row.soHeoKhoe}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-semibold">
                        {row.soHeoBinh}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-semibold">
                        {row.soHeoChết}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-600 font-semibold">
                        {row.soHeoXuatChuong}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Statistics (Reused) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo khỏe</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoKhoe, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo bệnh</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoBinh, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Tổng số heo chết</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce((sum, item) => sum + item.soHeoChết, 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
            <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
              <p className="text-sm opacity-90 mb-1">Đã xuất chuồng</p>
              <p className="text-3xl font-bold">
                {herdTableSource.reduce(
                  (sum, item) => sum + item.soHeoXuatChuong,
                  0
                )}
              </p>
              <p className="text-xs opacity-75 mt-1">Con</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
