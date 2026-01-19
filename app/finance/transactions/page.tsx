// =====================================================
// TRANSACTIONS PAGE - app/(dashboard)/finance/transactions/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Receipt,
  Search,
  Plus,
  FileDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CalendarIcon,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useTransactions,
  useCashAccounts,
  useTransactionCategories,
  useDeleteTransaction,
} from '@/hooks/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import { TransactionType } from '@/types/finance';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS,  PageBreadcrumb } from '@/components/page-breadcrumb';
import { useRouter } from 'next/navigation';

// const  = 'demo-farm-id';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();
  const { data: accounts } = useCashAccounts();
  const { data: categories } = useTransactionCategories();
  const { data: transactions, isLoading } = useTransactions({
    // farmId: ,
    cashAccountId: selectedAccount !== 'all' ? selectedAccount : undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    transactionType: transactionType !== 'all' ? (transactionType as TransactionType) : undefined,
    fromDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    toDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    search: searchTerm || undefined,
    page,
    limit: 20,
  });

  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTransaction.mutateAsync(deletingId);
      toast('Thành công', {
        description: 'Đã xóa giao dịch',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xóa giao dịch',
        // variant: 'destructive',
      });
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <PageBreadcrumb items={BREADCRUMB_CONFIGS.transactions} />
    
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phiếu thu / chi</h1>
          <p className="text-muted-foreground">Quản lý các giao dịch thu chi</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button> */}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã phiếu, mô tả, đối tượng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[280px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                          {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      'Chọn khoảng thời gian'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="income">Phiếu thu</SelectItem>
                  <SelectItem value="expense">Phiếu chi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-full md:w-[180px]">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(dateRange.from || selectedAccount !== 'all' || selectedCategory !== 'all' || transactionType !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDateRange({});
                    setSelectedAccount('all');
                    setSelectedCategory('all');
                    setTransactionType('all');
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>
            Hiển thị {transactions?.data?.length || 0} / {transactions?.total || 0} giao dịch
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
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Chưa có giao dịch nào</p>
                      <div className="flex gap-2 justify-center mt-4">
                        <Link href="/finance/transactions/new?type=income">
                          <Button variant="outline" size="sm">
                            <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                            Tạo phiếu thu
                          </Button>
                        </Link>
                        <Link href="/finance/transactions/new?type=expense">
                          <Button variant="outline" size="sm">
                            <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
                            Tạo phiếu chi
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions?.data?.map((tx) => (
                    <TableRow key={tx.id} className="group">
                      <TableCell className="font-mono font-medium">{tx.transactionCode}</TableCell>
                      <TableCell>
                        {format(new Date(tx.transactionDate), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>
                        {tx.transactionType === 'income' ? (
                          <Badge className="badge-success">
                            <ArrowUpCircle className="mr-1 h-3 w-3" />
                            Thu
                          </Badge>
                        ) : (
                          <Badge className="badge-danger">
                            <ArrowDownCircle className="mr-1 h-3 w-3" />
                            Chi
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{tx.cashAccounts?.name}</TableCell>
                      <TableCell>{tx.transactionCategories?.name || '-'}</TableCell>
                      <TableCell>{tx.contactName || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{tx.description || '-'}</TableCell>
                      <TableCell className={cn(
                        'text-right font-bold',
                        tx.transactionType === 'income' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {tx.transactionType === 'income' ? '+' : '-'}
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
                            onClick={() => router.push(`/finance/transactions/${tx.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={() => router.push(`/finance/transactions/${tx.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingId(tx.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
            <AlertDialogDescription>
              Giao dịch sẽ được xóa và số dư tài khoản sẽ được cập nhật lại. 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}