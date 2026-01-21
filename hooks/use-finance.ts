// =====================================================
// FINANCE API HOOKS - TANSTACK QUERY
// =====================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  TransactionCategory,
  CashAccount,
  Transaction,
  Customer,
  MonthlyBill,
  MonthlyBillRecord,
  CashBookReport,
  FinancialSummary,
  CashAccountBalances,
  DashboardStats,
  CreateTransactionCategoryDto,
  CreateCashAccountDto,
  CreateTransactionDto,
  CreateSupplierPaymentDto,
  CreateMonthlyBillDto,
  CreateMonthlyBillRecordDto,
  PayMonthlyBillDto,
  PayBillDto,
  CreateCustomerDto,
  TransactionQueryParams,
  CashBookReportParams,
  FinancialSummaryParams,
  MonthlyBillQueryParams,
  TransactionType,
  IncomeExpenseReport,
  InventoryReport,
  SupplierDebtReport,
  CashFlowReport,
  MonthlyBillSummary,
} from '@/types/finance';
import type { PaginatedResponse } from '@/types/common';

const FINANCE_KEYS = {
  all: ['finance'] as const,
  categories: (type?: TransactionType) => [...FINANCE_KEYS.all, 'categories', type] as const,
  accounts: () => [...FINANCE_KEYS.all, 'accounts'] as const,
  account: (id: string) => [...FINANCE_KEYS.all, 'account', id] as const,
  accountBalances: () => [...FINANCE_KEYS.all, 'accountBalances'] as const,
  transactions: (params: TransactionQueryParams) => [...FINANCE_KEYS.all, 'transactions', params] as const,
  transaction: (id: string) => [...FINANCE_KEYS.all, 'transaction', id] as const,
  cashBook: (params: CashBookReportParams) => [...FINANCE_KEYS.all, 'cashBook', params] as const,
  summary: (params: FinancialSummaryParams) => [...FINANCE_KEYS.all, 'summary', params] as const,
  dashboard: () => [...FINANCE_KEYS.all, 'dashboard'] as const,
  monthlyBills: () => [...FINANCE_KEYS.all, 'monthlyBills'] as const,
  monthlyBillRecords: (params: MonthlyBillQueryParams) => [...FINANCE_KEYS.all, 'monthlyBillRecords', params] as const,
  customers: () => [...FINANCE_KEYS.all, 'customers'] as const,
};

// ============ TRANSACTION CATEGORY HOOKS ============
export function useTransactionCategories(type?: TransactionType) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);

  return useQuery({
    queryKey: FINANCE_KEYS.categories(type),
    queryFn: () => api.get<TransactionCategory[]>(`/api/finance/categories?${params}`),
    // enabled: !!farmId,
  });
}

export function useCreateTransactionCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionCategoryDto) =>
      api.post<TransactionCategory>('/api/finance/categories', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories() });
    },
  });
}

export function useUpdateTransactionCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionCategoryDto> }) =>
      api.put<TransactionCategory>(`/api/finance/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useDeleteTransactionCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/finance/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// ============ CASH ACCOUNT HOOKS ============
export function useCashAccounts() {
  return useQuery({
    queryKey: FINANCE_KEYS.accounts(),
    queryFn: () => api.get<CashAccount[]>(`/api/finance/accounts`),
    // enabled: !!farmId,
  });
}

export function useCashAccount(id: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.account(id),
    queryFn: () => api.get<CashAccount>(`/api/finance/accounts/${id}`),
    enabled: !!id,
  });
}

export function useCashAccountBalances() {
  return useQuery({
    queryKey: FINANCE_KEYS.accountBalances(),
    queryFn: () => api.get<CashAccountBalances>(`/api/finance/accounts/balances`),
    // enabled: !!farmId,
  });
}

export function useCreateCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCashAccountDto) =>
      api.post<CashAccount>('/api/finance/accounts', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.accounts() });
    },
  });
}

export function useUpdateCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCashAccountDto> }) =>
      api.put<CashAccount>(`/api/finance/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useDeleteCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/finance/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// ============ TRANSACTION HOOKS ============
export function useTransactions(params: TransactionQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: FINANCE_KEYS.transactions(params),
    queryFn: () => api.get<PaginatedResponse<Transaction>>(`/api/finance/transactions?${searchParams}`),
    // enabled: !!params.farmId,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.transaction(id),
    queryFn: () => api.get<Transaction>(`/api/finance/transactions/${id}`),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionDto) =>
      api.post<Transaction>('/api/finance/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionDto> }) =>
      api.put<Transaction>(`/api/finance/transactions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/finance/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// ============ SUPPLIER PAYMENT HOOKS ============
export function useCreateSupplierPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierPaymentDto) =>
      api.post<Transaction>('/api/finance/supplier-payments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// ============ REPORT HOOKS ============
export function useCashBookReport(params: CashBookReportParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: FINANCE_KEYS.cashBook(params),
    queryFn: () => api.get<CashBookReport>(`/api/finance/reports/cash-book?${searchParams}`),
    enabled: 
    // !!params.farmId && 
    !!params.fromDate && !!params.toDate,
  });
}

export function useFinancialSummary(params: FinancialSummaryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: FINANCE_KEYS.summary(params),
    queryFn: () => api.get<FinancialSummary>(`/api/finance/reports/summary?${searchParams}`),
    // enabled: !!params.farmId,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: FINANCE_KEYS.dashboard(),
    queryFn: () => api.get<DashboardStats>(`/api/finance/reports/dashboard`),
    // enabled: !!farmId,
  });
}

// ============ MONTHLY BILL HOOKS ============
export function useMonthlyBills() {
  return useQuery({
    queryKey: FINANCE_KEYS.monthlyBills(),
    queryFn: () => api.get<MonthlyBill[]>(`/api/finance/monthly-bills`),
    // enabled: !!farmId,
  });
}

export function useCreateMonthlyBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMonthlyBillDto) =>
      api.post<MonthlyBill>('/api/finance/monthly-bills', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.monthlyBills() });
    },
  });
}

export function useUpdateMonthlyBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMonthlyBillDto> }) =>
      api.put<MonthlyBill>(`/api/finance/monthly-bills/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useDeleteMonthlyBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/finance/monthly-bills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

export function useMonthlyBillRecords(params: MonthlyBillQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: FINANCE_KEYS.monthlyBillRecords(params),
    queryFn: () => api.get<MonthlyBillRecord[]>(`/api/finance/monthly-bills/records?${searchParams}`),
    // enabled: !!params.farmId,
  });
}

export function useCreateMonthlyBillRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMonthlyBillRecordDto) =>
      api.post<MonthlyBillRecord>('/api/finance/monthly-bills/records', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// Thanh toán trực tiếp (tự động tạo record nếu chưa có)
export function usePayMonthlyBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayBillDto) =>
      api.post<Transaction>('/api/finance/monthly-bills/pay-direct', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// Thanh toán theo recordId (cần tạo record trước)
export function usePayMonthlyBillByRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayMonthlyBillDto) =>
      api.post<Transaction>('/api/finance/monthly-bills/pay', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// ============ CUSTOMER HOOKS ============
export function useCustomers( search?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);

  return useQuery({
    queryKey: [...FINANCE_KEYS.customers(), search],
    queryFn: () => api.get<Customer[]>(`/api/finance/customers?${params}`),
    // enabled: !!farmId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) =>
      api.post<Customer>('/api/finance/customers', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.customers() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCustomerDto> }) =>
      api.put<Customer>(`/api/finance/customers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
}

// ============ REPORTS HOOKS ============

const REPORT_KEYS = {
  all: ['reports'] as const,
  incomeExpense: ( startDate: string, endDate: string) => 
    [...REPORT_KEYS.all, 'income-expense', startDate, endDate] as const,
  inventory: (date: string) => 
    [...REPORT_KEYS.all, 'inventory', date] as const,
  supplierDebt: (startDate: string, endDate: string) => 
    [...REPORT_KEYS.all, 'supplier-debt', startDate, endDate] as const,
  cashFlow: (startDate: string, endDate: string) => 
    [...REPORT_KEYS.all, 'cash-flow', startDate, endDate] as const,
  billSummary: (month: number, year: number) =>
    [...REPORT_KEYS.all, 'bill-summary', month, year] as const,
};

export function useIncomeExpenseReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: REPORT_KEYS.incomeExpense(startDate, endDate),
    queryFn: () => api.get<IncomeExpenseReport>(
      `/api/reports/income-expense&startDate=${startDate}&endDate=${endDate}`
    ),
    enabled: 
    // !!farmId && 
    !!startDate && !!endDate,
  });
}

export function useInventoryReport(date?: string) {
  const reportDate = date || new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: REPORT_KEYS.inventory(reportDate),
    queryFn: () => api.get<InventoryReport>(
      `/api/reports/inventory&date=${reportDate}`
    ),
    // enabled: !!farmId,
  });
}

export function useSupplierDebtReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: REPORT_KEYS.supplierDebt(startDate, endDate),
    queryFn: () => api.get<SupplierDebtReport>(
      `/api/reports/supplier-debt&startDate=${startDate}&endDate=${endDate}`
    ),
    enabled: 
    // !!farmId && 
    !!startDate && !!endDate,
  });
}

export function useCashFlowReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: REPORT_KEYS.cashFlow(startDate, endDate),
    queryFn: () => api.get<CashFlowReport>(
      `/api/reports/cash-flow&startDate=${startDate}&endDate=${endDate}`
    ),
    enabled: 
    // !!farmId && 
    !!startDate && !!endDate,
  });
}

export function useMonthlyBillSummary( month: number, year: number) {
  return useQuery({
    queryKey: REPORT_KEYS.billSummary( month, year),
    queryFn: () => api.get<MonthlyBillSummary>(
      `/api/finance/monthly-bills/summary?month=${month}&year=${year}`
    ),
    // enabled: !!farmId,
  });
}