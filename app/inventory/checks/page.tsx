// =====================================================
// INVENTORY CHECK PAGE - Phiếu kiểm kê kho
// =====================================================

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ClipboardCheck,
  Plus,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { 
  useInventoryChecks, 
  useWarehouses,
  useCreateInventoryCheck,
  useConfirmInventoryCheck,
  useCancelInventoryCheck,
} from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { CheckStatus } from '@/types/inventory';
import { toast } from 'sonner';

// const  = 'demo-farm-id';

const statusConfig: Record<CheckStatus, { label: string; color: string; icon: any }> = {
  [CheckStatus.DRAFT]: { label: 'Nháp', color: 'bg-gray-500', icon: Clock },
  [CheckStatus.CONFIRMED]: { label: 'Đã duyệt', color: 'bg-green-500', icon: CheckCircle },
  [CheckStatus.CANCELLED]: { label: 'Đã hủy', color: 'bg-red-500', icon: XCircle },
};

export default function InventoryCheckPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // Form state
  const [formData, setFormData] = useState({
    warehouseId: '',
    checkDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: warehouses } = useWarehouses();
  const { data: checks, isLoading } = useInventoryChecks(
    
    selectedStatus !== 'all' ? selectedStatus : undefined
  );
  
  const createCheck = useCreateInventoryCheck();
  const confirmCheck = useConfirmInventoryCheck();
  const cancelCheck = useCancelInventoryCheck();

  const handleCreateCheck = async () => {
    if (!formData.warehouseId) {
      toast('Lỗi',{
        description: 'Vui lòng chọn kho', 
        // variant: 'destructive' 
    });
      return;
    }

    try {
      await createCheck.mutateAsync({
        // farmId: ,
        warehouseId: formData.warehouseId,
        checkDate: formData.checkDate,
        notes: formData.notes,
      });
      toast('Thành công',{ description: 'Đã tạo phiếu kiểm kê' });
      setCreateDialogOpen(false);
      setFormData({ warehouseId: '', checkDate: new Date().toISOString().split('T')[0], notes: '' });
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const handleConfirm = async () => {
    if (!confirmDialog.id) return;
    try {
      await confirmCheck.mutateAsync(confirmDialog.id);
      toast('Thành công',{ description: 'Đã xác nhận phiếu kiểm kê' });
      setConfirmDialog({ open: false, id: null });
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const handleCancel = async () => {
    if (!cancelDialog.id) return;
    try {
      await cancelCheck.mutateAsync(cancelDialog.id);
      toast('Thành công',{ description: 'Đã hủy phiếu kiểm kê' });
      setCancelDialog({ open: false, id: null });
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  // Summary stats
  const stats = {
    total: checks?.data?.length || 0,
    draft: checks?.data?.filter(c => c.status === CheckStatus.DRAFT).length || 0,
    confirmed: checks?.data?.filter(c => c.status === CheckStatus.CONFIRMED).length || 0,
  };

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb
        items={[
          { label: 'Quản lý Kho', href: '/inventory' },
          { label: 'Kiểm kê kho' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kiểm kê kho</h1>
          <p className="text-muted-foreground">
            Đối chiếu số lượng thực tế với sổ sách
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu kiểm kê
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng phiếu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tất cả kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kho</SelectItem>
                {warehouses?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="confirmed">Đã duyệt</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Danh sách phiếu kiểm kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã phiếu</TableHead>
                  <TableHead>Ngày kiểm kê</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead className="text-center">Số SP</TableHead>
                  <TableHead className="text-center">Chênh lệch</TableHead>
                  <TableHead className="text-right">Giá trị CL</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Người tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !checks?.data?.length ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Chưa có phiếu kiểm kê nào
                    </TableCell>
                  </TableRow>
                ) : (
                  checks.data.map((check) => {
                    const statusInfo = statusConfig[check.status];
                    const StatusIcon = statusInfo?.icon || Clock;
                    const hasDifference = (check.totalDifferenceValue || 0) !== 0;

                    return (
                      <TableRow key={check.id}>
                        <TableCell className="font-medium">{check.checkCode}</TableCell>
                        <TableCell>
                          {format(new Date(check.checkDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{check.warehouse?.name || '-'}</TableCell>
                        <TableCell className="text-center">{check.totalItems || 0}</TableCell>
                        <TableCell className="text-center">
                          {(check.itemsWithDifference || 0) > 0 ? (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {check.itemsWithDifference} SP
                            </Badge>
                          ) : (
                            <span className="text-green-600">Khớp</span>
                          )}
                        </TableCell>
                        <TableCell className={cn(
                          'text-right font-medium',
                          (check.totalDifferenceValue || 0) < 0 ? 'text-red-600' : 
                          (check.totalDifferenceValue || 0) > 0 ? 'text-green-600' : ''
                        )}>
                          {(check.totalDifferenceValue || 0) > 0 ? '+' : ''}
                          {formatCurrency(check.totalDifferenceValue || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-white', statusInfo?.color)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{check.creator?.fullName || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.location.href = `/inventory/checks/${check.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {check.status === CheckStatus.DRAFT && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => setConfirmDialog({ open: true, id: check.id })}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => setCancelDialog({ open: true, id: check.id })}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo phiếu kiểm kê mới</DialogTitle>
            <DialogDescription>
              Chọn kho và ngày kiểm kê để bắt đầu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Kho kiểm kê *</Label>
              <Select
                value={formData.warehouseId}
                onValueChange={(v) => setFormData({ ...formData, warehouseId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn kho" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngày kiểm kê *</Label>
              <Input
                type="date"
                value={formData.checkDate}
                onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú về phiếu kiểm kê..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCheck} disabled={createCheck.isPending}>
              {createCheck.isPending ? 'Đang tạo...' : 'Tạo phiếu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open, id: open ? confirmDialog.id : null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phiếu kiểm kê</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi xác nhận, hệ thống sẽ tự động điều chỉnh tồn kho theo số lượng thực tế.
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, id: open ? cancelDialog.id : null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu kiểm kê</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy phiếu kiểm kê này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
              Hủy phiếu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}