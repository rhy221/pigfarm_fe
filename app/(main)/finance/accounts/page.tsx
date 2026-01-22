// =====================================================
// CASH ACCOUNTS PAGE - app/(dashboard)/finance/accounts/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Wallet,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Building,
  Banknote,
  Star,
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
  useCashAccounts,
  useCreateCashAccount,
  useUpdateCashAccount,
  useDeleteCashAccount,
} from '@/hooks/use-finance';
import { formatCurrency, cn } from '@/lib/utils';
import { AccountType, CashAccount } from '@/types/finance';
import { toast } from 'sonner';
import { BREADCRUMB_CONFIGS, PageBreadcrumb } from '@/components/page-breadcrumb';

// const  = 'demo-farm-id';

const accountFormSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên tài khoản'),
  accountType: z.enum(AccountType),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  openingBalance: z.number().min(0, 'Số dư không được âm'),
  currentBalance: z.number().min(0, 'Số dư không được âm').optional(),
  description: z.string().optional(),
  isDefault: z.boolean(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function CashAccountsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<CashAccount | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: accounts, isLoading } = useCashAccounts();
  const createAccount = useCreateCashAccount();
  const updateAccount = useUpdateCashAccount();
  const deleteAccount = useDeleteCashAccount();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      accountType: AccountType.CASH,
      accountNumber: '',
      bankName: '',
      openingBalance: 0,
      description: '',
      isDefault: false,
    },
  });

  const openCreateDialog = () => {
    form.reset({
      name: '',
      accountType: AccountType.CASH,
      accountNumber: '',
      bankName: '',
      openingBalance: 0,
      description: '',
      isDefault: false,
    });
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (account: CashAccount) => {
    form.reset({
      name: account.name,
      accountType: account.accountType as AccountType,
      accountNumber: account.accountNumber || '',
      bankName: account.bankName || '',
      openingBalance: Number(account.openingBalance),
      currentBalance: Number(account.currentBalance),
      description: account.description || '',
      isDefault: account.isDefault,
    });
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AccountFormValues) => {
    try {
      if (editingAccount) {
        await updateAccount.mutateAsync({
          id: editingAccount.id,
          data: {
            ...data,
            // farmId: ,
          },
        });
        toast('Thành công',{
          description: 'Đã cập nhật tài khoản',
        });
      } else {
        await createAccount.mutateAsync({
          ...data,
          // farmId: ,
        });
        toast('Thành công', {
          description: 'Đã tạo tài khoản mới',
        });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể lưu tài khoản',
        // variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAccount.mutateAsync(deletingId);
      toast('Thành công',{
        description: 'Đã xóa tài khoản',
      });
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể xóa tài khoản',
        // variant: 'destructive',
      });
    }
    setDeletingId(null);
  };

  const accountType = form.watch('accountType');
  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.currentBalance), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* <PageBreadcrumb items={BREADCRUMB_CONFIGS.accounts} /> */}
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tài khoản quỹ</h1>
          <p className="text-muted-foreground">Quản lý các tài khoản tiền mặt và ngân hàng</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng số dư tất cả tài khoản</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : accounts?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có tài khoản nào</h3>
            <p className="text-muted-foreground mb-4">Tạo tài khoản đầu tiên để bắt đầu quản lý chi phí</p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài khoản
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts?.map((account) => (
            <Card key={account.id} className="card-hover group relative">
              {account.isDefault && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Mặc định
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center',
                    account.accountType === 'cash'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    {account.accountType === 'cash' ? (
                      <Banknote className="h-6 w-6 text-green-600" />
                    ) : (
                      <Building className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription>
                      {account.accountType === 'cash' ? 'Tiền mặt' : account.bankName || 'Ngân hàng'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Số dư hiện tại</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.currentBalance)}</p>
                  </div>
                  {account.accountNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Số tài khoản</p>
                      <p className="font-mono">{account.accountNumber}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Số dư ban đầu: {formatCurrency(account.openingBalance)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(account)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(account.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              {editingAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
            </DialogTitle>
            <DialogDescription>
              {editingAccount
                ? 'Cập nhật thông tin tài khoản quỹ'
                : 'Tạo tài khoản tiền mặt hoặc ngân hàng mới'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài khoản *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Quỹ tiền mặt, Vietcombank..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại tài khoản</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AccountType.CASH}>
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-green-500" />
                            Tiền mặt
                          </div>
                        </SelectItem>
                        <SelectItem value={AccountType.BANK}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            Ngân hàng
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {accountType === AccountType.BANK && (
                <>
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên ngân hàng</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="VD: Vietcombank, BIDV..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tài khoản</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập số tài khoản" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="openingBalance"
                render={({ field }) => {
                  const [displayValue, setDisplayValue] = useState(
                    field.value ? field.value.toLocaleString('vi-VN') : ''
                  );
                  const [isFocused, setIsFocused] = useState(false);

                  return (
                    <FormItem>
                      <FormLabel>Số dư ban đầu</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={isFocused ? displayValue : (field.value ? field.value.toLocaleString('vi-VN') : '')}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            setDisplayValue(rawValue);
                            field.onChange(rawValue === '' ? 0 : parseInt(rawValue, 10));
                          }}
                          onFocus={() => {
                            setIsFocused(true);
                            setDisplayValue(field.value ? field.value.toString() : '');
                          }}
                          onBlur={() => {
                            setIsFocused(false);
                            field.onBlur();
                          }}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>Số tiền ban đầu khi tạo tài khoản</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {editingAccount && (
                <FormField
                  control={form.control}
                  name="currentBalance"
                  render={({ field }) => {
                    const [displayValue, setDisplayValue] = useState(
                      field.value ? field.value.toLocaleString('vi-VN') : ''
                    );
                    const [isFocused, setIsFocused] = useState(false);

                    return (
                      <FormItem>
                        <FormLabel>Số dư hiện tại</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            value={isFocused ? displayValue : (field.value ? field.value.toLocaleString('vi-VN') : '')}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^\d]/g, '');
                              setDisplayValue(rawValue);
                              field.onChange(rawValue === '' ? 0 : parseInt(rawValue, 10));
                            }}
                            onFocus={() => {
                              setIsFocused(true);
                              setDisplayValue(field.value ? field.value.toString() : '');
                            }}
                            onBlur={() => {
                              setIsFocused(false);
                              field.onBlur();
                            }}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormDescription>Số tiền hiện có trong tài khoản</FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Mô tả thêm về tài khoản..." rows={2} />
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
                      <FormLabel className="text-base">Tài khoản mặc định</FormLabel>
                      <FormDescription>
                        Sử dụng làm tài khoản mặc định khi tạo phiếu thu/chi
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
                <Button
                  type="submit"
                  disabled={createAccount.isPending || updateAccount.isPending}
                >
                  {(createAccount.isPending || updateAccount.isPending) ? 'Đang lưu...' : 'Lưu'}
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
            <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              Tài khoản sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
              Lưu ý: Không thể xóa tài khoản nếu đã có giao dịch liên quan.
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