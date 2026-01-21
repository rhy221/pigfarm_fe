// =====================================================
// STOCK ISSUES PAGE - app/(dashboard)/inventory/issues/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  FileOutput,
  Search,
  Plus,
  FileDown,
  MoreHorizontal,
  Eye,
  Edit,
  Check,
  X,
  CalendarIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  useStockIssues,
  useWarehouses,
  useConfirmStockIssue,
  useCancelStockIssue,
} from '@/hooks/use-inventory';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
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
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';
import { useRouter } from 'next/navigation';


// const  = 'demo-farm-id';

const issueTypeLabels: Record<string, string> = {
  usage: 'Sử dụng',
  sale: 'Bán hàng',
  transfer: 'Chuyển kho',
  disposal: 'Hủy bỏ',
  return: 'Trả hàng',
};

export default function StockIssuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const router = useRouter();
  const { data: warehouses } = useWarehouses();
  const { data: issues, isLoading } = useStockIssues({
    // farmId: ,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
    issueType: selectedType !== 'all' ? (selectedType as any) : undefined,
    fromDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    toDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    search: searchTerm || undefined,
    page,
    limit: 20,
  });

  const confirmIssue = useConfirmStockIssue();
  const cancelIssue = useCancelStockIssue();

  const handleConfirm = async () => {
    if (!confirmingId) return;
    try {
      await confirmIssue.mutateAsync(confirmingId);
      toast('Thành công', {
        description: 'Đã xác nhận phiếu xuất kho',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xác nhận phiếu',
        // variant: 'destructive',
      });
    }
    setConfirmingId(null);
  };

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      await cancelIssue.mutateAsync(cancellingId);
      toast('Thành công', {
        description: 'Đã hủy phiếu xuất kho',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể hủy phiếu',
        // variant: 'destructive',
      });
    }
    setCancellingId(null);
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="badge-success">Đã xác nhận</Badge>;
      case 'cancelled':
        return <Badge className="badge-danger">Đã hủy</Badge>;
      case 'draft':
        return <Badge variant="outline">Nháp</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <PageBreadcrumb items={BREADCRUMB_CONFIGS.issues} />
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phiếu xuất kho</h1>
          <p className="text-muted-foreground">Quản lý các phiếu xuất hàng từ kho</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button> */}
          <Link href="/inventory/issues/new">
            <Button 
            // onClick={() => router.push("/inventory/issues/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo phiếu xuất
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
                  placeholder="Tìm theo mã phiếu, mục đích..."
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
              <Select
              // key={warehouses ? 'loaded' : 'loading'} 
               value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Kho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kho</SelectItem>
                  {warehouses?.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Loại xuất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="usage">Sử dụng</SelectItem>
                  <SelectItem value="sale">Bán hàng</SelectItem>
                  <SelectItem value="transfer">Chuyển kho</SelectItem>
                  <SelectItem value="disposal">Hủy bỏ</SelectItem>
                  <SelectItem value="return">Trả hàng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phiếu xuất</CardTitle>
          <CardDescription>
            Hiển thị {issues?.data?.length || 0} / {issues?.total || 0} phiếu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Ngày xuất</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Loại xuất</TableHead>
                  <TableHead>Mục đích</TableHead>
                  <TableHead className="text-right">Tổng giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : issues?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <FileOutput className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Chưa có phiếu xuất nào</p>
                      <Link href="/inventory/issues/new">
                        <Button variant="link" className="mt-2">
                          Tạo phiếu xuất đầu tiên
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  issues?.data?.map((issue) => (
                    <TableRow key={issue.id} className="group">
                      <TableCell className="font-mono font-medium">
                        {issue.issueCode}
                      </TableCell>
                      <TableCell>
                        {format(new Date(issue.issueDate), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{issue.warehouses?.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {issueTypeLabels[issue.issueType] || issue.issueType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {issue.purpose || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(issue.totalAmount)}
                      </TableCell>
                      <TableCell>{getDocStatusBadge(issue.status)}</TableCell>
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
                            <Link href={`/inventory/issues/${issue.id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                            </Link>
                            {issue.status === 'draft' && (
                              <>
                                <DropdownMenuSeparator />
                                 {/* <Link href={`/inventory/receipts/${receipt.id}/edit`}> */}
                                  <DropdownMenuItem
                                  onClick={() => router.push(`/inventory/issues/${issue.id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                {/* </Link> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setConfirmingId(issue.id)}
                                  className="text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCancellingId(issue.id)}
                                  className="text-destructive"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Hủy phiếu
                                </DropdownMenuItem>
                              </>
                            )}
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
          {issues && issues.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Trang {page} / {issues.totalPages}
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
                  onClick={() => setPage((p) => Math.min(issues.totalPages, p + 1))}
                  disabled={page === issues.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AlertDialog open={!!confirmingId} onOpenChange={() => setConfirmingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phiếu xuất kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi xác nhận, tồn kho sẽ được trừ đi. Bạn không thể sửa đổi phiếu sau khi xác nhận.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu xuất kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu xuất sẽ được chuyển sang trạng thái đã hủy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hủy phiếu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}