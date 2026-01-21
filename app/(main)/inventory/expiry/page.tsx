// =====================================================
// EXPIRY ALERTS PAGE - app/(dashboard)/inventory/expiry/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  AlertTriangle,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Trash2,
  RefreshCw,
  Filter,
  FileDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import {
  useExpirySummary,
  useExpiryAlerts,
  useDisposeBatch,
  useUpdateExpiredBatches,
  useWarehouses,
  useWarehouseCategories,
} from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { ExpiryStatus, ExpiryAlert } from '@/types/inventory';
import { toast } from 'sonner';

// const  = 'demo-farm-id';

const breadcrumbItems = [
  { label: 'Quản lý Kho', href: '/inventory' },
  { label: 'Cảnh báo hạn sử dụng' },
];

export default function ExpiryAlertsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [disposeDialog, setDisposeDialog] = useState<{ open: boolean; batch: ExpiryAlert | null }>({
    open: false,
    batch: null,
  });
  const [disposeReason, setDisposeReason] = useState('');


  const { data: summary } = useExpirySummary();
  const { data: warehouses } = useWarehouses();
  const { data: categories } = useWarehouseCategories();
  const { data: alerts, isLoading, refetch } = useExpiryAlerts({
    // farmId: ,
    expiryStatus: selectedStatus !== 'all' ? selectedStatus as ExpiryStatus : undefined,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    page,
    limit: 20,
  });

  const disposeBatch = useDisposeBatch();
  const updateExpired = useUpdateExpiredBatches();

  const handleUpdateExpiredStatus = async () => {
    try {
      const result = await updateExpired.mutateAsync();
      toast('Thành công',{description: `Đã cập nhật trạng thái` });
      refetch();
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        //variant: 'destructive' 
        });
    }
  };

  const handleDispose = async () => {
    if (!disposeDialog.batch) return;
    try {
      await disposeBatch.mutateAsync({
        batchId: disposeDialog.batch.batchId,
        reason: disposeReason,
      });
      toast('Thành công',{description: 'Đã hủy lô hàng' });
      setDisposeDialog({ open: false, batch: null });
      setDisposeReason('');
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        //variant: 'destructive' 
    });
    }
  };

  const getStatusBadge = (status: string, daysLeft?: number | null) => {
    switch (status) {
      case 'expired':
        return <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />Đã hết hạn</Badge>;
      case 'critical':
        return <Badge className="bg-orange-500 text-white"><AlertTriangle className="h-3 w-3 mr-1" />Sắp hết hạn</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white"><Clock className="h-3 w-3 mr-1" />Cảnh báo</Badge>;
      case 'notice':
        return <Badge className="bg-blue-500 text-white"><Clock className="h-3 w-3 mr-1" />Lưu ý</Badge>;
      default:
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Còn hạn</Badge>;
    }
  };

  const getDaysText = (days?: number | null) => {
    if (days === null || days === undefined) return '-';
    if (days < 0) return <span className="text-red-600 font-medium">Quá {Math.abs(days)} ngày</span>;
    if (days === 0) return <span className="text-red-600 font-medium">Hôm nay</span>;
    if (days <= 7) return <span className="text-orange-600 font-medium">{days} ngày</span>;
    if (days <= 30) return <span className="text-yellow-600">{days} ngày</span>;
    return <span className="text-muted-foreground">{days} ngày</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageBreadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cảnh báo hạn sử dụng</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý vật tư sắp hết hạn</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUpdateExpiredStatus} disabled={updateExpired.isPending}>
            <RefreshCw className={cn('mr-2 h-4 w-4', updateExpired.isPending && 'animate-spin')} />
            Cập nhật
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Đã hết hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {summary?.expiredCount || 0} lô
            </div>
            <p className="text-xs text-red-600">{formatCurrency(summary?.expiredValue || 0)}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Sắp hết hạn (7 ngày)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {summary?.criticalCount || 0} lô
            </div>
            <p className="text-xs text-orange-600">{formatCurrency(summary?.criticalValue || 0)}</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Cảnh báo (30 ngày)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {summary?.warningCount || 0} lô
            </div>
            <p className="text-xs text-yellow-600">{formatCurrency(summary?.warningValue || 0)}</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tổng cảnh báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {summary?.totalAlerts || 0} lô
            </div>
            <p className="text-xs text-blue-600">Lưu ý 90 ngày: {summary?.noticeCount || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bộ lọc:</span>
            </div>
            <Select value={selectedStatus} onValueChange={(v) => { setSelectedStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="expired">Đã hết hạn</SelectItem>
                <SelectItem value="critical">Sắp hết hạn (7 ngày)</SelectItem>
                <SelectItem value="warning">Cảnh báo (30 ngày)</SelectItem>
                <SelectItem value="notice">Lưu ý (90 ngày)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedWarehouse} onValueChange={(v) => { setSelectedWarehouse(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kho</SelectItem>
                {warehouses?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách cảnh báo</CardTitle>
          <CardDescription>{alerts?.total || 0} lô hàng cần chú ý</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : alerts?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có cảnh báo</h3>
              <p className="text-muted-foreground">Tất cả vật tư còn trong hạn sử dụng</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Kho</TableHead>
                    <TableHead>Số lô</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                    <TableHead className="text-right">Giá trị</TableHead>
                    <TableHead>Hạn SD</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts?.data.map((alert) => (
                    <TableRow 
                      key={alert.batchId}
                      className={cn(
                        alert.expiryStatus === 'expired' && 'bg-red-50 dark:bg-red-950/10',
                        alert.expiryStatus === 'critical' && 'bg-orange-50 dark:bg-orange-950/10',
                      )}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.productName}</p>
                          <p className="text-sm text-muted-foreground">{alert.categoryName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{alert.warehouseName}</TableCell>
                      <TableCell>{alert.batchNumber || '-'}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(alert.quantity)} {alert.unitName}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(alert.totalValue)}
                      </TableCell>
                      <TableCell>
                        {alert.expiryDate ? format(new Date(alert.expiryDate), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell>{getDaysText(alert.daysUntilExpiry)}</TableCell>
                      <TableCell>{getStatusBadge(alert.expiryStatus)}</TableCell>
                      <TableCell>
                        {(alert.expiryStatus === 'expired' || alert.expiryStatus === 'critical') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                            onClick={() => setDisposeDialog({ open: true, batch: alert })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {alerts && alerts.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {alerts.page} / {alerts.totalPages}
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
                      onClick={() => setPage((p) => Math.min(alerts.totalPages, p + 1))}
                      disabled={page === alerts.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dispose Dialog */}
      <AlertDialog open={disposeDialog.open} onOpenChange={(open) => setDisposeDialog({ open, batch: open ? disposeDialog.batch : null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy lô hàng hết hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hủy lô hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {disposeDialog.batch && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{disposeDialog.batch.productName}</p>
                <p className="text-sm text-muted-foreground">
                  Số lô: {disposeDialog.batch.batchNumber || '-'} | 
                  Số lượng: {formatNumber(disposeDialog.batch.quantity)} {disposeDialog.batch.unitName}
                </p>
                <p className="text-sm text-red-600 font-medium mt-1">
                  Giá trị: {formatCurrency(disposeDialog.batch.totalValue)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Lý do hủy</label>
                <Textarea
                  value={disposeReason}
                  onChange={(e) => setDisposeReason(e.target.value)}
                  placeholder="Nhập lý do hủy lô hàng..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDisposeReason(''); }}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDispose}
              className="bg-red-600 hover:bg-red-700"
              disabled={disposeBatch.isPending}
            >
              {disposeBatch.isPending ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}