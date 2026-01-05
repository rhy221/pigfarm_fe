// =====================================================
// FINANCE API HOOKS - TANSTACK QUERY
// =====================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
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
  CreateCustomerDto,
  TransactionQueryParams,
  CashBookReportParams,
  FinancialSummaryParams,
  MonthlyBillQueryParams,
  TransactionType,
  PaginatedResponse,
} from '@/types/finance';

const FINANCE_KEYS = {
  all: ['finance'] as const,
  categories: (farmId: string, type?: TransactionType) => [...FINANCE_KEYS.all, 'categories', farmId, type] as const,
  accounts: (farmId: string) => [...FINANCE_KEYS.all, 'accounts', farmId] as const,
  account: (id: string) => [...FINANCE_KEYS.all, 'account', id] as const,
  accountBalances: (farmId: string) => [...FINANCE_KEYS.all, 'accountBalances', farmId] as const,
  transactions: (params: TransactionQueryParams) => [...FINANCE_KEYS.all, 'transactions', params] as const,
  transaction: (id: string) => [...FINANCE_KEYS.all, 'transaction', id] as const,
  cashBook: (params: CashBookReportParams) => [...FINANCE_KEYS.all, 'cashBook', params] as const,
  summary: (params: FinancialSummaryParams) => [...FINANCE_KEYS.all, 'summary', params] as const,
  dashboard: (farmId: string) => [...FINANCE_KEYS.all, 'dashboard', farmId] as const,
  monthlyBills: (farmId: string) => [...FINANCE_KEYS.all, 'monthlyBills', farmId] as const,
  monthlyBillRecords: (params: MonthlyBillQueryParams) => [...FINANCE_KEYS.all, 'monthlyBillRecords', params] as const,
  customers: (farmId: string) => [...FINANCE_KEYS.all, 'customers', farmId] as const,
};

// ============ TRANSACTION CATEGORY HOOKS ============
export function useTransactionCategories(farmId: string, type?: TransactionType) {
  const params = new URLSearchParams({ farmId });
  if (type) params.append('type', type);

  return useQuery({
    queryKey: FINANCE_KEYS.categories(farmId, type),
    queryFn: () => api.get<TransactionCategory[]>(`/api/finance/categories?${params}`),
    enabled: !!farmId,
  });
}

export function useCreateTransactionCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionCategoryDto) =>
      api.post<TransactionCategory>('/api/finance/categories', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.categories(variables.farmId) });
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
export function useCashAccounts(farmId: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.accounts(farmId),
    queryFn: () => api.get<CashAccount[]>(`/api/finance/accounts?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useCashAccount(id: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.account(id),
    queryFn: () => api.get<CashAccount>(`/api/finance/accounts/${id}`),
    enabled: !!id,
  });
}

export function useCashAccountBalances(farmId: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.accountBalances(farmId),
    queryFn: () => api.get<CashAccountBalances>(`/api/finance/accounts/balances?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useCreateCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCashAccountDto) =>
      api.post<CashAccount>('/api/finance/accounts', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.accounts(variables.farmId) });
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
    enabled: !!params.farmId,
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
    enabled: !!params.farmId && !!params.fromDate && !!params.toDate,
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
    enabled: !!params.farmId,
  });
}

export function useDashboardStats(farmId: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.dashboard(farmId),
    queryFn: () => api.get<DashboardStats>(`/api/finance/reports/dashboard?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

// ============ MONTHLY BILL HOOKS ============
export function useMonthlyBills(farmId: string) {
  return useQuery({
    queryKey: FINANCE_KEYS.monthlyBills(farmId),
    queryFn: () => api.get<MonthlyBill[]>(`/api/finance/monthly-bills?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useCreateMonthlyBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMonthlyBillDto) =>
      api.post<MonthlyBill>('/api/finance/monthly-bills', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.monthlyBills(variables.farmId) });
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
    enabled: !!params.farmId,
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

export function usePayMonthlyBill() {
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
export function useCustomers(farmId: string, search?: string) {
  const params = new URLSearchParams({ farmId });
  if (search) params.append('search', search);

  return useQuery({
    queryKey: [...FINANCE_KEYS.customers(farmId), search],
    queryFn: () => api.get<Customer[]>(`/api/finance/customers?${params}`),
    enabled: !!farmId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerDto) =>
      api.post<Customer>('/api/finance/customers', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.customers(variables.farmId) });
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