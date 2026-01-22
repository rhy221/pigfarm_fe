// =====================================================
// TRANSACTION DETAIL PAGE - app/finance/transactions/[id]/page.tsx
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
  Trash2,
  FileText,
  Wallet,
  Calendar,
  User,
  Tag,
  Printer,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { useTransaction, useDeleteTransaction } from '@/hooks/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import { TransactionType, ContactType } from '@/types/finance';
import { toast } from 'sonner';
import { useState } from 'react';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

const contactTypeLabels: Record<string, string> = {
  [ContactType.SUPPLIER]: 'Nhà cung cấp',
  [ContactType.CUSTOMER]: 'Khách hàng',
  [ContactType.EMPLOYEE]: 'Nhân viên',
  [ContactType.OTHER]: 'Khác',
};

export default function TransactionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: transaction, isLoading } = useTransaction(id);
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(id);
      toast('Thành công', {
        description: 'Đã xóa giao dịch',
      });
      router.push('/finance/transactions');
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xóa giao dịch',
      });
    }
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Không tìm thấy giao dịch</h3>
        <p className="text-muted-foreground mb-4">Giao dịch không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => router.push('/finance/transactions')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isIncome = transaction.transactionType === TransactionType.INCOME;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      {/* <PageBreadcrumb items={[
        ...BREADCRUMB_CONFIGS.transactions,
        { label: transaction.transactionCode, href: `/finance/transactions/${id}` }
      ]} /> */}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {isIncome ? (
                <ArrowUpCircle className="h-6 w-6 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-6 w-6 text-red-500" />
              )}
              <h1 className="text-2xl font-bold">{transaction.transactionCode}</h1>
              <Badge className={isIncome ? 'badge-success' : 'badge-danger'}>
                {isIncome ? 'Phiếu thu' : 'Phiếu chi'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Ngày giao dịch: {format(new Date(transaction.transactionDate), 'dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </Button> */}
          <Link href={`/finance/transactions/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <Card className={cn(
            'border-2',
            isIncome ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
          )}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Số tiền</p>
                <p className={cn(
                  'text-4xl font-bold',
                  isIncome ? 'text-green-600' : 'text-red-600'
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tài khoản</p>
                    <p className="font-medium">{transaction.cashAccounts?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Danh mục</p>
                    <p className="font-medium">{transaction.transactionCategories?.name || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày giao dịch</p>
                    <p className="font-medium">
                      {format(new Date(transaction.transactionDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đối tượng</p>
                    <p className="font-medium">
                      {transaction.contactName || '-'}
                      {transaction.contactType && (
                        <span className="text-sm text-muted-foreground ml-1">
                          ({contactTypeLabels[transaction.contactType] || transaction.contactType})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transaction.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Diễn giải</p>
                  <p>{transaction.description}</p>
                </div>
              )}
              {transaction.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                  <p>{transaction.notes}</p>
                </div>
              )}
              {!transaction.description && !transaction.notes && (
                <p className="text-muted-foreground">Không có mô tả</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hoạch toán:</span>
                <Badge variant={transaction.isRecorded ? 'default' : 'outline'}>
                  {transaction.isRecorded ? 'Có' : 'Không'}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại phiếu:</span>
                <span className={cn('font-medium', isIncome ? 'text-green-600' : 'text-red-600')}>
                  {isIncome ? 'Phiếu thu' : 'Phiếu chi'}
                </span>
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
                  <span>{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                </div>
                {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{format(new Date(transaction.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Info */}
          {transaction.referenceType && (
            <Card>
              <CardHeader>
                <CardTitle>Liên kết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại:</span>
                    <span>{transaction.referenceType}</span>
                  </div>
                  {transaction.referenceId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mã:</span>
                      <span className="font-mono">{transaction.referenceId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giao dịch?</AlertDialogTitle>
            <AlertDialogDescription>
              Giao dịch sẽ bị xóa vĩnh viễn. Số dư tài khoản sẽ được cập nhật lại.
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
