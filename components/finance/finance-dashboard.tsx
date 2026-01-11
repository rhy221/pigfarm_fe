// =====================================================
// FINANCE DASHBOARD COMPONENT
// =====================================================

'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useDashboardStats,
  useTransactions,
  useCashBookReport,
  useFinancialSummary,
  useCashAccounts,
} from '@/hooks/use-finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
} from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { TransactionType } from '@/types/finance';

interface FinanceDashboardProps {
  // : string;
}

export default function FinanceDashboard() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: accounts } = useCashAccounts();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({
    
    cashAccountId: selectedAccount !== 'all' ? selectedAccount : undefined,
    transactionType: transactionType !== 'all' ? (transactionType as TransactionType) : undefined,
    fromDate: format(dateRange.from, 'yyyy-MM-dd'),
    toDate: format(dateRange.to, 'yyyy-MM-dd'),
    search: searchTerm || undefined,
    page,
    limit: 20,
  });

  const { data: summary } = useFinancialSummary({
    
    fromDate: format(dateRange.from, 'yyyy-MM-dd'),
    toDate: format(dateRange.to, 'yyyy-MM-dd'),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý chi phí</h1>
          <p className="text-muted-foreground">Theo dõi thu chi và sổ quỹ của trang trại</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Link href="/finance/transactions/new?type=expense">
            <Button variant="outline">
              <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
              Phiếu chi
            </Button>
          </Link>
          <Link href="/finance/transactions/new?type=income">
            <Button>
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Phiếu thu
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dư</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats?.cashBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.accounts?.length || 0} tài khoản
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thu trong tháng</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(stats?.monthlyIncome || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi trong tháng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(stats?.monthlyExpense || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ NCC</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats?.totalSupplierDebt || 0)}
            </div>
            {stats?.overdueCount ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {stats.overdueCount} hóa đơn quá hạn
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Không có quá hạn</p>
            )}
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
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {stats.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="cashbook">Sổ quỹ</TabsTrigger>
          <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
          <TabsTrigger value="monthly-bills">Hóa đơn tháng</TabsTrigger>
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
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} -{' '}
                      {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tài khoản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả TK</SelectItem>
                    {accounts?.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="w-[150px]">
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
                Hiển thị {transactions?.data?.length || 0} / {transactions?.total || 0} giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : transactions?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Không có giao dịch nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions?.data?.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.transactionCode}</TableCell>
                        <TableCell>
                          {format(new Date(tx.transactionDate), 'dd/MM/yyyy', { locale: vi })}
                        </TableCell>
                        <TableCell>
                          {tx.transactionType === 'income' ? (
                            <Badge className="bg-green-100 text-green-700">Thu</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">Chi</Badge>
                          )}
                        </TableCell>
                        <TableCell>{tx.category?.name || '-'}</TableCell>
                        <TableCell>{tx.contactName || '-'}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {tx.description || '-'}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-medium',
                            tx.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {tx.transactionType === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

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
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(transactions.totalPages, p + 1))}
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
          <CashBookTab dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="summary">
          <FinancialSummaryTab summary={summary} />
        </TabsContent>

        <TabsContent value="monthly-bills">
          <MonthlyBillsTab  />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components
function CashBookTab({

  dateRange,
}: {
 
  dateRange: { from: Date; to: Date };
}) {
  const { data: cashBook, isLoading } = useCashBookReport({
    
    fromDate: format(dateRange.from, 'yyyy-MM-dd'),
    toDate: format(dateRange.to, 'yyyy-MM-dd'),
  });

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sổ quỹ</CardTitle>
        <CardDescription>
          Từ {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} đến{' '}
          {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Đầu kỳ</p>
            <p className="text-xl font-bold">{formatCurrency(cashBook?.openingBalance || 0)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Tổng thu</p>
            <p className="text-xl font-bold text-green-700">
              +{formatCurrency(cashBook?.totalIncome || 0)}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
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

        {/* Transactions with running balance */}
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
            <TableRow className="bg-muted">
              <TableCell colSpan={5} className="font-medium">
                Số dư đầu kỳ
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(cashBook?.openingBalance || 0)}
              </TableCell>
            </TableRow>
            {cashBook?.transactions?.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {format(new Date(tx.transactionDate), 'dd/MM/yyyy', { locale: vi })}
                </TableCell>
                <TableCell className="font-mono text-sm">{tx.transactionCode}</TableCell>
                <TableCell>{tx.description || tx.category?.name || '-'}</TableCell>
                <TableCell className="text-right text-green-600">
                  {tx.transactionType === 'income' ? formatCurrency(tx.amount) : '-'}
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {tx.transactionType === 'expense' ? formatCurrency(tx.amount) : '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(tx.runningBalance || 0)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold">
              <TableCell colSpan={3}>Cộng phát sinh / Số dư cuối kỳ</TableCell>
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
      </CardContent>
    </Card>
  );
}

function FinancialSummaryTab({ summary }: { summary: any }) {
  if (!summary) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  const incomeCategories = Object.entries(summary.incomeByCategory || {});
  const expenseCategories = Object.entries(summary.expenseByCategory || {});

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Income by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Thu theo danh mục</CardTitle>
          <CardDescription>Tổng: {formatCurrency(summary.totalIncome)}</CardDescription>
        </CardHeader>
        <CardContent>
          {incomeCategories.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Không có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {incomeCategories.map(([id, cat]: [string, any]) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} giao dịch</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(cat.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Chi theo danh mục</CardTitle>
          <CardDescription>Tổng: {formatCurrency(summary.totalExpense)}</CardDescription>
        </CardHeader>
        <CardContent>
          {expenseCategories.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Không có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {expenseCategories.map(([id, cat]: [string, any]) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} giao dịch</p>
                  </div>
                  <p className="font-bold text-red-600">{formatCurrency(cat.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MonthlyBillsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hóa đơn tháng</CardTitle>
            <CardDescription>Theo dõi các chi phí cố định hàng tháng</CardDescription>
          </div>
          <Link href="/finance/monthly-bills/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm hóa đơn
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-8">
          Xem component MonthlyBillForm để quản lý hóa đơn tháng
        </p>
      </CardContent>
    </Card>
  );
}