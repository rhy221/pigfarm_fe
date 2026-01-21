// =====================================================
// STOCK ISSUE DETAIL PAGE - app/inventory/issues/[id]/page.tsx
// =====================================================

'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ArrowLeft,
  Edit,
  Check,
  X,
  FileText,
  Building,
  Calendar,
  Package,
  Printer,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
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
import { useStockIssue, useConfirmStockIssue, useCancelStockIssue } from '@/hooks/use-inventory';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { IssueType } from '@/types/inventory';
import { toast } from 'sonner';
import { useState } from 'react';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

const issueTypeLabels: Record<string, string> = {
  [IssueType.USAGE]: 'Sử dụng cho đàn heo',
  [IssueType.SALE]: 'Bán hàng',
  [IssueType.TRANSFER]: 'Chuyển kho',
  [IssueType.DISPOSAL]: 'Hủy bỏ',
  [IssueType.RETURN]: 'Trả hàng NCC',
};

export default function StockIssueDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [confirmingAction, setConfirmingAction] = useState<'confirm' | 'cancel' | null>(null);

  const { data: issue, isLoading } = useStockIssue(id);
  const confirmIssue = useConfirmStockIssue();
  const cancelIssue = useCancelStockIssue();

  const handleConfirm = async () => {
    try {
      await confirmIssue.mutateAsync(id);
      toast('Thành công', {
        description: 'Đã xác nhận phiếu xuất kho',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xác nhận phiếu',
      });
    }
    setConfirmingAction(null);
  };

  const handleCancel = async () => {
    try {
      await cancelIssue.mutateAsync(id);
      toast('Thành công', {
        description: 'Đã hủy phiếu xuất kho',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể hủy phiếu',
      });
    }
    setConfirmingAction(null);
  };

  const getStatusBadge = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Không tìm thấy phiếu</h3>
        <p className="text-muted-foreground mb-4">Phiếu xuất kho không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => router.push('/inventory/issues')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const totalAmount = issue.stockIssueItems?.reduce(
    (sum: number, item: any) => sum + Number(item.quantity) * Number(item.unitCost || 0),
    0
  ) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <PageBreadcrumb items={[
        ...BREADCRUMB_CONFIGS.issues,
        { label: issue.issueCode, href: `/inventory/issues/${id}` }
      ]} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{issue.issueCode}</h1>
              {getStatusBadge(issue.status)}
            </div>
            <p className="text-muted-foreground">
              Ngày xuất: {format(new Date(issue.issueDate), 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </Button> */}
          {issue.status === 'draft' && (
            <>
              <Link href={`/inventory/issues/${id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => setConfirmingAction('cancel')}
              >
                <X className="mr-2 h-4 w-4" />
                Hủy phiếu
              </Button>
              <Button onClick={() => setConfirmingAction('confirm')}>
                <Check className="mr-2 h-4 w-4" />
                Xác nhận
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phiếu xuất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kho xuất</p>
                    <p className="font-medium">{issue.warehouses?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại xuất</p>
                    <p className="font-medium">
                      {issueTypeLabels[issue.issueType] || issue.issueType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày xuất</p>
                    <p className="font-medium">
                      {format(new Date(issue.issueDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mục đích / Lý do</p>
                    <p className="font-medium">{issue.purpose || '-'}</p>
                  </div>
                </div>
              </div>
              {issue.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                    <p>{issue.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sản phẩm xuất</CardTitle>
              <CardDescription>
                {issue.stockIssueItems?.length || 0} sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Lô hàng</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá (vốn)</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issue.stockIssueItems?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.products?.name}</p>
                            <p className="text-sm text-muted-foreground">{item.products?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.inventoryBatches?.batchNumber || item.batchId ? (
                            <div>
                              <p className="font-medium">{item.inventoryBatches?.batchNumber || 'Lô mặc định'}</p>
                              {item.inventoryBatches?.expiryDate && (
                                <p className="text-xs text-muted-foreground">
                                  HSD: {format(new Date(item.inventoryBatches.expiryDate), 'dd/MM/yyyy', { locale: vi })}
                                </p>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.quantity)} {item.products?.units?.abbreviation}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitCost || 0)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(item.quantity) * Number(item.unitCost || 0))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Tổng giá trị xuất</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng cộng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số dòng:</span>
                <span className="font-medium">{issue.stockIssueItems?.length || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng giá trị:</span>
                <span className="text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span>{format(new Date(issue.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                </div>
                {/* {issue.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày xác nhận:</span>
                    <span>{format(new Date(issue.confirmedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Giá trị xuất tính theo giá vốn trung bình</p>
                <p>• Tồn kho sẽ được trừ sau khi xác nhận</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmingAction === 'confirm'} onOpenChange={() => setConfirmingAction(null)}>
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

      {/* Cancel Dialog */}
      <AlertDialog open={confirmingAction === 'cancel'} onOpenChange={() => setConfirmingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu xuất kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu xuất sẽ được chuyển sang trạng thái đã hủy. Bạn có chắc chắn muốn hủy?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hủy phiếu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
