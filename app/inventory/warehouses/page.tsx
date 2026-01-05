// =====================================================
// WAREHOUSES PAGE - app/(dashboard)/inventory/warehouses/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  WarehouseIcon,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  MapPin,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/hooks/use-inventory';
import { formatCurrency, cn } from '@/lib/utils';
import { WarehouseType, Warehouse } from '@/types/inventory';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

const FARM_ID = 'demo-farm-id';

const warehouseFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên kho'),
  location: z.string().optional(),
  warehouseType: z.enum(WarehouseType),
  description: z.string().optional(),
  isDefault: z.boolean(),
});

type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

export default function WarehousesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: warehouses, isLoading } = useWarehouses(FARM_ID);
  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();
  const deleteWarehouse = useDeleteWarehouse();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: '',
      location: '',
      warehouseType: WarehouseType.MAIN,
      description: '',
      isDefault: false,
    },
  });

  const openCreateDialog = () => {
    form.reset({
      name: '',
      location: '',
      warehouseType: WarehouseType.MAIN,
      description: '',
      isDefault: false,
    });
    setEditingWarehouse(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (warehouse: Warehouse) => {
    form.reset({
      name: warehouse.name,
      location: warehouse.location || '',
      warehouseType: warehouse.warehouseType || WarehouseType.MAIN,
      description: warehouse.description || '',
      isDefault: warehouse.isDefault,
    });
    setEditingWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: WarehouseFormValues) => {
    try {
      if (editingWarehouse) {
        await updateWarehouse.mutateAsync({
          id: editingWarehouse.id,
          data: { ...data, farmId: FARM_ID },
        });
        toast('Thành công',{ description: 'Đã cập nhật kho' });
      } else {
        await createWarehouse.mutateAsync({ ...data, farmId: FARM_ID });
        toast('Thành công',{ description: 'Đã tạo kho mới' });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể lưu kho',
        // variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteWarehouse.mutateAsync(deletingId);
      toast('Thành công',{ description: 'Đã xóa kho' });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xóa kho',
        // variant: 'destructive',
      });
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
      <PageBreadcrumb items={BREADCRUMB_CONFIGS.warehouses} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kho hàng</h1>
          <p className="text-muted-foreground">Quản lý các kho lưu trữ hàng hóa</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kho
        </Button>
      </div>

      {/* Warehouses Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : warehouses?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <WarehouseIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có kho nào</h3>
            <p className="text-muted-foreground mb-4">Tạo kho đầu tiên để quản lý hàng hóa</p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm kho
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses?.map((warehouse) => (
            <Card key={warehouse.id} className="card-hover group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center',
                      warehouse.isDefault ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <WarehouseIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {warehouse.name}
                        {warehouse.isDefault && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </CardTitle>
                      {/* <CardDescription className="font-mono">{warehouse.code}</CardDescription> */}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(warehouse)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingId(warehouse.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {warehouse.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {warehouse.location}
                  </div>
                )}
                {warehouse.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {warehouse.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{warehouse._count?.inventory || 0} sản phẩm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Chỉnh sửa kho' : 'Thêm kho mới'}
            </DialogTitle>
            <DialogDescription>
              {editingWarehouse ? 'Cập nhật thông tin kho' : 'Tạo kho mới để lưu trữ hàng hóa'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên kho *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Kho thức ăn, Kho thuốc..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vị trí</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Khu A, Chuồng 1..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Mô tả kho..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Kho mặc định</FormLabel>
                      <FormDescription>
                        Sử dụng làm kho mặc định khi tạo phiếu nhập/xuất
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createWarehouse.isPending || updateWarehouse.isPending}>
                  {(createWarehouse.isPending || updateWarehouse.isPending) ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa kho?</AlertDialogTitle>
            <AlertDialogDescription>
              Kho sẽ bị xóa khỏi hệ thống. Không thể xóa nếu kho còn hàng tồn.
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