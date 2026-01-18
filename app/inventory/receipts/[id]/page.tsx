// =====================================================
// STOCK RECEIPT DETAIL PAGE - app/inventory/receipts/[id]/page.tsx
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
import { useStockReceipt, useConfirmStockReceipt, useCancelStockReceipt } from '@/hooks/use-inventory';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StockReceiptDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [confirmingAction, setConfirmingAction] = useState<'confirm' | 'cancel' | null>(null);

  const { data: receipt, isLoading } = useStockReceipt(id);
  const confirmReceipt = useConfirmStockReceipt();
  const cancelReceipt = useCancelStockReceipt();

  const handleConfirm = async () => {
    try {
      await confirmReceipt.mutateAsync(id);
      toast('Thành công', {
        description: 'Đã xác nhận phiếu nhập kho',
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
      await cancelReceipt.mutateAsync(id);
      toast('Thành công', {
        description: 'Đã hủy phiếu nhập kho',
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="badge-success">Đã thanh toán</Badge>;
      case 'partial':
        return <Badge className="badge-warning">Thanh toán một phần</Badge>;
      case 'unpaid':
        return <Badge className="badge-danger">Chưa thanh toán</Badge>;
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

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Không tìm thấy phiếu</h3>
        <p className="text-muted-foreground mb-4">Phiếu nhập kho không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => router.push('/inventory/receipts')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <PageBreadcrumb items={[
        ...BREADCRUMB_CONFIGS.receipts,
        { label: receipt.receiptCode, href: `/inventory/receipts/${id}` }
      ]} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{receipt.receiptCode}</h1>
              {getStatusBadge(receipt.status)}
            </div>
            <p className="text-muted-foreground">
              Ngày nhập: {format(new Date(receipt.receiptDate), 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </Button>
          {receipt.status === 'draft' && (
            <>
              <Link href={`/inventory/receipts/${id}/edit`}>
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
              <CardTitle>Thông tin phiếu nhập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kho nhập</p>
                    <p className="font-medium">{receipt.warehouses?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                    <p className="font-medium">{receipt.suppliers?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày nhập</p>
                    <p className="font-medium">
                      {format(new Date(receipt.receiptDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số hóa đơn</p>
                    <p className="font-medium">{receipt.invoiceNumber || '-'}</p>
                  </div>
                </div>
              </div>
              {receipt.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                    <p>{receipt.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sản phẩm</CardTitle>
              <CardDescription>
                {receipt.stockReceiptItems?.length || 0} sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Chiết khấu</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.stockReceiptItems?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.products?.name}</p>
                            <p className="text-sm text-muted-foreground">{item.products?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.products?.units?.abbreviation}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discountPercent ? `${item.discountPercent}%` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Tổng tiền hàng</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(receipt.totalAmount)}
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
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiền hàng:</span>
                <span className="font-medium">{formatCurrency(receipt.totalAmount)}</span>
              </div>
              {receipt.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chiết khấu:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(receipt.discountAmount)}
                  </span>
                </div>
              )}
              {receipt.shippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span className="font-medium">{formatCurrency(receipt.shippingFee)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">{formatCurrency(receipt.finalAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đã thanh toán:</span>
                <span className="font-medium">{formatCurrency(receipt.paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Còn nợ:</span>
                <span className="font-medium text-destructive">
                  {formatCurrency(receipt.finalAmount - receipt.paidAmount)}
                </span>
              </div>
              <div className="pt-2">
                {getPaymentStatusBadge(receipt.paymentStatus)}
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
                  <span>{format(new Date(receipt.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                </div>
                {/* {receipt.co && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày xác nhận:</span>
                    <span>{format(new Date(receipt.confirmedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmingAction === 'confirm'} onOpenChange={() => setConfirmingAction(null)}>
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
      <AlertDialog open={confirmingAction === 'cancel'} onOpenChange={() => setConfirmingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu nhập kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Phiếu nhập sẽ được chuyển sang trạng thái đã hủy. Bạn có chắc chắn muốn hủy?
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
