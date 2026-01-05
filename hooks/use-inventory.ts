// =====================================================
// INVENTORY API HOOKS - TANSTACK QUERY
// =====================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import {
  Warehouse,
  WarehouseCategory,
  Unit,
  Product,
  Supplier,
  Inventory,
  StockReceipt,
  StockIssue,
  InventoryHistory,
  InventorySummary,
  CreateWarehouseDto,
  CreateProductDto,
  CreateSupplierDto,
  CreateStockReceiptDto,
  CreateStockIssueDto,
  InventoryQueryParams,
  StockReceiptQueryParams,
  StockIssueQueryParams,
  PaginatedResponse,
  ExpirySummary,
  ExpiryAlert,
  ExpiryAlertQueryParams,
  DisposeBatchDto,
  InventoryBatch,
} from '@/types/inventory';

const INVENTORY_KEYS = {
  all: ['inventory'] as const,
  warehouses: (farmId: string) => [...INVENTORY_KEYS.all, 'warehouses', farmId] as const,
  warehouse: (id: string) => [...INVENTORY_KEYS.all, 'warehouse', id] as const,
  categories: (farmId: string) => [...INVENTORY_KEYS.all, 'categories', farmId] as const,
  units: (farmId: string) => [...INVENTORY_KEYS.all, 'units', farmId] as const,
  products: (farmId: string) => [...INVENTORY_KEYS.all, 'products', farmId] as const,
  product: (id: string) => [...INVENTORY_KEYS.all, 'product', id] as const,
  suppliers: (farmId: string) => [...INVENTORY_KEYS.all, 'suppliers', farmId] as const,
  supplier: (id: string) => [...INVENTORY_KEYS.all, 'supplier', id] as const,
  stock: (params: InventoryQueryParams) => [...INVENTORY_KEYS.all, 'stock', params] as const,
  stockSummary: (farmId: string) => [...INVENTORY_KEYS.all, 'stockSummary', farmId] as const,
  receipts: (params: StockReceiptQueryParams) => [...INVENTORY_KEYS.all, 'receipts', params] as const,
  receipt: (id: string) => [...INVENTORY_KEYS.all, 'receipt', id] as const,
  issues: (params: StockIssueQueryParams) => [...INVENTORY_KEYS.all, 'issues', params] as const,
  issue: (id: string) => [...INVENTORY_KEYS.all, 'issue', id] as const,
  history: (params: any) => [...INVENTORY_KEYS.all, 'history', params] as const,
};

// ============ WAREHOUSE HOOKS ============
export function useWarehouses(farmId: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.warehouses(farmId),
    queryFn: () => api.get<Warehouse[]>(`/api/inventory/warehouses?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.warehouse(id),
    queryFn: () => api.get<Warehouse>(`/api/inventory/warehouses/${id}`),
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWarehouseDto) =>
      api.post<Warehouse>('/api/inventory/warehouses', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.warehouses(variables.farmId) });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWarehouseDto> }) =>
      api.put<Warehouse>(`/api/inventory/warehouses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/inventory/warehouses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

// ============ CATEGORY HOOKS ============
export function useWarehouseCategories(farmId: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.categories(farmId),
    queryFn: () => api.get<WarehouseCategory[]>(`/api/inventory/categories?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

// ============ UNIT HOOKS ============
export function useUnits(farmId: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.units(farmId),
    queryFn: () => api.get<Unit[]>(`/api/inventory/units?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

// ============ PRODUCT HOOKS ============
// ============ PRODUCT HOOKS ============
export interface ProductsQueryParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(farmId: string, options?: ProductsQueryParams) {
  const params = new URLSearchParams({ farmId });
  if (options?.categoryId) params.append('categoryId', options.categoryId);
  if (options?.search) params.append('search', options.search);
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());

  return useQuery({
    queryKey: [...INVENTORY_KEYS.products(farmId), options],
    queryFn: () => api.get<PaginatedResponse<Product>>(`/api/inventory/products?${params}`),
    enabled: !!farmId,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.product(id),
    queryFn: () => api.get<Product>(`/api/inventory/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      api.post<Product>('/api/inventory/products', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products(variables.farmId) });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDto> }) =>
      api.put<Product>(`/api/inventory/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/inventory/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

// ============ SUPPLIER HOOKS ============
export function useSuppliers(farmId: string, search?: string) {
  const params = new URLSearchParams({ farmId });
  if (search) params.append('search', search);

  return useQuery({
    queryKey: [...INVENTORY_KEYS.suppliers(farmId), search],
    queryFn: () => api.get<Supplier[]>(`/api/inventory/suppliers?${params}`),
    enabled: !!farmId,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.supplier(id),
    queryFn: () => api.get<Supplier>(`/api/inventory/suppliers/${id}`),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierDto) =>
      api.post<Supplier>('/api/inventory/suppliers', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.suppliers(variables.farmId) });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSupplierDto> }) =>
      api.put<Supplier>(`/api/inventory/suppliers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

// ============ INVENTORY HOOKS ============
export function useInventory(params: InventoryQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: INVENTORY_KEYS.stock(params),
    queryFn: () => api.get<PaginatedResponse<Inventory>>(`/api/inventory/stock?${searchParams}`),
    enabled: !!params.farmId,
  });
}

export function useInventorySummary(farmId: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.stockSummary(farmId),
    queryFn: () => api.get<InventorySummary>(`/api/inventory/stock/summary?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useInventoryHistory(params: any) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: INVENTORY_KEYS.history(params),
    queryFn: () => api.get<PaginatedResponse<InventoryHistory>>(`/api/inventory/stock/history?${searchParams}`),
    enabled: !!params.farmId,
  });
}

// ============ STOCK RECEIPT HOOKS ============
export function useStockReceipts(params: StockReceiptQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: INVENTORY_KEYS.receipts(params),
    queryFn: () => api.get<PaginatedResponse<StockReceipt>>(`/api/inventory/receipts?${searchParams}`),
    enabled: !!params.farmId,
  });
}

export function useStockReceipt(id: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.receipt(id),
    queryFn: () => api.get<StockReceipt>(`/api/inventory/receipts/${id}`),
    enabled: !!id,
  });
}

export function useCreateStockReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockReceiptDto) =>
      api.post<StockReceipt>('/api/inventory/receipts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useUpdateStockReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStockReceiptDto> }) =>
      api.put<StockReceipt>(`/api/inventory/receipts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useConfirmStockReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<StockReceipt>(`/api/inventory/receipts/${id}/confirm`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useCancelStockReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<StockReceipt>(`/api/inventory/receipts/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

// ============ STOCK ISSUE HOOKS ============
export function useStockIssues(params: StockIssueQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: INVENTORY_KEYS.issues(params),
    queryFn: () => api.get<PaginatedResponse<StockIssue>>(`/api/inventory/issues?${searchParams}`),
    enabled: !!params.farmId,
  });
}

export function useStockIssue(id: string) {
  return useQuery({
    queryKey: INVENTORY_KEYS.issue(id),
    queryFn: () => api.get<StockIssue>(`/api/inventory/issues/${id}`),
    enabled: !!id,
  });
}

export function useCreateStockIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStockIssueDto) =>
      api.post<StockIssue>('/api/inventory/issues', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useConfirmStockIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<StockIssue>(`/api/inventory/issues/${id}/confirm`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useCancelStockIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<StockIssue>(`/api/inventory/issues/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

// ============ EXPIRY ALERT HOOKS ============
const EXPIRY_KEYS = {
  all: ['expiry'] as const,
  summary: (farmId: string) => [...EXPIRY_KEYS.all, 'summary', farmId] as const,
  alerts: (farmId: string) => [...EXPIRY_KEYS.all, 'alerts', farmId] as const,
  batches: (inventoryId: string) => [...EXPIRY_KEYS.all, 'batches', inventoryId] as const,
};

export function useExpirySummary(farmId: string) {
  return useQuery({
    queryKey: EXPIRY_KEYS.summary(farmId),
    queryFn: () => api.get<ExpirySummary>(`/api/inventory/expiry/summary?farmId=${farmId}`),
    enabled: !!farmId,
  });
}

export function useExpiryAlerts(params: ExpiryAlertQueryParams) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return useQuery({
    queryKey: [...EXPIRY_KEYS.alerts(params.farmId), params],
    queryFn: () => api.get<PaginatedResponse<ExpiryAlert>>(`/api/inventory/expiry/alerts?${searchParams}`),
    enabled: !!params.farmId,
  });
}

export function useDisposeBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DisposeBatchDto) =>
      api.post('/api/inventory/expiry/dispose', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPIRY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
}

export function useUpdateExpiredBatches() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (farmId: string) =>
      api.post(`/api/inventory/expiry/update-status?farmId=${farmId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPIRY_KEYS.all });
    },
  });
}

export function useInventoryBatches(inventoryId: string, options?: { includeAll?: boolean }) {
  const params = options?.includeAll ? '?includeAll=true' : '';
  return useQuery({
    queryKey: [...EXPIRY_KEYS.batches(inventoryId), options],
    queryFn: () => api.get<InventoryBatch[]>(`/api/inventory/batches/${inventoryId}${params}`),
    enabled: !!inventoryId,
  });
}