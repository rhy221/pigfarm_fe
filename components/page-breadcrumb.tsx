// =====================================================
// PAGE BREADCRUMB COMPONENT - components/shared/page-breadcrumb.tsx
// =====================================================

"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function PageBreadcrumb({
  items,
  showHome = true,
}: PageBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Trang chủ</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )} */}
        {/* {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <BreadcrumbItem key={index}>
              {!isLast && item.href ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })} */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {!isLast && item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {/* Separator phải nằm ngoài BreadcrumbItem và không render ở item cuối cùng */}
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Predefined breadcrumb configs for common pages
export const BREADCRUMB_CONFIGS = {
  // Inventory
  inventory: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Tồn kho" },
  ],
  warehouses: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Kho hàng" },
  ],
  products: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Sản phẩm" },
  ],
  suppliers: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Nhà cung cấp" },
  ],
  receipts: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Phiếu nhập kho" },
  ],
  receiptNew: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Phiếu nhập kho", href: "/inventory/receipts" },
    { label: "Tạo phiếu nhập" },
  ],
  receiptDetail: (code: string) => [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Phiếu nhập kho", href: "/inventory/receipts" },
    { label: code },
  ],
  issues: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Phiếu xuất kho" },
  ],
  issueNew: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Phiếu xuất kho", href: "/inventory/issues" },
    { label: "Tạo phiếu xuất" },
  ],
  expiry: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Cảnh báo hạn sử dụng" },
  ],
  history: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Lịch sử kho" },
  ],
  checks: [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Kiểm kê kho" },
  ],
  checkDetail: (code: string) => [
    { label: "Quản lý Kho", href: "/inventory" },
    { label: "Kiểm kê kho", href: "/inventory/checks" },
    { label: code },
  ],

  // Finance
  finance: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Tổng quan" },
  ],
  transactions: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Phiếu thu/chi" },
  ],
  transactionNew: (type: "income" | "expense") => [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Phiếu thu/chi", href: "/finance/transactions" },
    { label: type === "income" ? "Tạo phiếu thu" : "Tạo phiếu chi" },
  ],
  accounts: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Tài khoản quỹ" },
  ],
  supplierDebts: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Công nợ NCC" },
  ],
  monthlyBills: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Hóa đơn tháng" },
  ],
  reports: [
    { label: "Quản lý Chi phí", href: "/finance" },
    { label: "Báo cáo" },
  ],
  expensesReport: [
    { label: "Báo cáo", href: "/reports" },
    { label: "Báo cáo Chi phí" },
  ],
};
