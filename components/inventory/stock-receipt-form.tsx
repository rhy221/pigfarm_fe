// =====================================================
// STOCK RECEIPT FORM COMPONENT
// =====================================================

'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2, Save, ArrowLeft, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useWarehouses, useProducts, useSuppliers, useCreateStockReceipt, useConfirmStockReceipt } from '@/hooks/use-inventory';
import { formatCurrency, cn } from '@/lib/utils';
import { ReceiptType } from '@/types/inventory';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';


// Form schema
const stockReceiptItemSchema = z.object({
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  productName: z.string().optional(),
  unitName: z.string().optional(),
  quantity: z.number().min(0.001, 'Số lượng phải lớn hơn 0'),
  unitPrice: z.number().min(0, 'Đơn giá không hợp lệ'),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  taxAmount: z.number().min(0).optional(),
  expiryDate: z.date().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

const stockReceiptFormSchema = z.object({
  warehouseId: z.string().min(1, 'Vui lòng chọn kho'),
  supplierId: z.string().optional(),
  receiptDate: z.date({ error: 'Vui lòng chọn ngày nhập' }),
  receiptType: z.nativeEnum(ReceiptType).optional(),
  discountAmount: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.date().optional(),
  notes: z.string().optional(),
  items: z.array(stockReceiptItemSchema).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
});

type StockReceiptFormValues = z.infer<typeof stockReceiptFormSchema>;

interface StockReceiptFormProps {
  // : string;
  receiptId?: string; // For edit mode
}

export default function StockReceiptForm({ receiptId }: StockReceiptFormProps) {
  const router = useRouter();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [createdReceiptId, setCreatedReceiptId] = useState<string | null>(null);

  const { data: warehouses } = useWarehouses();
  const { data: productsData } = useProducts( { limit: 1000 }); // Load all products for dropdown
  const products = productsData?.data;
  const { data: suppliers } = useSuppliers();

  const createReceipt = useCreateStockReceipt();
  const confirmReceipt = useConfirmStockReceipt();

  const form = useForm<StockReceiptFormValues>({
    resolver: zodResolver(stockReceiptFormSchema),
    defaultValues: {
      warehouseId: '',
      supplierId: '',
      receiptDate: new Date(),
      receiptType: ReceiptType.PURCHASE,
      discountAmount: 0,
      taxAmount: 0,
      shippingFee: 0,
      paidAmount: 0,
      invoiceNumber: '',
      notes: '',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Calculate totals
  const items = form.watch('items');
  const discountAmount = form.watch('discountAmount') || 0;
  const taxAmount = form.watch('taxAmount') || 0;
  const shippingFee = form.watch('shippingFee') || 0;
  const paidAmount = form.watch('paidAmount') || 0;

  const calculateItemTotal = (item: typeof items[0]) => {
    const subtotal = item.quantity * item.unitPrice;
    const discount = item.discountAmount || (subtotal * (item.discountPercent || 0)) / 100;
    const afterDiscount = subtotal - discount;
    const tax = item.taxAmount || (afterDiscount * (item.taxPercent || 0)) / 100;
    return afterDiscount + tax;
  };

  const totalAmount = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const finalAmount = totalAmount - discountAmount + taxAmount + shippingFee;
  const debtAmount = finalAmount - paidAmount;

  // Add product to list
  const handleAddProduct = () => {
    append({
      productId: '',
      productName: '',
      unitName: '',
      quantity: 1,
      unitPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      batchNumber: '',
      notes: '',
    });
  };

  // Handle product selection
  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.productName`, product.name);
      form.setValue(`items.${index}.unitName`, product.unit?.abbreviation || '');
      form.setValue(`items.${index}.unitPrice`, product.defaultPrice);
    }
  };

  // Submit form
  const onSubmit = async (data: StockReceiptFormValues) => {
    try {
      const result = await createReceipt.mutateAsync({
        
        warehouseId: data.warehouseId,
        supplierId: data.supplierId || undefined,
        receiptDate: format(data.receiptDate, 'yyyy-MM-dd'),
        receiptType: data.receiptType,
        discountAmount: data.discountAmount,
        taxAmount: data.taxAmount,
        shippingFee: data.shippingFee,
        paidAmount: data.paidAmount,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate ? format(data.invoiceDate, 'yyyy-MM-dd') : undefined,
        notes: data.notes,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          discountAmount: item.discountAmount,
          taxPercent: item.taxPercent,
          taxAmount: item.taxAmount,
          expiryDate: item.expiryDate ? format(item.expiryDate, 'yyyy-MM-dd') : undefined,
          batchNumber: item.batchNumber,
          notes: item.notes,
        })),
      });

      setCreatedReceiptId(result.id);

      toast('Thành công',{
        description: 'Đã tạo phiếu nhập kho. Bạn có muốn xác nhận ngay?',
      });

      setIsConfirmDialogOpen(true);
    } catch (error: any) {
      toast('Lỗi',{
        description: error.message || 'Không thể tạo phiếu nhập kho',
        //variant: 'destructive',
      });
    }
  };

  // Confirm receipt
  const handleConfirmReceipt = async () => {
    if (!createdReceiptId) return;

    try {
      await confirmReceipt.mutateAsync(createdReceiptId);
      toast('Thành công',{
        description: 'Đã xác nhận phiếu nhập kho và cập nhật tồn kho',
      });
      router.push('/inventory');
    } catch (error: any) {
      toast('Lỗi',{
        description: error.message || 'Không thể xác nhận phiếu',
        //variant: 'destructive',
      });
    }
    setIsConfirmDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Breadcrumb */}
        <PageBreadcrumb items={BREADCRUMB_CONFIGS.receiptNew} />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tạo phiếu nhập kho</h1>
              <p className="text-muted-foreground">Nhập hàng hóa, vật tư vào kho</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={createReceipt.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createReceipt.isPending ? 'Đang lưu...' : 'Lưu phiếu'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin phiếu nhập</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kho nhập *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn kho" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses?.map((wh) => (
                            <SelectItem key={wh.id} value={wh.id}>
                              {wh.name}
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
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà cung cấp</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn NCC" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=" ">-- Không chọn --</SelectItem>
                          {suppliers?.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
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
                  name="receiptDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày nhập *</FormLabel>
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
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số hóa đơn</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập số hóa đơn" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chi tiết sản phẩm</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddProduct}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Sản phẩm</TableHead>
                        <TableHead className="w-[100px]">Số lượng</TableHead>
                        <TableHead className="w-[120px]">Đơn giá</TableHead>
                        <TableHead className="w-[100px]">CK (%)</TableHead>
                        <TableHead className="w-[120px] text-right">Thành tiền</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const item = items[index];
                        const itemTotal = item ? calculateItemTotal(item) : 0;

                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Select
                                value={form.watch(`items.${index}.productId`)}
                                onValueChange={(value) => handleProductSelect(index, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn sản phẩm" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products?.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.code} - {p.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  step="0.001"
                                  min="0"
                                  {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                  className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {form.watch(`items.${index}.unitName`)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                                className="w-28"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                {...form.register(`items.${index}.discountPercent`, { valueAsNumber: true })}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(itemTotal)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
                {form.formState.errors.items && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.items.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Nhập ghi chú cho phiếu nhập..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tổng cộng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiền hàng:</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>

                <FormField
                  control={form.control}
                  name="discountAmount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-muted-foreground">Chiết khấu:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-32 text-right"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingFee"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-muted-foreground">Phí vận chuyển:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-32 text-right"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary">{formatCurrency(finalAmount)}</span>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Đã thanh toán:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="w-32 text-right"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Còn nợ:</span>
                  <span className={cn('font-medium', debtAmount > 0 && 'text-destructive')}>
                    {formatCurrency(debtAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Phiếu sẽ được lưu ở trạng thái nháp</p>
                  <p>• Xác nhận phiếu để cập nhật tồn kho</p>
                  <p>• Công nợ sẽ được ghi nhận khi xác nhận</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirm Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận phiếu nhập kho?</DialogTitle>
              <DialogDescription>
                Sau khi xác nhận, tồn kho sẽ được cập nhật và công nợ nhà cung cấp sẽ được ghi nhận.
                Bạn không thể sửa đổi phiếu sau khi xác nhận.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsConfirmDialogOpen(false);
                router.push('/inventory');
              }}>
                Để sau
              </Button>
              <Button onClick={handleConfirmReceipt} disabled={confirmReceipt.isPending}>
                <Check className="mr-2 h-4 w-4" />
                {confirmReceipt.isPending ? 'Đang xử lý...' : 'Xác nhận ngay'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}