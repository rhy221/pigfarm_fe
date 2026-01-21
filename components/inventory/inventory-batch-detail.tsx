// =====================================================
// INVENTORY BATCH DETAIL COMPONENT
// Hiển thị chi tiết các lô hàng của một sản phẩm trong kho
// =====================================================

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Package,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  Layers,
  Trash2,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInventoryBatches, useDisposeBatch } from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { Inventory, InventoryBatch } from '@/types/inventory';
import { toast } from 'sonner';

interface InventoryBatchDetailProps {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

export function InventoryBatchDetail({ open, onClose, inventory }: InventoryBatchDetailProps) {
  const [disposeDialog, setDisposeDialog] = useState<{ open: boolean; batch: InventoryBatch | null }>({
    open: false,
    batch: null,
  });
  const [disposeReason, setDisposeReason] = useState('');

  const { data: batches, isLoading, refetch } = useInventoryBatches(inventory?.id || '');
  const disposeBatch = useDisposeBatch();

  const getExpiryStatus = (expiryDate?: string | null) => {
    if (!expiryDate) return { status: 'no_expiry', label: 'Không HSD', color: 'bg-gray-500' };
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'expired', label: 'Đã hết hạn', color: 'bg-red-500', icon: AlertCircle };
    if (daysLeft <= 7) return { status: 'critical', label: `Còn ${daysLeft} ngày`, color: 'bg-orange-500', icon: AlertTriangle };
    if (daysLeft <= 30) return { status: 'warning', label: `Còn ${daysLeft} ngày`, color: 'bg-yellow-500', icon: Clock };
    if (daysLeft <= 90) return { status: 'notice', label: `Còn ${daysLeft} ngày`, color: 'bg-blue-500', icon: Clock };
    return { status: 'good', label: `Còn ${daysLeft} ngày`, color: 'bg-green-500', icon: CheckCircle };
  };

  const handleDispose = async () => {
    if (!disposeDialog.batch) return;
    try {
      await disposeBatch.mutateAsync({
        batchId: disposeDialog.batch.id,
        reason: disposeReason,
      });
      toast('Thành công',{ description: 'Đã hủy lô hàng' });
      setDisposeDialog({ open: false, batch: null });
      setDisposeReason('');
      refetch();
    } catch (error: any) {
      toast('Lỗi',{   description: error.message, 
        //variant: 'destructive' 
    });
    }
  };

  if (!inventory) return null;

  const totalBatchQuantity = batches?.reduce((sum, b) => sum + Number(b.quantity), 0) || 0;
  const expiringCount = batches?.filter(b => {
    if (!b.expiryDate) return false;
    const daysLeft = Math.ceil((new Date(b.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30;
  }).length || 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-6xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Chi tiết lô hàng
            </DialogTitle>
            <DialogDescription>
              Danh sách các lô hàng của sản phẩm trong kho
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6">
            {/* Product Info */}
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base md:text-lg truncate">{inventory.products?.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Mã: {inventory.products?.code || '-'} | Danh mục: {inventory.products?.warehouseCategories?.name || '-'}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm md:text-base px-2 md:px-3 py-1 w-fit shrink-0">
                  {inventory.warehouses?.name}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm">Tổng tồn kho</p>
                  <p className="font-semibold text-sm md:text-lg">
                    {formatNumber(inventory.quantity)} {inventory.products?.units?.abbreviation}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm">Giá vốn TB</p>
                  <p className="font-semibold text-sm md:text-lg">{formatCurrency(inventory.avgCost)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm">Tổng giá trị</p>
                  <p className="font-semibold text-sm md:text-lg text-primary">
                    {formatCurrency(Number(inventory.quantity) * Number(inventory.avgCost))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs md:text-sm">Số lô</p>
                  <p className="font-semibold text-sm md:text-lg">
                    {batches?.length || 0} lô
                    {expiringCount > 0 && (
                      <span className="text-orange-500 text-xs md:text-sm ml-1 md:ml-2">({expiringCount} sắp hết hạn)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Batches List */}
            <div className="mt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-sm md:text-base">
                <Package className="h-4 w-4" />
                Danh sách lô hàng ({batches?.length || 0})
              </h4>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : !batches || batches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Info className="h-12 w-12 mb-2" />
                  <p>Chưa có thông tin lô hàng</p>
                  <p className="text-sm">Lô hàng sẽ được tạo khi xác nhận phiếu nhập</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="min-w-[800px] md:min-w-0 px-4 md:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[140px]">Số lô / Phiếu nhập</TableHead>
                          <TableHead className="min-w-[90px]">Ngày nhập</TableHead>
                          <TableHead className="text-right min-w-[90px]">Số lượng</TableHead>
                          <TableHead className="text-right min-w-[90px]">Đơn giá</TableHead>
                          <TableHead className="text-right min-w-[100px]">Thành tiền</TableHead>
                          <TableHead className="min-w-[90px]">NSX</TableHead>
                          <TableHead className="min-w-[90px]">HSD</TableHead>
                          <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batches.map((batch) => {
                          const expiryInfo = getExpiryStatus(batch.expiryDate);
                          const isExpiringSoon = ['expired', 'critical'].includes(expiryInfo.status);
                          const usagePercent = batch.initialQuantity > 0
                            ? ((Number(batch.initialQuantity) - Number(batch.quantity)) / Number(batch.initialQuantity)) * 100
                            : 0;

                          return (
                            <TableRow
                              key={batch.id}
                              className={cn(
                                expiryInfo.status === 'expired' && 'bg-red-50 dark:bg-red-950/20',
                                expiryInfo.status === 'critical' && 'bg-orange-50 dark:bg-orange-950/20',
                              )}
                            >
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm">{batch.batchNumber || '-'}</p>
                                  {batch.receiptItem?.receipt && (
                                    <p className="text-xs text-muted-foreground">
                                      {batch.receiptItem.receipt.receiptCode}
                                      {batch.receiptItem.receipt.supplier?.name && (
                                        <span> • {batch.receiptItem.receipt.supplier.name}</span>
                                      )}
                                    </p>
                                  )}
                                  {batch.initialQuantity > 0 && (
                                    <div className="mt-1">
                                      <Progress value={usagePercent} className="h-1.5 w-20" />
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        Đã dùng {usagePercent.toFixed(0)}%
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {batch.receivedDate
                                  ? format(new Date(batch.receivedDate), 'dd/MM/yyyy')
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right font-medium text-sm">
                                {formatNumber(batch.quantity)}
                                <span className="text-muted-foreground text-xs ml-1">
                                  / {formatNumber(batch.initialQuantity)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {formatCurrency(batch.unitCost)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-sm">
                                {formatCurrency(Number(batch.quantity) * Number(batch.unitCost))}
                              </TableCell>
                              <TableCell className="text-sm">
                                {batch.manufacturingDate
                                  ? format(new Date(batch.manufacturingDate), 'dd/MM/yyyy')
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {batch.expiryDate
                                  ? format(new Date(batch.expiryDate), 'dd/MM/yyyy')
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge className={cn('text-white text-xs', expiryInfo.color)}>
                                  {expiryInfo.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {isExpiringSoon && Number(batch.quantity) > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => setDisposeDialog({ open: true, batch })}
                                    title="Hủy lô hàng"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          {batches && batches.length > 0 && (
            <div className="px-4 md:px-6 py-3 md:py-4 border-t shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs md:text-sm bg-background">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                  <span>Hết hạn: {batches.filter(b => getExpiryStatus(b.expiryDate).status === 'expired').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-orange-500" />
                  <span>Sắp hết (7 ngày): {batches.filter(b => getExpiryStatus(b.expiryDate).status === 'critical').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                  <span>Cảnh báo (30 ngày): {batches.filter(b => getExpiryStatus(b.expiryDate).status === 'warning').length}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClose}>
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispose Dialog */}
      <AlertDialog 
        open={disposeDialog.open} 
        onOpenChange={(open) => setDisposeDialog({ open, batch: open ? disposeDialog.batch : null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy lô hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hủy lô hàng này? Số lượng sẽ bị trừ khỏi tồn kho.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {disposeDialog.batch && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Lô: {disposeDialog.batch.batchNumber || disposeDialog.batch.id}</p>
                <p className="text-sm text-muted-foreground">
                  Số lượng: {formatNumber(disposeDialog.batch.quantity)} | 
                  Giá trị: {formatCurrency(Number(disposeDialog.batch.quantity) * Number(disposeDialog.batch.unitCost))}
                </p>
                {disposeDialog.batch.expiryDate && (
                  <p className="text-sm text-red-600 mt-1">
                    HSD: {format(new Date(disposeDialog.batch.expiryDate), 'dd/MM/yyyy')}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Lý do hủy</label>
                <Textarea
                  value={disposeReason}
                  onChange={(e) => setDisposeReason(e.target.value)}
                  placeholder="VD: Hết hạn sử dụng, hư hỏng..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisposeReason('')}>Hủy bỏ</AlertDialogCancel>
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
    </>
  );
}