// =====================================================
// FINANCE TYPES
// =====================================================

// Enums
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
}

export enum ContactType {
  SUPPLIER = 'supplier',
  CUSTOMER = 'customer',
  EMPLOYEE = 'employee',
  OTHER = 'other',
}

export enum ReferenceType {
  STOCK_RECEIPT = 'stock_receipt',
  STOCK_ISSUE = 'stock_issue',
  SALARY = 'salary',
  INVOICE = 'invoice',
  OTHER = 'other',
}

export enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

// Interfaces
export interface TransactionCategory {
  id: string;
  // farmId: string;
  parentId?: string;
  name: string;
  type: TransactionType;
  code?: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: TransactionCategory[];
}

export interface CashAccount {
  id: string;
  // farmId: string;
  name: string;
  accountType: AccountType;
  accountNumber?: string;
  bankName?: string;
  openingBalance: number;
  currentBalance: number;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  // farmId: string;
  cashAccountId: string;
  categoryId?: string;
  transactionCode: string;
  transactionType: TransactionType;
  transactionDate: string;
  amount: number;
  contactType?: ContactType;
  contactId?: string;
  contactName?: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  description?: string;
  notes?: string;
  isRecorded: boolean;
  status: string;
  createdById?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
  transactionCategories?: TransactionCategory;
  cashAccounts?: CashAccount;
  createdBy?: { id: string; fullName: string };
  approvedBy?: { id: string; fullName: string };
  runningBalance?: number;
}

export interface SupplierDebt {
  id: string;
  // farmId: string;
  supplierId: string;
  referenceType: string;
  referenceId: string;
  transactionDate: string;
  debtAmount: number;
  paymentAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  // farmId: string;
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  totalReceivable: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyBill {
  id: string;
  // farmId: string;
  categoryId?: string;
  name: string;
  description?: string;
  defaultAmount: number;
  dueDay?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  transactionCategories?: TransactionCategory;
  // Computed
  currentMonthStatus?: BillStatus;
  lastPaidDate?: string;
}

export interface MonthlyBillRecord {
  id: string;
  billId: string;
  periodMonth: number;
  periodYear: number;
  amount: number;
  dueDate?: string;
  paidDate?: string;
  transactionId?: string;
  status: BillStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  bill?: MonthlyBill;
  transaction?: Transaction;
}

// DTOs
export interface CreateTransactionCategoryDto {
  // farmId: string;
  parentId?: string;
  name: string;
  type: TransactionType;
  code?: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateCashAccountDto {
  // farmId: string;
  name: string;
  accountType?: AccountType;
  accountNumber?: string;
  bankName?: string;
  openingBalance?: number;
  description?: string;
  isDefault?: boolean;
}

export interface CreateTransactionDto {
  // farmId: string;
  cashAccountId: string;
  categoryId?: string;
  transactionType: TransactionType;
  transactionDate: string;
  amount: number;
  contactType?: ContactType;
  contactId?: string;
  contactName?: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  description?: string;
  notes?: string;
  isRecorded?: boolean;
}

export interface CreateSupplierPaymentDto {
  // farmId: string;
  supplierId: string;
  cashAccountId: string;
  paymentDate: string;
  amount: number;
  description?: string;
  notes?: string;
}

export interface CreateMonthlyBillDto {
  // farmId: string;
  categoryId?: string;
  name: string;
  description?: string;
  defaultAmount?: number;
  dueDay?: number;
}

export interface CreateMonthlyBillRecordDto {
  billId: string;
  periodMonth: number;
  periodYear: number;
  amount: number;
  dueDate?: string;
  notes?: string;
}

export interface PayMonthlyBillDto {
  recordId: string;
  cashAccountId: string;
  paidDate?: string;
  notes?: string;
}

export interface CreateCustomerDto {
  // farmId: string;
  code?: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
}

// Query params
export interface TransactionQueryParams {
  // farmId?: string;
  cashAccountId?: string;
  categoryId?: string;
  transactionType?: TransactionType;
  fromDate?: string;
  toDate?: string;
  search?: string;
  isRecorded?: boolean;
  page?: number;
  limit?: number;
}

export interface CashBookReportParams {
  // farmId: string;
  cashAccountId?: string;
  fromDate: string;
  toDate: string;
}

export interface FinancialSummaryParams {
  // farmId: string;
  month?: number;
  year?: number;
  fromDate?: string;
  toDate?: string;
}

export interface MonthlyBillQueryParams {
  // farmId?: string;
  month?: number;
  year?: number;
  status?: BillStatus;
}

// Response types
export interface CashBookReport {
  fromDate: string;
  toDate: string;
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  transactions: Transaction[];
}

export interface FinancialSummary {
  period: {
    from: string;
    to: string;
  };
  totalIncome: number;
  totalExpense: number;
  profit: number;
  incomeByCategory: Record<string, { name: string; amount: number; count: number }>;
  expenseByCategory: Record<string, { name: string; amount: number; count: number }>;
  dailySummary: Record<string, { income: number; expense: number }>;
}

export interface CashAccountBalances {
  totalBalance: number;
  accounts: Array<{
    id: string;
    name: string;
    type: AccountType;
    balance: number;
  }>;
}

export interface DashboardStats {
  cashBalance: number;
  accounts: Array<{ id: string; name: string; type: AccountType; balance: number }>;
  monthlyIncome: number;
  monthlyExpense: number;
  totalSupplierDebt: number;
  overdueCount: number;
}

// =====================================================
// ADDITIONAL MONTHLY BILLS TYPES
// =====================================================

export interface UpdateMonthlyBillDto {
  categoryId?: string;
  name?: string;
  description?: string;
  defaultAmount?: number;
  dueDay?: number;
  isActive?: boolean;
}

// DTO cho thanh toán theo recordId
export interface PayMonthlyBillDto {
  recordId: string;
  cashAccountId: string;
  paidDate?: string;
  notes?: string;
}

// DTO cho thanh toán trực tiếp (tự động tạo record)
export interface PayBillDto {
  billId: string;
  periodMonth: number;
  periodYear: number;
  amount: number;
  cashAccountId: string;
  paidDate: string;
  notes?: string;
}

export interface MonthlyBillSummary {
  totalBills: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

// =====================================================
// REPORTS TYPES
// =====================================================

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  periodType: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface IncomeExpenseReport {
  period: ReportPeriod;
  summary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    profitMargin: number;
  };
  incomeByCategory: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  expenseByCategory: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  dailyData: Array<{
    date: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}

export interface InventoryReport {
  period: ReportPeriod;
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    expiringCount: number;
  };
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalValue: number;
    percentage: number;
  }>;
  byWarehouse: Array<{
    warehouseId: string;
    warehouseName: string;
    productCount: number;
    totalValue: number;
    percentage: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    value: number;
    movement: number; // số lượng xuất trong kỳ
  }>;
}

export interface SupplierDebtReport {
  period: ReportPeriod;
  summary: {
    totalDebt: number;
    totalPurchase: number;
    totalPayment: number;
    supplierCount: number;
  };
  bySupplier: Array<{
    supplierId: string;
    supplierName: string;
    openingDebt: number;
    purchaseAmount: number;
    paymentAmount: number;
    closingDebt: number;
  }>;
  agingAnalysis: {
    current: number; // 0-30 ngày
    days30to60: number;
    days60to90: number;
    over90Days: number;
  };
}

export interface CashFlowReport {
  period: ReportPeriod;
  summary: {
    openingBalance: number;
    totalInflow: number;
    totalOutflow: number;
    closingBalance: number;
  };
  byAccount: Array<{
    accountId: string;
    accountName: string;
    accountType: AccountType;
    openingBalance: number;
    inflow: number;
    outflow: number;
    closingBalance: number;
  }>;
  dailyFlow: Array<{
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
  }>;
}