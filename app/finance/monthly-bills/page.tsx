// =====================================================
// MONTHLY BILLS PAGE - Hóa đơn định kỳ
// =====================================================

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Receipt,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  useMonthlyBills,
  useMonthlyBillRecords,
  useCreateMonthlyBill,
  useUpdateMonthlyBill,
  useDeleteMonthlyBill,
  usePayMonthlyBill,
  useMonthlyBillSummary,
  useTransactionCategories,
  useCashAccounts,
} from '@/hooks/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import { BillStatus, TransactionType } from '@/types/finance';
import { toast } from 'sonner';

// const  = 'demo-farm-id';

const statusConfig: Record<BillStatus, { label: string; color: string; icon: any }> = {
  [BillStatus.PENDING]: { label: 'Chưa thanh toán', color: 'bg-yellow-500', icon: Clock },
  [BillStatus.PAID]: { label: 'Đã thanh toán', color: 'bg-green-500', icon: CheckCircle },
  [BillStatus.OVERDUE]: { label: 'Quá hạn', color: 'bg-red-500', icon: AlertTriangle },
};

export default function MonthlyBillsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [selectedBill, setSelectedBill] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    defaultAmount: '',
    dueDay: '',
    description: '',
  });

  const [payFormData, setPayFormData] = useState({
    amount: '',
    cashAccountId: '',
    paidDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: bills, isLoading } = useMonthlyBills();
  const { data: records } = useMonthlyBillRecords({
    // farmId: ,
    month: selectedMonth,
    year: selectedYear,
  });
  const { data: summary } = useMonthlyBillSummary(selectedMonth, selectedYear);
  const { data: categories } = useTransactionCategories();
  const { data: accounts } = useCashAccounts();

  const createBill = useCreateMonthlyBill();
  const updateBill = useUpdateMonthlyBill();
  const deleteBill = useDeleteMonthlyBill();
  const payBill = usePayMonthlyBill();

  const expenseCategories = categories?.filter(c => c.type === TransactionType.EXPENSE) || [];

  const handleCreate = async () => {
    if (!formData.name || !formData.defaultAmount) {
      toast( 'Lỗi',{ description: 'Vui lòng nhập đủ thông tin', 
        // variant: 'destructive' 
    });
      return;
    }
    try {
      await createBill.mutateAsync({
        // farmId: ,
        name: formData.name,
        categoryId: formData.categoryId || undefined,
        defaultAmount: parseFloat(formData.defaultAmount),
        dueDay: formData.dueDay ? parseInt(formData.dueDay) : undefined,
        description: formData.description || undefined,
      });
      toast('Thành công',{  description: 'Đã tạo hóa đơn định kỳ' });
      setCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast('Lỗi',{   description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const handleUpdate = async () => {
    if (!selectedBill) return;
    try {
      await updateBill.mutateAsync({
        id: selectedBill.id,
        data: {
          name: formData.name,
          categoryId: formData.categoryId || undefined,
          defaultAmount: parseFloat(formData.defaultAmount),
          dueDay: formData.dueDay ? parseInt(formData.dueDay) : undefined,
          description: formData.description || undefined,
        },
      });
      toast('Thành công',{ description: 'Đã cập nhật hóa đơn' });
      setEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast('Lỗi',{ description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await deleteBill.mutateAsync(deleteDialog.id);
      toast('Thành công',{ description: 'Đã xóa hóa đơn' });
      setDeleteDialog({ open: false, id: null });
    } catch (error: any) {
      toast('Lỗi' ,{ description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const handlePay = async () => {
    if (!selectedBill || !payFormData.cashAccountId || !payFormData.amount) {
      toast('Lỗi', { description: 'Vui lòng nhập đủ thông tin', 
        // variant: 'destructive' 
    });
      return;
    }
    try {
      await payBill.mutateAsync({
        billId: selectedBill.id,
        periodMonth: selectedMonth,
        periodYear: selectedYear,
        amount: parseFloat(payFormData.amount),
        cashAccountId: payFormData.cashAccountId,
        paidDate: payFormData.paidDate,
        notes: payFormData.notes || undefined,
      });
      toast('Thành công', { description: 'Đã thanh toán hóa đơn' });
      setPayDialogOpen(false);
      resetPayForm();
    } catch (error: any) {
      toast('Lỗi', { description: error.message, 
        // variant: 'destructive' 
    });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', categoryId: '', defaultAmount: '', dueDay: '', description: '' });
    setSelectedBill(null);
  };

  const resetPayForm = () => {
    setPayFormData({ amount: '', cashAccountId: '', paidDate: new Date().toISOString().split('T')[0], notes: '' });
    setSelectedBill(null);
  };

  const openEditDialog = (bill: any) => {
    setSelectedBill(bill);
    setFormData({
      name: bill.name,
      categoryId: bill.categoryId || '',
      defaultAmount: bill.defaultAmount.toString(),
      dueDay: bill.dueDay?.toString() || '',
      description: bill.description || '',
    });
    setEditDialogOpen(true);
  };

  const openPayDialog = (bill: any) => {
    setSelectedBill(bill);
    setPayFormData({
      amount: bill.defaultAmount.toString(),
      cashAccountId: '',
      paidDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setPayDialogOpen(true);
  };

  // Get bill status for current month
  const getBillStatus = (billId: string): BillStatus => {
    const record = records?.find(r => r.billId === billId);
    return record?.status || BillStatus.PENDING;
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb
        items={[
          { label: 'Quản lý Chi phí', href: '/finance' },
          { label: 'Hóa đơn định kỳ' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hóa đơn định kỳ</h1>
          <p className="text-muted-foreground">
            Quản lý các chi phí cố định hàng tháng
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hóa đơn
        </Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Kỳ:</span>
            </div>
            <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalBills || bills?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary?.totalAmount || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.paidCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary?.paidAmount || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary?.pendingCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary?.pendingAmount || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.overdueCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Danh sách hóa đơn tháng {selectedMonth}/{selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên hóa đơn</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-center">Ngày đến hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày TT</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !bills?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chưa có hóa đơn định kỳ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  bills.map((bill) => {
                    const record = records?.find(r => r.billId === bill.id);
                    const status = record?.status || BillStatus.PENDING;
                    const statusInfo = statusConfig[status];
                    const StatusIcon = statusInfo?.icon || Clock;

                    return (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bill.name}</p>
                            {bill.description && (
                              <p className="text-xs text-muted-foreground">{bill.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{bill.transactionCategories?.name || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(record?.amount || bill.defaultAmount)}
                        </TableCell>
                        <TableCell className="text-center">
                          {bill.dueDay ? `Ngày ${bill.dueDay}` : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-white', statusInfo?.color)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record?.paidDate 
                            ? format(new Date(record.paidDate), 'dd/MM/yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {status === BillStatus.PENDING && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => openPayDialog(bill)}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(bill)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setDeleteDialog({ open: true, id: bill.id })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDialogOpen ? 'Sửa hóa đơn' : 'Thêm hóa đơn định kỳ'}</DialogTitle>
            <DialogDescription>
              {editDialogOpen ? 'Cập nhật thông tin hóa đơn' : 'Tạo hóa đơn chi phí cố định hàng tháng'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên hóa đơn *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Tiền điện, Tiền nước..."
              />
            </div>
            <div className="space-y-2">
              <Label>Danh mục chi</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số tiền mặc định *</Label>
                <Input
                  type="number"
                  value={formData.defaultAmount}
                  onChange={(e) => setFormData({ ...formData, defaultAmount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày đến hạn</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                  placeholder="1-31"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateDialogOpen(false);
              setEditDialogOpen(false);
              resetForm();
            }}>
              Hủy
            </Button>
            <Button 
              onClick={editDialogOpen ? handleUpdate : handleCreate}
              disabled={createBill.isPending || updateBill.isPending}
            >
              {createBill.isPending || updateBill.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setPayDialogOpen(false);
          resetPayForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thanh toán hóa đơn</DialogTitle>
            <DialogDescription>
              {selectedBill?.name} - Tháng {selectedMonth}/{selectedYear}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Số tiền thanh toán *</Label>
              <Input
                type="number"
                value={payFormData.amount}
                onChange={(e) => setPayFormData({ ...payFormData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tài khoản thanh toán *</Label>
              <Select
                value={payFormData.cashAccountId}
                onValueChange={(v) => setPayFormData({ ...payFormData, cashAccountId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.currentBalance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngày thanh toán</Label>
              <Input
                type="date"
                value={payFormData.paidDate}
                onChange={(e) => setPayFormData({ ...payFormData, paidDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={payFormData.notes}
                onChange={(e) => setPayFormData({ ...payFormData, notes: e.target.value })}
                placeholder="Ghi chú..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPayDialogOpen(false);
              resetPayForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handlePay} disabled={payBill.isPending}>
              {payBill.isPending ? 'Đang xử lý...' : 'Thanh toán'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: open ? deleteDialog.id : null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa hóa đơn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hóa đơn này? Lịch sử thanh toán sẽ không bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}