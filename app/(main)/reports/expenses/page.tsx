// =====================================================
// FINANCE PAGE - app/(dashboard)/finance/page.tsx
// =====================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertCircle,
  Plus,
  FileDown,
  CalendarIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDashboardStats,
  useTransactions,
  useCashAccounts,
  useCashBookReport,
  useFinancialSummary,
} from "@/hooks/use-finance";
import { formatCurrency, cn } from "@/lib/utils";
import { TransactionType } from "@/types/finance";
import {
  BREADCRUMB_CONFIGS,
  PageBreadcrumb,
} from "@/components/page-breadcrumb";
import { useRouter } from "next/navigation";
import { reportApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { exportToPDF, formatCurrencyForPDF } from "@/lib/pdf-export";

export default function FinancePage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Filter states for summary cards
  const [tempMonth, setTempMonth] = useState(currentMonth.toString());
  const [tempYear, setTempYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Original states for transactions section
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("transactions");

  const router = useRouter();
  const { data: stats } = useDashboardStats();
  const { data: accounts } = useCashAccounts();
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions({
      cashAccountId: selectedAccount !== "all" ? selectedAccount : undefined,
      transactionType:
        transactionType !== "all"
          ? (transactionType as TransactionType)
          : undefined,
      fromDate: format(dateRange.from, "yyyy-MM-dd"),
      toDate: format(dateRange.to, "yyyy-MM-dd"),
      search: searchTerm || undefined,
      page,
      limit: 20,
    });

  const { data: cashBook } = useCashBookReport({
    cashAccountId: selectedAccount !== "all" ? selectedAccount : undefined,
    fromDate: format(dateRange.from, "yyyy-MM-dd"),
    toDate: format(dateRange.to, "yyyy-MM-dd"),
  });

  const { data: summary } = useFinancialSummary({
    fromDate: format(dateRange.from, "yyyy-MM-dd"),
    toDate: format(dateRange.to, "yyyy-MM-dd"),
  });

  // Calculate date range for TOP summary cards based on selected Month/Year
  const summaryDateRange = (() => {
    const year = parseInt(selectedYear);
    if (selectedMonth === "all") {
      return {
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31),
      };
    } else {
      const month = parseInt(selectedMonth) - 1;
      return {
        from: startOfMonth(new Date(year, month)),
        to: endOfMonth(new Date(year, month)),
      };
    }
  })();

  // Fetch Cash Book data specifically for TOP summary cards
  const { data: topCashBook } = useCashBookReport({
    fromDate: format(summaryDateRange.from, "yyyy-MM-dd"),
    toDate: format(summaryDateRange.to, "yyyy-MM-dd"),
  });

  // Generate options
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = [
    { value: "all", label: "Tất cả" },
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  const handleApplyFilters = () => {
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
  };

  const handleExportPDF = () => {
    const periodText =
      selectedMonth === "all"
        ? `Năm ${selectedYear}`
        : `Tháng ${selectedMonth}/${selectedYear}`;
    
    // Use data from cashBook or transactions for PDF
    const transactionData = cashBook?.transactions || [];

    exportToPDF({
      title: "Bao cao So quy",
      subtitle: `Ky: ${periodText}${selectedAccount !== "all" ? ` | Tai khoan: ${accounts?.find(a => a.id === selectedAccount)?.name}` : ""}`,
      columns: [
        { header: "Ngay", dataKey: "date", width: 25 },
        { header: "Mo ta", dataKey: "description", width: 70 },
        { header: "Thu", dataKey: "income", width: 25 },
        { header: "Chi", dataKey: "expense", width: 25 },
        { header: "So du", dataKey: "balance", width: 30 },
      ],
      data: transactionData.map((tx: any) => ({
        date: tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString("vi-VN") : "",
        description: tx.description || tx.transactionCategories?.name || "",
        income: tx.transactionType === "income" ? formatCurrencyForPDF(tx.amount) : "-",
        expense: tx.transactionType === "expense" ? formatCurrencyForPDF(tx.amount) : "-",
        balance: formatCurrencyForPDF(tx.runningBalance || 0),
      })),
      summaryData: [
        { label: "So du dau ky", value: formatCurrencyForPDF(openingBalance) },
        { label: "Tong thu", value: formatCurrencyForPDF(monthlyIncome) },
        { label: "Tong chi", value: formatCurrencyForPDF(monthlyExpense) },
        { label: "So du cuoi ky", value: formatCurrencyForPDF(closingBalance) },
      ],
      filename: `bao-cao-so-quy-${selectedYear}-${selectedMonth}.pdf`,
      orientation: "portrait",
    });
  };

  // Data from cash book for summary cards
  const openingBalance = topCashBook?.openingBalance || 0;
  const monthlyIncome = topCashBook?.totalIncome || 0;
  const monthlyExpense = topCashBook?.totalExpense || 0;
  const closingBalance = topCashBook?.closingBalance || 0;

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb items={BREADCRUMB_CONFIGS.expensesReport} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo Tài chính</h1>
          <p className="text-muted-foreground">
            Theo dõi dòng tiền và số dư quỹ của trang trại
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

      {/* Filter for Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Select value={tempMonth} onValueChange={setTempMonth}>
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue placeholder="Chọn tháng" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
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
          onClick={handleApplyFilters}
          className="gap-2 bg-[#53A88B] hover:bg-[#458F79]"
        >
          Áp dụng
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Số dư đầu kỳ</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">
              {formatCurrency(openingBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Bắt đầu kỳ báo cáo
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng thu trong kỳ</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              Phát sinh tăng
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi trong kỳ</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(monthlyExpense)}
            </div>
            <p className="text-xs text-muted-foreground">
              Phát sinh giảm
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Số dư cuối kỳ</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(closingBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Kết thúc kỳ báo cáo</p>
          </CardContent>
        </Card>
      </div>
      {/* Account Balances */}
      {stats?.accounts && stats.accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Số dư các tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.accounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        account.type === "cash" ? "bg-green-100" : "bg-blue-100"
                      )}
                    >
                      <Wallet
                        className={cn(
                          "h-5 w-5",
                          account.type === "cash"
                            ? "text-green-600"
                            : "text-blue-600"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {account.type === "cash" ? "Tiền mặt" : "Ngân hàng"}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-[280px] justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, "dd/MM/yyyy", {
                        locale: vi,
                      })}{" "}
                      - {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range: any) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  value={selectedAccount}
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tài khoản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả TK</SelectItem>
                    {accounts?.map((acc: any) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={transactionType}
                  onValueChange={setTransactionType}
                >
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="income">Phiếu thu</SelectItem>
                    <SelectItem value="expense">Phiếu chi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách giao dịch</CardTitle>
              <CardDescription>
                Hiển thị {transactions?.data?.length || 0} /{" "}
                {transactions?.total || 0} giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã phiếu</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Đối tượng</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Đang tải...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transactions?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            Không có giao dịch nào
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions?.data?.map((tx: any) => (
                        <TableRow key={tx.id} className="group">
                          <TableCell className="font-mono text-sm">
                            {tx.transactionCode}
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(tx.transactionDate),
                              "dd/MM/yyyy",
                              { locale: vi }
                            )}
                          </TableCell>
                          <TableCell>
                            {tx.transactionType === "income" ? (
                              <Badge className="bg-green-100 text-green-700">
                                Thu
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                Chi
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {tx.transactionCategories?.name || "-"}
                          </TableCell>
                          <TableCell>{tx.contactName || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {tx.description || "-"}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              tx.transactionType === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            {tx.transactionType === "income" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/finance/transactions/${tx.id}`
                                    )
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `/finance/transactions/${tx.id}/edit`
                                    )
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {transactions && transactions.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {page} / {transactions.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p: number) =>
                          Math.min(transactions.totalPages, p + 1)
                        )
                      }
                      disabled={page === transactions.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashbook">
          <Card>
            <CardHeader>
              <CardTitle>Sổ quỹ</CardTitle>
              <CardDescription>
                Từ {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} đến{" "}
                {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Summary */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Đầu kỳ</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(cashBook?.openingBalance || 0)}
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-green-600">Tổng thu</p>
                  <p className="text-xl font-bold text-green-700">
                    +{formatCurrency(cashBook?.totalIncome || 0)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <p className="text-sm text-red-600">Tổng chi</p>
                  <p className="text-xl font-bold text-red-700">
                    -{formatCurrency(cashBook?.totalExpense || 0)}
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">Cuối kỳ</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(cashBook?.closingBalance || 0)}
                  </p>
                </div>
              </div>

              {/* Cash Book Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Mã phiếu</TableHead>
                      <TableHead>Diễn giải</TableHead>
                      <TableHead className="text-right">Thu</TableHead>
                      <TableHead className="text-right">Chi</TableHead>
                      <TableHead className="text-right">Số dư</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={5} className="font-medium">
                        Số dư đầu kỳ
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(cashBook?.openingBalance || 0)}
                      </TableCell>
                    </TableRow>
                    {cashBook?.transactions?.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {format(new Date(tx.transactionDate), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.transactionCode}
                        </TableCell>
                        <TableCell>
                          {tx.description ||
                            tx.transactionCategories?.name ||
                            "-"}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {tx.transactionType === "income"
                            ? formatCurrency(tx.amount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {tx.transactionType === "expense"
                            ? formatCurrency(tx.amount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(tx.runningBalance || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={3}>
                        Cộng phát sinh / Số dư cuối kỳ
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(cashBook?.totalIncome || 0)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(cashBook?.totalExpense || 0)}
                      </TableCell>
                      <TableCell className="text-right text-primary">
                        {formatCurrency(cashBook?.closingBalance || 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Income by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Thu theo danh mục
                </CardTitle>
                <CardDescription>
                  Tổng: {formatCurrency(summary?.totalIncome || 0)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!summary?.incomeByCategory ||
                Object.keys(summary.incomeByCategory).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Không có dữ liệu
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(summary.incomeByCategory).map(
                      ([id, cat]: [string, any]) => (
                        <div
                          key={id}
                          className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20"
                        >
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {cat.count} giao dịch
                            </p>
                          </div>
                          <p className="font-bold text-green-600">
                            {formatCurrency(cat.amount)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expense by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">
                  Chi theo danh mục
                </CardTitle>
                <CardDescription>
                  Tổng: {formatCurrency(summary?.totalExpense || 0)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!summary?.expenseByCategory ||
                Object.keys(summary.expenseByCategory).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Không có dữ liệu
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(summary.expenseByCategory).map(
                      ([id, cat]: [string, any]) => (
                        <div
                          key={id}
                          className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20"
                        >
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {cat.count} giao dịch
                            </p>
                          </div>
                          <p className="font-bold text-red-600">
                            {formatCurrency(cat.amount)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
