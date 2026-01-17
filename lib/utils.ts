
// =====================================================
// UTILITY FUNCTIONS
// =====================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (VND)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with thousand separators
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Parse formatted number string to number
export function parseFormattedNumber(str: string): number {
  return parseFloat(str.replace(/[^\d.-]/g, '')) || 0;
}

// Format date to Vietnamese format
export function formatDate(date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { day: '2-digit', month: '2-digit', year: 'numeric' } :
    format === 'long' ? { day: '2-digit', month: 'long', year: 'numeric' } :
    { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  
  return d.toLocaleDateString('vi-VN', options);
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Check if value is empty
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Get query string from object
export function toQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

// Parse query string to object
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Vietnamese text normalization (remove diacritics)
export function removeVietnameseDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Search filter helper
export function searchFilter<T>(items: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  if (!searchTerm) return items;
  
  const normalizedSearch = removeVietnameseDiacritics(searchTerm.toLowerCase());
  
  return items.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      if (typeof value === 'string') {
        return removeVietnameseDiacritics(value.toLowerCase()).includes(normalizedSearch);
      }
      return false;
    });
  });
}

// Status color mapping
export const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  partial: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700',
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

// Status label mapping (Vietnamese)
export const statusLabels: Record<string, string> = {
  draft: 'Nháp',
  confirmed: 'Đã xác nhận',
  cancelled: 'Đã hủy',
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  overdue: 'Quá hạn',
  in_stock: 'Còn hàng',
  low_stock: 'Sắp hết',
  out_of_stock: 'Hết hàng',
  income: 'Thu',
  expense: 'Chi',
  purchase: 'Mua hàng',
  return: 'Trả hàng',
  transfer: 'Chuyển kho',
  adjustment: 'Điều chỉnh',
  usage: 'Sử dụng',
  sale: 'Bán hàng',
  disposal: 'Hủy bỏ',
  feed: 'Thức ăn',
  medicine: 'Thuốc',
  equipment: 'Thiết bị',
  harvest: 'Thu hoạch',
  other: 'Khác',
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  supplier: 'Nhà cung cấp',
  customer: 'Khách hàng',
  employee: 'Nhân viên',
};

// Get status label
export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}

// Get status color class
export function getStatusColor(status: string): string {
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700';
}