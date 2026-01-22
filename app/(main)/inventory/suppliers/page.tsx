// =====================================================
// SUPPLIERS PAGE - app/(dashboard)/inventory/suppliers/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Phone,
  Mail,
  MapPin,
  FileDown,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useSuppliers, useCreateSupplier, useUpdateSupplier } from '@/hooks/use-inventory';
import { formatCurrency, cn } from '@/lib/utils';
import { Supplier } from '@/types/inventory';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

const FARM_ID = 'demo-farm-id';

const supplierFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên NCC'),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data: suppliers, isLoading } = useSuppliers( searchTerm);
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
      bankAccount: '',
      bankName: '',
      notes: '',
    },
  });

  const openCreateDialog = () => {
    form.reset({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
      bankAccount: '',
      bankName: '',
      notes: '',
    });
    setEditingSupplier(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (supplier: Supplier) => {
    form.reset({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      taxCode: supplier.taxCode || '',
      bankAccount: supplier.bankAccount || '',
      bankName: supplier.bankName || '',
      notes: supplier.notes || '',
    });
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          data: { ...data},
        });
        toast('Thành công', { description: 'Đã cập nhật nhà cung cấp' });
      } else {
        await createSupplier.mutateAsync({ ...data});
        toast('Thành công', { description: 'Đã tạo nhà cung cấp mới' });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast('Lỗi',{
        description: error.message || 'Không thể lưu nhà cung cấp',
        // variant: 'destructive',
      });
    }
  };

  const totalDebt = suppliers?.reduce((sum, s) => sum + (Number(s.totalDebt) || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        {/* <PageBreadcrumb items={BREADCRUMB_CONFIGS.suppliers} /> */}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhà cung cấp</h1>
          <p className="text-muted-foreground">Quản lý danh sách nhà cung cấp</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button> */}
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm NCC
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng NCC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suppliers?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">NCC có công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {suppliers?.filter((s) => s.totalDebt > 0).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {formatCurrency(totalDebt)}
            </div>
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

      {/* Suppliers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : suppliers?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có nhà cung cấp nào</h3>
            <p className="text-muted-foreground mb-4">Thêm nhà cung cấp để quản lý mua hàng</p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhà cung cấp
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers?.map((supplier) => (
            <Card key={supplier.id} className="card-hover group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription className="font-mono">{supplier.code}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(supplier)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplier.contactPerson && (
                  <p className="text-sm font-medium">{supplier.contactPerson}</p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Công nợ:</span>
                  <span className={cn(
                    'font-bold',
                    supplier.totalDebt > 0 ? 'text-orange-600' : 'text-green-600'
                  )}>
                    {formatCurrency(supplier.totalDebt || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Cập nhật thông tin NCC' : 'Tạo nhà cung cấp mới'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhà cung cấp *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Công ty TNHH ABC" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người liên hệ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tên người liên hệ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0901234567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="email@company.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Địa chỉ nhà cung cấp" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã số thuế</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MST" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngân hàng</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tên ngân hàng" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tài khoản</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Số tài khoản ngân hàng" />
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createSupplier.isPending || updateSupplier.isPending}>
                  {(createSupplier.isPending || updateSupplier.isPending) ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}