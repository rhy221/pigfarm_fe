// =====================================================
// EDIT STOCK ISSUE PAGE - app/inventory/issues/[id]/edit/page.tsx
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
  useStockIssue,
  useWarehouses,
  useInventory,
  useUpdateStockReceipt,
  useInventoryBatches,
} from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { IssueType } from '@/types/inventory';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';
import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Component để chọn batch cho từng item
function BatchSelectCell({
  inventoryId,
  value,
  onChange,
  disabled,
}: {
  inventoryId: string;
  value: string;
  onChange: (batchId: string) => void;
  disabled?: boolean;
}) {
  const { data: batches, isLoading } = useInventoryBatches(inventoryId, { includeAll: false });

  if (disabled || !inventoryId) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Chọn SP trước" />
        </SelectTrigger>
      </Select>
    );
  }

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Đang tải..." />
        </SelectTrigger>
      </Select>
    );
  }

  const activeBatches = batches?.filter((b) => b.status === 'active' && b.quantity > 0) || [];
  // console.log(value ? value : "undefine");
  // console.log(activeBatches);
  return (
    <Select value={value === "" || !value ? "none" : value}
  onValueChange={(val) => {
    // Khi người dùng chọn "none", ta trả về chuỗi rỗng cho Form
    onChange(val === "none" ? "" : val);
  }}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Chọn lô" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">-- Không chọn --</SelectItem>
        {activeBatches.map((batch) => (
          <SelectItem key={batch.id} value={batch.id}>
            {batch.batchNumber || 'Lô mặc định'} ({formatNumber(batch.quantity)})
            {batch.expiryDate && (
              <span className="text-xs text-muted-foreground ml-1">
                - HSD: {format(new Date(batch.expiryDate), 'dd/MM/yy')}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const stockIssueFormSchema = z.object({
  warehouseId: z.string().min(1, 'Vui lòng chọn kho'),
  issueDate: z.date({ error: 'Vui lòng chọn ngày xuất' }),
  issueType: z.enum(IssueType),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(),
    productId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
    productName: z.string().optional(),
    unitName: z.string().optional(),
    inventoryId: z.string().optional(),
    availableQty: z.number().nullable().optional(),
    unitCost: z.number().nullable().optional(),
    quantity: z.number().min(0.001, 'Số lượng phải lớn hơn 0'),
    batchId: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
});

type StockIssueFormValues = z.infer<typeof stockIssueFormSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

const issueTypeOptions = [
  { value: IssueType.USAGE, label: 'Sử dụng cho đàn heo' },
  { value: IssueType.SALE, label: 'Bán hàng' },
  { value: IssueType.TRANSFER, label: 'Chuyển kho' },
  { value: IssueType.DISPOSAL, label: 'Hủy bỏ (hư hỏng, hết hạn)' },
  { value: IssueType.RETURN, label: 'Trả hàng NCC' },
];

export default function EditStockIssuePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: issue, isLoading: isLoadingIssue } = useStockIssue(id);
  const { data: warehouses } = useWarehouses();

  const form = useForm<StockIssueFormValues>({
    resolver: zodResolver(stockIssueFormSchema),
    defaultValues: {
      warehouseId: '',
      issueDate: new Date(),
      issueType: IssueType.USAGE,
      purpose: '',
      notes: '',
      items: [],
    },
  });

  const selectedWarehouseId = form.watch('warehouseId');
  const { data: inventoryData } = useInventory({
    warehouseId: selectedWarehouseId || undefined,
    limit: 1000,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Custom update mutation for stock issue
  const updateIssue = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.put(`/api/inventory/issues/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  // Load issue data into form
  useEffect(() => {
    if (issue && inventoryData?.data) {
      form.reset({
        warehouseId: issue.warehouseId,
        issueDate: new Date(issue.issueDate),
        issueType: issue.issueType as IssueType,
        purpose: issue.purpose || '',
        notes: issue.notes || '',
        items: issue.stockIssueItems?.map((item: any) => {
          // Find inventoryId from inventoryData
          const inv = inventoryData.data?.find((i) => i.productId === item.productId);
          return {
            id: item.id,
            productId: item.productId,
            productName: item.products?.name || '',
            unitName: item.products?.units?.abbreviation || '',
            inventoryId: inv?.id || '',
            availableQty: Number(item.quantity), // Current qty in this issue
            unitCost: Number(item.unitCost) || 0,
            quantity: Number(item.quantity),
            batchId: item.batchId || '',
            notes: item.notes || '',
          };
        }) || [],
      });
    }
  }, [issue, inventoryData, form]);

  const items = form.watch('items');

  const calculateItemTotal = (item: typeof items[0]) => {
    return (item.quantity || 0) * (item.unitCost || 0);
  };

  const totalAmount = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleAddProduct = () => {
    append({
      productId: '',
      productName: '',
      unitName: '',
      inventoryId: '',
      availableQty: 0,
      unitCost: 0,
      quantity: 1,
      batchId: '',
      notes: '',
    });
  };

  const handleProductSelect = (index: number, productId: string) => {
    const inventoryItem = inventoryData?.data?.find((inv) => inv.productId === productId);
    if (inventoryItem) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.productName`, inventoryItem.products?.name || '');
      form.setValue(`items.${index}.unitName`, inventoryItem.products?.units?.abbreviation || '');
      form.setValue(`items.${index}.inventoryId`, inventoryItem.id);
      form.setValue(`items.${index}.availableQty`, Number(inventoryItem.quantity) ?? 0);
      form.setValue(`items.${index}.unitCost`, Number(inventoryItem.avgCost) ?? 0);
      form.setValue(`items.${index}.batchId`, ''); // Reset batch when product changes
    }
  };

  const onSubmit = async (data: StockIssueFormValues) => {
    // Validate quantities
    for (const item of data.items) {
      if (!item.id && item.quantity > (item.availableQty || 0)) {
        toast('Lỗi', {
          description: `Sản phẩm "${item.productName}" không đủ tồn kho (còn ${item.availableQty})`,
        });
        return;
      }
    }

    try {
      await updateIssue.mutateAsync({
        id,
        data: {
          warehouseId: data.warehouseId,
          issueDate: format(data.issueDate, 'yyyy-MM-dd'),
          issueType: data.issueType,
          purpose: data.purpose,
          notes: data.notes,
          items: data.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            batchId: item.batchId || undefined,
            notes: item.notes,
          })),
        },
      });

      toast('Thành công', {
        description: 'Đã cập nhật phiếu xuất kho',
      });

      router.push(`/inventory/issues/${id}`);
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể cập nhật phiếu xuất kho',
      });
    }
  };

  if (isLoadingIssue) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">Không tìm thấy phiếu</h3>
        <Button onClick={() => router.push('/inventory/issues')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (issue.status !== 'draft') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-medium mb-2">Không thể chỉnh sửa</h3>
        <p className="text-muted-foreground mb-4">
          Phiếu đã được xác nhận hoặc đã hủy, không thể chỉnh sửa
        </p>
        <Button onClick={() => router.push(`/inventory/issues/${id}`)}>
          Xem chi tiết
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <PageBreadcrumb items={[
          ...BREADCRUMB_CONFIGS.issues,
          { label: issue.issueCode, href: `/inventory/issues/${id}` },
          { label: 'Chỉnh sửa', href: `/inventory/issues/${id}/edit` }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Chỉnh sửa phiếu xuất</h1>
              <p className="text-muted-foreground">{issue.issueCode}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateIssue.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateIssue.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin phiếu xuất</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kho xuất *</FormLabel>
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
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày xuất *</FormLabel>
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
                              {field.value ? format(field.value, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
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
                  name="issueType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại xuất *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại xuất" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {issueTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mục đích / Lý do</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="VD: Cho đàn heo F1, chuồng A..." />
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
                  <CardTitle>Chi tiết sản phẩm xuất</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddProduct}
                    disabled={!selectedWarehouseId}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedWarehouseId ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Vui lòng chọn kho xuất trước
                  </div>
                ) : fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Sản phẩm</TableHead>
                        <TableHead className="w-[150px]">Lô hàng</TableHead>
                        <TableHead className="w-[80px] text-right">Tồn kho</TableHead>
                        <TableHead className="w-[80px]">Số lượng</TableHead>
                        <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                        <TableHead className="w-[100px] text-right">Thành tiền</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => {
                        const item = items[index];
                        const itemTotal = item ? calculateItemTotal(item) : 0;
                        const isOverStock = item && !item.id && item.quantity > (item.availableQty || 0);
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
                                  {inventoryData?.data?.filter((inv) => inv.quantity > 0).map((inv) => (
                                    <SelectItem key={inv.productId} value={inv.productId}>
                                      {inv.products?.code} - {inv.products?.name} ({formatNumber(inv.quantity)})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <BatchSelectCell
                                inventoryId={item?.inventoryId || ''}
                                value={form.watch(`items.${index}.batchId`) || ''}
                                onChange={(batchId) => form.setValue(`items.${index}.batchId`, batchId)}
                                disabled={!item?.inventoryId}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(form.watch(`items.${index}.batchId`) ? issue?.stockIssueItems?.[index]?.inventoryBatches?.quantity || 0 : item?.availableQty || 0)}{' '}
                              <span className="text-xs text-muted-foreground">{item?.unitName}</span>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                className={cn('w-24', isOverStock && 'border-red-500')}
                              />
                              {isOverStock && (
                                <p className="text-xs text-red-500 mt-1">Vượt tồn!</p>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item?.unitCost || 0)}
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
                        <Textarea {...field} placeholder="Nhập ghi chú cho phiếu xuất..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <span className="font-medium">{items.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng giá trị:</span>
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
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
      </form>
    </Form>
  );
}
