// =====================================================
// STOCK RECEIPTS PAGE - app/(dashboard)/inventory/receipts/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  FileInput,
  Search,
  Plus,
  FileDown,
  MoreHorizontal,
  Eye,
  Edit,
  Check,
  X,
  CalendarIcon,
  Filter,
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
  useStockReceipts,
  useWarehouses,
  useSuppliers,
  useConfirmStockReceipt,
  useCancelStockReceipt,
} from '@/hooks/use-inventory';
import { formatCurrency, cn, getStatusLabel, getStatusColor } from '@/lib/utils';
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

const FARM_ID = 'demo-farm-id';

export default function StockReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: warehouses } = useWarehouses(FARM_ID);
  const { data: suppliers } = useSuppliers(FARM_ID);
  const { data: receipts, isLoading } = useStockReceipts({
    farmId: FARM_ID,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    supplierId: selectedSupplier !== 'all' ? selectedSupplier : undefined,
    status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
    fromDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    toDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    search: searchTerm || undefined,
    page,
    limit: 20,
  });

  const confirmReceipt = useConfirmStockReceipt();
  const cancelReceipt = useCancelStockReceipt();

  const handleConfirm = async () => {
    if (!confirmingId) return;
    try {
      await confirmReceipt.mutateAsync(confirmingId);
      toast( 'Thành công', {
       
        description: 'Đã xác nhận phiếu nhập kho',
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
      await cancelReceipt.mutateAsync(cancellingId);
      toast('Thành công',{
        description: 'Đã hủy phiếu nhập kho',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể hủy phiếu',
        // variant: 'destructive',
      });
    }
    setCancellingId(null);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="badge-success">Đã TT</Badge>;
      case 'partial':
        return <Badge className="badge-warning">TT một phần</Badge>;
      case 'unpaid':
        return <Badge className="badge-danger">Chưa TT</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <PageBreadcrumb items={BREADCRUMB_CONFIGS.receipts} />
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phiếu nhập kho</h1>
          <p className="text-muted-foreground">Quản lý các phiếu nhập hàng vào kho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Link href="/inventory/receipts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo phiếu nhập
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
                  placeholder="Tìm theo mã phiếu, số hóa đơn..."
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
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
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
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả NCC</SelectItem>
                  {suppliers?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
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
              {(dateRange.from || selectedWarehouse !== 'all' || selectedSupplier !== 'all' || selectedStatus !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDateRange({});
                    setSelectedWarehouse('all');
                    setSelectedSupplier('all');
                    setSelectedStatus('all');
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
          <CardTitle>Danh sách phiếu nhập</CardTitle>
          <CardDescription>
            Hiển thị {receipts?.data?.length || 0} / {receipts?.total || 0} phiếu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead className="text-right">Đã TT</TableHead>
                  <TableHead>TT thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
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
                ) : receipts?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <FileInput className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Chưa có phiếu nhập nào</p>
                      <Link href="/inventory/receipts/new">
                        <Button variant="link" className="mt-2">
                          Tạo phiếu nhập đầu tiên
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  receipts?.data?.map((receipt) => (
                    <TableRow key={receipt.id} className="group">
                      <TableCell className="font-mono font-medium">
                        {receipt.receiptCode}
                      </TableCell>
                      <TableCell>
                        {format(new Date(receipt.receiptDate), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{receipt.warehouse?.name}</TableCell>
                      <TableCell>{receipt.supplier?.name || '-'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(receipt.finalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(receipt.paidAmount)}
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(receipt.paymentStatus)}</TableCell>
                      <TableCell>{getDocStatusBadge(receipt.status)}</TableCell>
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
                            <Link href={`/inventory/receipts/${receipt.id}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                            </Link>
                            {receipt.status === 'draft' && (
                              <>
                                <Link href={`/inventory/receipts/${receipt.id}/edit`}>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setConfirmingId(receipt.id)}
                                  className="text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setCancellingId(receipt.id)}
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
          {receipts && receipts.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Trang {page} / {receipts.totalPages}
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
                  onClick={() => setPage((p) => Math.min(receipts.totalPages, p + 1))}
                  disabled={page === receipts.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmingId} onOpenChange={() => setConfirmingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phiếu nhập kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi xác nhận, tồn kho sẽ được cập nhật và công nợ nhà cung cấp sẽ được ghi nhận.
              Bạn không thể sửa đổi phiếu sau khi xác nhận.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu nhập kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu nhập sẽ được chuyển sang trạng thái đã hủy. Bạn có chắc chắn muốn hủy?
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