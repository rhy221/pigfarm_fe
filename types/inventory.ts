// =====================================================
// INVENTORY TYPES
// =====================================================

// Enums
export enum WarehouseType {
  MAIN = 'main',
  SUB = 'sub',
  HARVEST = 'harvest',
}

export enum CategoryType {
  FEED = 'feed',
  MEDICINE = 'medicine',
  EQUIPMENT = 'equipment',
  HARVEST = 'harvest',
  OTHER = 'other',
}

export enum ReceiptType {
  PURCHASE = 'purchase',
  RETURN = 'return',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum IssueType {
  USAGE = 'usage',
  SALE = 'sale',
  TRANSFER = 'transfer',
  DISPOSAL = 'disposal',
  RETURN = 'return',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

// Interfaces
export interface Unit {
  id: string;
  // farmId: string;
  name: string;
  abbreviation?: string;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseCategory {
  id: string;
  // farmId: string;
  name: string;
  description?: string;
  type: CategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  // farmId: string;
  name: string;
  location?: string;
  description?: string;
  warehouseType: WarehouseType;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    inventory?: number;
  };
}

export interface Product {
  id: string;
  // farmId: string;
  categoryId?: string;
  code?: string;
  name: string;
  description?: string;
  unitId?: string;
  minQuantity: number;
  defaultPrice: number;
  imageUrl?: string;
  barcode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  warehouseCategories?: WarehouseCategory;
  units?: Unit;
}

export interface Supplier {
  id: string;
  // farmId: string;
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  notes?: string;
  totalDebt: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  // farmId: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  avgCost: number;
  lastUpdated: string;
  warehouses?: Warehouse;
  products?: Product;
}

export interface StockReceiptItem {
  id: string;
  receiptId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  expiryDate?: string;
  batchNumber?: string;
  notes?: string;
  product?: Product;
}

export interface StockReceipt {
  id: string;
  // farmId: string;
  warehouseId: string;
  supplierId?: string;
  receiptCode: string;
  receiptDate: string;
  receiptType: ReceiptType;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  finalAmount: number;
  paidAmount: number;
  debtAmount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  createdById?: string;
  approvedById?: string;
  status: DocumentStatus;
  isCostRecorded: boolean;
  createdAt: string;
  updatedAt: string;
  stockReceiptItems?: StockReceiptItem[];
  suppliers?: Supplier;
  warehouses?: Warehouse;
  createdBy?: { id: string; fullName: string };
  approvedBy?: { id: string; fullName: string };
}

export interface StockIssueItem {
  id: string;
  issueId: string;
  productId: string;
  batchId?: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  notes?: string;
  product?: Product;
  inventoryBatches?: InventoryBatch;
}

export interface StockIssue {
  id: string;
  // farmId: string;
  warehouseId: string;
  issueCode: string;
  issueDate: string;
  issueType: IssueType;
  purpose?: string;
  totalAmount: number;
  notes?: string;
  createdById?: string;
  approvedById?: string;
  status: DocumentStatus;
  pigBatchId?: string;
  createdAt: string;
  updatedAt: string;
  stockIssueItems?: StockIssueItem[];
  warehouses?: Warehouse;
  createdBy?: { id: string; fullName: string };
  approvedBy?: { id: string; fullName: string };
}

// DTOs
export interface CreateWarehouseDto {
  // farmId: string;
  name: string;
  location?: string;
  description?: string;
  warehouseType: WarehouseType;
}

export interface CreateProductDto {
  // farmId: string;
  categoryId?: string;
  code?: string;
  name: string;
  description?: string;
  unitId?: string;
  minQuantity?: number;
  defaultPrice?: number;
  imageUrl?: string;
  barcode?: string;
}

export interface CreateSupplierDto {
  // farmId: string;
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  notes?: string;
}

export interface StockReceiptItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  expiryDate?: string;
  batchNumber?: string;
  notes?: string;
}

export interface CreateStockReceiptDto {
  // farmId: string;
  warehouseId: string;
  supplierId?: string;
  receiptDate: string;
  receiptType?: ReceiptType;
  discountAmount?: number;
  taxAmount?: number;
  shippingFee?: number;
  paidAmount?: number;
  notes?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  items: StockReceiptItemInput[];
}

export interface StockIssueItemInput {
  productId: string;
  quantity: number;
  batchId?: string;
  notes?: string;
}

export interface CreateStockIssueDto {
  // farmId: string;
  warehouseId: string;
  issueDate: string;
  issueType?: IssueType;
  purpose?: string;
  notes?: string;
  pigBatchId?: string;
  items: StockIssueItemInput[];
}

// Query params
export interface InventoryQueryParams {
  // farmId?: string;
  warehouseId?: string;
  categoryId?: string;
  search?: string;
  stockStatus?: 'all' | StockStatus;
  page?: number;
  limit?: number;
}

export interface StockReceiptQueryParams {
  // farmId?: string;
  warehouseId?: string;
  supplierId?: string;
  fromDate?: string;
  toDate?: string;
  status?: DocumentStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StockIssueQueryParams {
  // farmId?: string;
  warehouseId?: string;
  fromDate?: string;
  toDate?: string;
  status?: DocumentStatus;
  issueType?: IssueType;
  search?: string;
  page?: number;
  limit?: number;
}

// Response types
export interface InventorySummary {
  totalProducts: number;
  totalValue: number;
  outOfStock: number;
  lowStock: number;
  inStock: number;
  byCategory: Record<string, { count: number; value: number }>;
}

// =====================================================
// EXPIRY & BATCH TYPES
// =====================================================

export enum BatchStatus {
  ACTIVE = 'active',
  DEPLETED = 'depleted',
  EXPIRED = 'expired',
  DISPOSED = 'disposed',
}

export enum ExpiryStatus {
  NO_EXPIRY = 'no_expiry',
  GOOD = 'good',
  NOTICE = 'notice', // 90 days
  WARNING = 'warning', // 30 days
  CRITICAL = 'critical', // 7 days
  EXPIRED = 'expired',
}

export interface InventoryBatch {
  id: string;
  // farmId: string;
  inventoryId: string;
  warehouseId: string;
  productId: string;
  receiptItemId?: string;
  batchNumber?: string;
  quantity: number;
  initialQuantity: number;
  unitCost: number;
  manufacturingDate?: string;
  expiryDate?: string;
  receivedDate: string;
  status: BatchStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Included relations
  receiptItem?: {
    receipt?: {
      receiptCode: string;
      receiptDate: string;
      supplier?: { name: string };
    };
  };
}

export interface ExpirySummary {
  expiredCount: number;
  criticalCount: number;
  warningCount: number;
  noticeCount: number;
  expiredValue: number;
  criticalValue: number;
  warningValue: number;
  totalAlerts: number;
}

export interface ExpiryAlert {
  batchId: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productCode?: string;
  productName: string;
  categoryName?: string;
  categoryType?: string;
  unitName?: string;
  batchNumber?: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  manufacturingDate?: string;
  expiryDate?: string;
  receivedDate: string;
  daysUntilExpiry?: number;
  expiryStatus: ExpiryStatus;
}

export interface ExpiryAlertQueryParams {
  // farmId: string;
  expiryStatus?: ExpiryStatus;
  warehouseId?: string;
  categoryId?: string;
  productId?: string;
  page?: number;
  limit?: number;
}

export interface DisposeBatchDto {
  batchId: string;
  reason?: string;
  notes?: string;
}

// =====================================================
// INVENTORY HISTORY TYPES
// =====================================================

export enum HistoryTransactionType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
}

export enum HistoryReferenceType {
  RECEIPT = 'receipt',
  ISSUE = 'issue',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  CHECK = 'check',
}

export interface InventoryHistory {
  id: string;
  // farmId: string;
  warehouseId: string;
  productId: string;
  transactionType: HistoryTransactionType;
  referenceType?: HistoryReferenceType;
  referenceId?: string;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  // Relations
  warehouses?: Warehouse;
  products?: Product;
  user?: { fullName: string };
}

export interface InventoryHistoryQueryParams {
  // farmId: string;
  warehouseId?: string;
  productId?: string;
  transactionType?: HistoryTransactionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// =====================================================
// INVENTORY CHECK TYPES
// =====================================================

export enum CheckStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface InventoryCheck {
  id: string;
  // farmId: string;
  warehouseId: string;
  checkCode: string;
  checkDate: string;
  notes?: string;
  status: CheckStatus;
  createdBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  warehouse?: Warehouse;
  items?: InventoryCheckItem[];
  creator?: { fullName: string };
  approver?: { fullName: string };
  // Computed
  totalItems?: number;
  itemsWithDifference?: number;
  totalDifferenceValue?: number;
}

export interface InventoryCheckItem {
  id: string;
  checkId: string;
  productId: string;
  systemQuantity: number;
  actualQuantity: number;
  difference: number;
  unitCost: number;
  differenceValue: number;
  notes?: string;
  createdAt: string;
  // Relations
  product?: Product;
}

export interface CreateInventoryCheckDto {
  // farmId: string;
  warehouseId: string;
  checkDate: string;
  notes?: string;
}

export interface InventoryCheckItemDto {
  productId: string;
  actualQuantity: number;
  notes?: string;
}

export interface UpdateInventoryCheckDto {
  items: InventoryCheckItemDto[];
  notes?: string;
}