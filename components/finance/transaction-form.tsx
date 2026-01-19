// =====================================================
// TRANSACTION FORM COMPONENT (Phiếu Thu/Chi)
// =====================================================

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, Save, ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useCashAccounts, useTransactionCategories, useCreateTransaction } from '@/hooks/use-finance';
import { useSuppliers } from '@/hooks/use-inventory';
import { formatCurrency, cn } from '@/lib/utils';
import { TransactionType, ContactType } from '@/types/finance';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

// Form schema
const transactionFormSchema = z.object({
  transactionType: z.nativeEnum(TransactionType),
  cashAccountId: z.string().min(1, 'Vui lòng chọn tài khoản'),
  categoryId: z.string().optional(),
  transactionDate: z.date({ error: 'Vui lòng chọn ngày' }),
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0'),
  contactType: z.nativeEnum(ContactType).optional(),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  isRecorded: z.boolean(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

// interface TransactionFormProps {
//   : string;
// }

export default function TransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const initialType = searchParams.get('type') === 'income' 
    ? TransactionType.INCOME 
    : TransactionType.EXPENSE;
  const { data: accounts } = useCashAccounts();
  const { data: incomeCategories } = useTransactionCategories( TransactionType.INCOME);
  const { data: expenseCategories } = useTransactionCategories( TransactionType.EXPENSE);
  const { data: suppliers } = useSuppliers();

  const createTransaction = useCreateTransaction();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionType: initialType,
      cashAccountId: '',
      categoryId: '',
      transactionDate: new Date(),
      amount: 0,
      contactType: undefined,
      contactId: '',
      contactName: '',
      description: '',
      notes: '',
      isRecorded: true,
    },
  });

  const transactionType = form.watch('transactionType');
  const categories = transactionType === TransactionType.INCOME ? incomeCategories : expenseCategories;

  const handleContactTypeChange = (value: ContactType) => {
    form.setValue('contactType', value);
    form.setValue('contactId', '');
    form.setValue('contactName', '');
  };

  const handleSupplierSelect = (supplierId: string) => {
    const supplier = suppliers?.find((s) => s.id === supplierId);
    if (supplier) {
      form.setValue('contactId', supplierId);
      form.setValue('contactName', supplier.name);
    }
  };

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      await createTransaction.mutateAsync({
        
        cashAccountId: data.cashAccountId,
        categoryId: data.categoryId || undefined,
        transactionType: data.transactionType,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        amount: data.amount,
        contactType: data.contactType,
        contactId: data.contactId || undefined,
        contactName: data.contactName || undefined,
        description: data.description,
        notes: data.notes,
        isRecorded: data.isRecorded,
      });

      toast('Thành công', {
        description: `Đã tạo phiếu ${data.transactionType === TransactionType.INCOME ? 'thu' : 'chi'} thành công`,
      });

      router.push('/finance');
    } catch (error: any) {
      toast('Lỗi', {
        description: error.message || 'Không thể tạo giao dịch',
        // variant: 'destructive',
      });
    }
  };

  useEffect(() => {
        if (accounts && !form.getValues('cashAccountId')) {
          const defaultAccount = accounts.find((ac) => ac.isDefault);
          if (defaultAccount) {
            form.reset({
          ...form.getValues(),
          cashAccountId: defaultAccount.id,
        });
          }
        } 
      }, [accounts, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {transactionType === TransactionType.INCOME ? (
                  <>
                    <ArrowUpCircle className="h-6 w-6 text-green-500" />
                    Tạo phiếu thu
                  </>
                ) : (
                  <>
                    <ArrowDownCircle className="h-6 w-6 text-red-500" />
                    Tạo phiếu chi
                  </>
                )}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={createTransaction.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {createTransaction.isPending ? 'Đang lưu...' : 'Lưu phiếu'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Tabs
                  value={transactionType}
                  onValueChange={(value) => form.setValue('transactionType', value as TransactionType)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={TransactionType.INCOME} className="gap-2"
                    onClick={() => router.push(`${pathName}?type=${TransactionType.INCOME}`)}>
                      <ArrowUpCircle className="h-4 w-4" />
                      Phiếu thu
                    </TabsTrigger>
                    <TabsTrigger value={TransactionType.EXPENSE} className="gap-2"
                    onClick={() => router.push(`${pathName}?type=${TransactionType.EXPENSE}`)}>
                      <ArrowDownCircle className="h-4 w-4" />
                      Phiếu chi
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cashAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tài khoản *</FormLabel>
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=" ">-- Không chọn --</SelectItem>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày giao dịch *</FormLabel>
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
                  name="amount"
                  render={({ field }) => {
                    const [displayValue, setDisplayValue] = useState(
                                        field.value ? field.value.toLocaleString('vi-VN') : ''
                                      );
                                      const [isFocused, setIsFocused] = useState(false);
                    
                    return <FormItem>
                      <FormLabel>Số tiền *</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
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
                          placeholder="Nhập số tiền"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đối tượng giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại đối tượng</FormLabel>
                      <Select
                        onValueChange={(value) => handleContactTypeChange(value as ContactType)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=" ">-- Không chọn --</SelectItem>
                          <SelectItem value={ContactType.SUPPLIER}>Nhà cung cấp</SelectItem>
                          <SelectItem value={ContactType.CUSTOMER}>Khách hàng</SelectItem>
                          <SelectItem value={ContactType.EMPLOYEE}>Nhân viên</SelectItem>
                          <SelectItem value={ContactType.OTHER}>Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('contactType') === ContactType.SUPPLIER && (
                  <FormItem>
                    <FormLabel>Chọn nhà cung cấp</FormLabel>
                    <Select onValueChange={handleSupplierSelect} value={form.watch('contactId') || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn NCC" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}

                {form.watch('contactType') && form.watch('contactType') !== ContactType.SUPPLIER && (
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đối tượng</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập tên" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diễn giải</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nội dung giao dịch" />
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
                        <Textarea {...field} placeholder="Ghi chú thêm..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Tùy chọn</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isRecorded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Hoạch toán</FormLabel>
                        <FormDescription>Ghi nhận vào báo cáo</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại phiếu:</span>
                    <span className={cn('font-medium', transactionType === TransactionType.INCOME ? 'text-green-600' : 'text-red-600')}>
                      {transactionType === TransactionType.INCOME ? 'Phiếu thu' : 'Phiếu chi'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className={cn('text-lg font-bold', transactionType === TransactionType.INCOME ? 'text-green-600' : 'text-red-600')}>
                      {transactionType === TransactionType.INCOME ? '+' : '-'}
                      {formatCurrency(form.watch('amount') || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}