// =====================================================
// EDIT STOCK RECEIPT PAGE - app/inventory/receipts/[id]/edit/page.tsx
// =====================================================

'use client';

import { use, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

import {
  useStockReceipt,
  useWarehouses,
  useProducts,
  useSuppliers,
  useUpdateStockReceipt,
} from '@/hooks/use-inventory';
import { formatCurrency, cn } from '@/lib/utils';
import { ReceiptType } from '@/types/inventory';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

// Form schema
const stockReceiptItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  productName: z.string().optional(),
  unitName: z.string().optional(),
  quantity: z.number().min(0.001, 'Số lượng phải lớn hơn 0'),
  unitPrice: z.number().min(0, 'Đơn giá không hợp lệ'),
  discountPercent: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  taxAmount: z.number().min(0).optional(),
  expiryDate: z.date().optional().nullable(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

const stockReceiptFormSchema = z.object({
  warehouseId: z.string().min(1, 'Vui lòng chọn kho'),
  supplierId: z.string().optional(),
  receiptDate: z.date({ error: 'Vui lòng chọn ngày nhập' }),
  receiptType: z.enum(ReceiptType).optional(),
  discountAmount: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
  shippingFee: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.date().optional().nullable(),
  notes: z.string().optional(),
  items: z.array(stockReceiptItemSchema).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
});

type StockReceiptFormValues = z.infer<typeof stockReceiptFormSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditStockReceiptPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: receipt, isLoading: isLoadingReceipt } = useStockReceipt(id);
  const { data: warehouses } = useWarehouses();
  const { data: productsData } = useProducts({ limit: 1000 });
  const products = productsData?.data;
  const { data: suppliers } = useSuppliers();

  const updateReceipt = useUpdateStockReceipt();

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

  // Load receipt data into form
  useEffect(() => {
    if (receipt) {
      form.reset({
        warehouseId: receipt.warehouseId,
        supplierId: receipt.supplierId || '',
        receiptDate: new Date(receipt.receiptDate),
        receiptType: receipt.receiptType as ReceiptType,
        discountAmount: Number(receipt.discountAmount) || 0,
        taxAmount: Number(receipt.taxAmount) || 0,
        shippingFee: Number(receipt.shippingFee) || 0,
        paidAmount: Number(receipt.paidAmount) || 0,
        invoiceNumber: receipt.invoiceNumber || '',
        invoiceDate: receipt.invoiceDate ? new Date(receipt.invoiceDate) : null,
        notes: receipt.notes || '',
        items: receipt.stockReceiptItems?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.products?.name || '',
          unitName: item.products?.units?.abbreviation || '',
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          discountPercent: Number(item.discountPercent) || 0,
          discountAmount: Number(item.discountAmount) || 0,
          taxPercent: Number(item.taxPercent) || 0,
          taxAmount: Number(item.taxAmount) || 0,
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          batchNumber: item.batchNumber || '',
          notes: item.notes || '',
        })) || [],
      });
    }
  }, [receipt, warehouses, suppliers, form]);

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
      form.setValue(`items.${index}.unitName`, product.units?.abbreviation || '');
      form.setValue(`items.${index}.unitPrice`, product.defaultPrice);
    }
  };
const errors = form.formState.errors;

useEffect(() => {
  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
  }
}, [errors]);
  // Submit form
  const onSubmit = async (data: StockReceiptFormValues) => {
    try {
      await updateReceipt.mutateAsync({
        id,
        data: {
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
            id: item.id,
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
        },
      });

      toast('Thành công', {
        description: 'Đã cập nhật phiếu nhập kho',
      });

      router.push(`/inventory/receipts/${id}`);
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể cập nhật phiếu nhập kho',
      });
    }
  };

  if (isLoadingReceipt) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">Không tìm thấy phiếu</h3>
        <Button onClick={() => router.push('/inventory/receipts')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (receipt.status !== 'draft') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">Không thể chỉnh sửa</h3>
        <p className="text-muted-foreground mb-4">
          Phiếu đã được xác nhận hoặc đã hủy, không thể chỉnh sửa
        </p>
        <Button onClick={() => router.push(`/inventory/receipts/${id}`)}>
          Xem chi tiết
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Breadcrumb */}
        {/* <PageBreadcrumb items={[
          ...BREADCRUMB_CONFIGS.receipts,
          { label: receipt.receiptCode, href: `/inventory/receipts/${id}` },
          { label: 'Chỉnh sửa', href: `/inventory/receipts/${id}/edit` }
        ]} /> */}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Chỉnh sửa phiếu nhập</h1>
              <p className="text-muted-foreground">{receipt.receiptCode}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateReceipt.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateReceipt.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
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
                        <TableHead className="w-[200px]">Sản phẩm</TableHead>
                        <TableHead className="w-[80px]">Số lượng</TableHead>
                        <TableHead className="w-[100px]">Đơn giá</TableHead>
                        <TableHead className="w-[70px]">CK (%)</TableHead>
                        <TableHead className="w-[120px]">Hạn sử dụng</TableHead>
                        <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
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
                            <TableCell>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                      'w-[120px] pl-3 text-left font-normal text-xs',
                                      !form.watch(`items.${index}.expiryDate`) && 'text-muted-foreground'
                                    )}
                                  >
                                    {form.watch(`items.${index}.expiryDate`) ? (
                                      format(form.watch(`items.${index}.expiryDate`)!, 'dd/MM/yyyy')
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={form.watch(`items.${index}.expiryDate`) || undefined}
                                    onSelect={(date) => form.setValue(`items.${index}.expiryDate`, date)}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
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
          </div>
        </div>
      </form>
    </Form>
  );
}
