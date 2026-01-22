// =====================================================
// SUPPLIER DEBTS PAGE - app/(dashboard)/finance/supplier-debts/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  CreditCard,
  Search,
  DollarSign,
  CalendarIcon,
  Building2,
  Phone,
  Mail,
  Banknote,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSuppliers } from '@/hooks/use-inventory';
import { useCashAccounts, useCreateSupplierPayment } from '@/hooks/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

// const  = 'demo-farm-id';

const paymentFormSchema = z.object({
  supplierId: z.string().min(1, 'Vui lòng chọn nhà cung cấp'),
  cashAccountId: z.string().min(1, 'Vui lòng chọn tài khoản'),
  paymentDate: z.date({ error: 'Vui lòng chọn ngày' }),
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0'),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function SupplierDebtsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const { data: suppliers, isLoading } = useSuppliers( searchTerm);
  const { data: accounts } = useCashAccounts();
  const createPayment = useCreateSupplierPayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      supplierId: '',
      cashAccountId: '',
      paymentDate: new Date(),
      amount: 0,
      description: '',
      notes: '',
    },
  });

  const suppliersWithDebt = suppliers?.filter((s) => s.totalDebt > 0) || [];
  const totalDebt = suppliers?.reduce((sum, s) => sum + (Number(s.totalDebt) || 0), 0) || 0;
  const openPaymentDialog = (supplier: any) => {
    setSelectedSupplier(supplier);
    form.reset({
      supplierId: supplier.id,
      cashAccountId: accounts?.find((a) => a.isDefault)?.id || '',
      paymentDate: new Date(),
      amount: Number(supplier.totalDebt) || 0,
      description: `Thanh toán công nợ - ${supplier.name}`,
      notes: '',
    });
    setIsPaymentDialogOpen(true);
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      await createPayment.mutateAsync({
        // farmId: 
        supplierId: data.supplierId,
        cashAccountId: data.cashAccountId,
        paymentDate: format(data.paymentDate, 'yyyy-MM-dd'),
        amount: data.amount,
        description: data.description,
        notes: data.notes,
      });
      toast('Thành công', {
        description: 'Đã ghi nhận thanh toán công nợ',
      });
      setIsPaymentDialogOpen(false);
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể thực hiện thanh toán',
        // variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* <PageBreadcrumb items={BREADCRUMB_CONFIGS.supplierDebts} /> */}
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Công nợ nhà cung cấp</h1>
          <p className="text-muted-foreground">Theo dõi và thanh toán công nợ với NCC</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {formatCurrency(totalDebt)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {suppliersWithDebt.length} nhà cung cấp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng NCC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suppliers?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Nhà cung cấp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Có công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {suppliersWithDebt.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">NCC cần thanh toán</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhà cung cấp</CardTitle>
          <CardDescription>
            Hiển thị {suppliers?.length || 0} nhà cung cấp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : suppliers?.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có nhà cung cấp nào</h3>
              <p className="text-muted-foreground">
                Thêm nhà cung cấp trong phần Quản lý Kho
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NCC</TableHead>
                    <TableHead>Tên nhà cung cấp</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead className="text-right">Công nợ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers?.map((supplier) => (
                    <TableRow key={supplier.id} className="group">
                      <TableCell className="font-mono">{supplier.code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          {supplier.address && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {supplier.address}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {supplier.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {supplier.phone}
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {supplier.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          'font-bold',
                          supplier.totalDebt > 0 ? 'text-orange-600' : 'text-green-600'
                        )}>
                          {formatCurrency(supplier.totalDebt || 0)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {supplier.totalDebt > 0 ? (
                          <Badge className="badge-warning">Còn nợ</Badge>
                        ) : (
                          <Badge className="badge-success">Đã TT hết</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.totalDebt > 0 && (
                          <Button
                            size="sm"
                            onClick={() => openPaymentDialog(supplier)}
                          >
                            <Banknote className="mr-1 h-4 w-4" />
                            Thanh toán
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thanh toán công nợ</DialogTitle>
            <DialogDescription>
              Thanh toán cho: <strong>{selectedSupplier?.name}</strong>
              <br />
              Công nợ hiện tại: <strong className="text-orange-600">
                {formatCurrency(selectedSupplier?.totalDebt || 0)}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cashAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tài khoản chi *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tài khoản" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts?.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ({formatCurrency(acc.currentBalance)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày thanh toán *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy', { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền thanh toán *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={selectedSupplier?.totalDebt || 0}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Tối đa: {formatCurrency(selectedSupplier?.totalDebt || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diễn giải</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nội dung thanh toán" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ghi chú thêm..." rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span>Công nợ hiện tại:</span>
                  <span className="font-medium">{formatCurrency(selectedSupplier?.totalDebt || 0)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Số tiền thanh toán:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(form.watch('amount') || 0)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Công nợ còn lại:</span>
                  <span className="text-orange-600">
                    {formatCurrency(Math.max(0, (selectedSupplier?.totalDebt || 0) - (form.watch('amount') || 0)))}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createPayment.isPending}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  {createPayment.isPending ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}