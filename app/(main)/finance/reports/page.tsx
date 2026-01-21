// =====================================================
// REPORTS PAGE - Báo cáo tổng hợp
// =====================================================

'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Users,
  Calendar,
  Download,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';
import {
  useIncomeExpenseReport,
  useInventoryReport,
  useSupplierDebtReport,
  useCashFlowReport,
} from '@/hooks/use-finance';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';

const FARM_ID = 'demo-farm-id';

type PeriodType = 'this_month' | 'last_month' | 'this_quarter' | 'this_year';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('income-expense');
  const [periodType, setPeriodType] = useState<PeriodType>('this_month');

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (periodType) {
      case 'this_month':
        return {
          startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        };
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        return {
          startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
        };
      case 'this_quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
        return {
          startDate: format(quarterStart, 'yyyy-MM-dd'),
          endDate: format(quarterEnd, 'yyyy-MM-dd'),
        };
      case 'this_year':
        return {
          startDate: format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd'),
          endDate: format(new Date(now.getFullYear(), 11, 31), 'yyyy-MM-dd'),
        };
    }
  }, [periodType]);

  const { data: incomeExpense, isLoading: loadingIE } = useIncomeExpenseReport(
     dateRange.startDate, dateRange.endDate
  );
  const { data: inventory, isLoading: loadingInv } = useInventoryReport(FARM_ID);
  const { data: supplierDebt, isLoading: loadingDebt } = useSupplierDebtReport(
     dateRange.startDate, dateRange.endDate
  );
  const { data: cashFlow, isLoading: loadingCF } = useCashFlowReport(
     dateRange.startDate, dateRange.endDate
  );

  const periodLabels: Record<PeriodType, string> = {
    this_month: 'Tháng này',
    last_month: 'Tháng trước',
    this_quarter: 'Quý này',
    this_year: 'Năm nay',
  };

  // Mock data for demo (replace with actual data from hooks)
  const mockIncomeExpense = incomeExpense || {
    summary: { totalIncome: 150000000, totalExpense: 120000000, netProfit: 30000000, profitMargin: 20 },
    incomeByCategory: [
      { categoryId: '1', categoryName: 'Bán heo', amount: 120000000, percentage: 80, transactionCount: 15 },
      { categoryId: '2', categoryName: 'Bán phụ phẩm', amount: 20000000, percentage: 13.3, transactionCount: 8 },
      { categoryId: '3', categoryName: 'Thu khác', amount: 10000000, percentage: 6.7, transactionCount: 5 },
    ],
    expenseByCategory: [
      { categoryId: '1', categoryName: 'Thức ăn', amount: 60000000, percentage: 50, transactionCount: 20 },
      { categoryId: '2', categoryName: 'Thuốc thú y', amount: 25000000, percentage: 20.8, transactionCount: 12 },
      { categoryId: '3', categoryName: 'Nhân công', amount: 20000000, percentage: 16.7, transactionCount: 4 },
      { categoryId: '4', categoryName: 'Điện nước', amount: 10000000, percentage: 8.3, transactionCount: 2 },
      { categoryId: '5', categoryName: 'Chi khác', amount: 5000000, percentage: 4.2, transactionCount: 10 },
    ],
  };

  const mockInventory = inventory || {
    summary: { totalProducts: 45, totalValue: 280000000, lowStockCount: 5, outOfStockCount: 2, expiringCount: 3 },
    byCategory: [
      { categoryId: '1', categoryName: 'Thức ăn', productCount: 15, totalValue: 150000000, percentage: 53.6 },
      { categoryId: '2', categoryName: 'Thuốc thú y', productCount: 20, totalValue: 80000000, percentage: 28.6 },
      { categoryId: '3', categoryName: 'Thiết bị', productCount: 10, totalValue: 50000000, percentage: 17.8 },
    ],
  };

  const mockDebt = supplierDebt || {
    summary: { totalDebt: 85000000, totalPurchase: 200000000, totalPayment: 115000000, supplierCount: 8 },
    agingAnalysis: { current: 50000000, days30to60: 20000000, days60to90: 10000000, over90Days: 5000000 },
  };

  const mockCashFlow = cashFlow || {
    summary: { openingBalance: 100000000, totalInflow: 150000000, totalOutflow: 120000000, closingBalance: 130000000 },
    byAccount: [
      { accountId: '1', accountName: 'Tiền mặt', accountType: 'cash', openingBalance: 30000000, inflow: 80000000, outflow: 70000000, closingBalance: 40000000 },
      { accountId: '2', accountName: 'Vietcombank', accountType: 'bank', openingBalance: 70000000, inflow: 70000000, outflow: 50000000, closingBalance: 90000000 },
    ],
  };

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb
        items={BREADCRUMB_CONFIGS.reports}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo tổng hợp</h1>
          <p className="text-muted-foreground">
            Phân tích và thống kê hoạt động kinh doanh
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={periodType} onValueChange={(v) => setPeriodType(v as PeriodType)}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">Tháng này</SelectItem>
              <SelectItem value="last_month">Tháng trước</SelectItem>
              <SelectItem value="this_quarter">Quý này</SelectItem>
              <SelectItem value="this_year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="income-expense" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Thu Chi
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Tồn kho
          </TabsTrigger>
          <TabsTrigger value="supplier-debt" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Công nợ
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Dòng tiền
          </TabsTrigger>
        </TabsList>

        {/* Income Expense Tab */}
        <TabsContent value="income-expense" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockIncomeExpense.summary.totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng chi</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(mockIncomeExpense.summary.totalExpense)}
                </div>
              </CardContent>
            </Card>
            <Card className={cn(
              mockIncomeExpense.summary.netProfit >= 0 ? 'border-green-200' : 'border-red-200'
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                {mockIncomeExpense.summary.netProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={cn(
                  'text-2xl font-bold',
                  mockIncomeExpense.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(mockIncomeExpense.summary.netProfit)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Biên lợi nhuận</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockIncomeExpense.summary.profitMargin.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Thu nhập theo danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockIncomeExpense.incomeByCategory.map((cat) => (
                  <div key={cat.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cat.categoryName}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                    <Progress value={cat.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{cat.transactionCount} giao dịch</span>
                      <span>{cat.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Chi phí theo danh mục</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockIncomeExpense.expenseByCategory.map((cat) => (
                  <div key={cat.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cat.categoryName}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                    <Progress value={cat.percentage} className="h-2 [&>div]:bg-red-500" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{cat.transactionCount} giao dịch</span>
                      <span>{cat.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockInventory.summary.totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(mockInventory.summary.totalValue)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sắp hết</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{mockInventory.summary.lowStockCount}</div>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{mockInventory.summary.outOfStockCount}</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{mockInventory.summary.expiringCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tồn kho theo danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInventory.byCategory.map((cat) => (
                <div key={cat.categoryId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{cat.categoryName}</span>
                      <span className="text-muted-foreground ml-2">({cat.productCount} SP)</span>
                    </div>
                    <span className="font-bold">{formatCurrency(cat.totalValue)}</span>
                  </div>
                  <Progress value={cat.percentage} className="h-3" />
                  <p className="text-xs text-muted-foreground text-right">{cat.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Debt Tab */}
        <TabsContent value="supplier-debt" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng công nợ</CardTitle>
                <Users className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(mockDebt.summary.totalDebt)}
                </div>
                <p className="text-xs text-muted-foreground">{mockDebt.summary.supplierCount} NCC</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng mua</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockDebt.summary.totalPurchase)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(mockDebt.summary.totalPayment)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ TT</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockDebt.summary.totalPurchase > 0 
                    ? ((mockDebt.summary.totalPayment / mockDebt.summary.totalPurchase) * 100).toFixed(1)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Phân tích tuổi nợ</CardTitle>
              <CardDescription>Công nợ theo thời gian quá hạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <p className="text-sm text-muted-foreground">0-30 ngày</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(mockDebt.agingAnalysis.current)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <p className="text-sm text-muted-foreground">30-60 ngày</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(mockDebt.agingAnalysis.days30to60)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <p className="text-sm text-muted-foreground">60-90 ngày</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(mockDebt.agingAnalysis.days60to90)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-muted-foreground">Trên 90 ngày</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(mockDebt.agingAnalysis.over90Days)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cash-flow" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Đầu kỳ</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockCashFlow.summary.openingBalance)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(mockCashFlow.summary.totalInflow)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tổng chi</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(mockCashFlow.summary.totalOutflow)}</div>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cuối kỳ</CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(mockCashFlow.summary.closingBalance)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết theo tài khoản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCashFlow.byAccount.map((acc) => (
                  <div key={acc.accountId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={acc.accountType === 'cash' ? 'default' : 'secondary'}>
                          {acc.accountType === 'cash' ? 'Tiền mặt' : 'Ngân hàng'}
                        </Badge>
                        <span className="font-medium">{acc.accountName}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(acc.closingBalance)}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Đầu kỳ</p>
                        <p className="font-medium">{formatCurrency(acc.openingBalance)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Thu</p>
                        <p className="font-medium text-green-600">+{formatCurrency(acc.inflow)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Chi</p>
                        <p className="font-medium text-red-600">-{formatCurrency(acc.outflow)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cuối kỳ</p>
                        <p className="font-medium">{formatCurrency(acc.closingBalance)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}