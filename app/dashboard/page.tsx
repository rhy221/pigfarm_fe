// =====================================================
// MAIN DASHBOARD PAGE - app/(dashboard)/dashboard/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInventorySummary } from '@/hooks/use-inventory';
import { useDashboardStats } from '@/hooks/use-finance';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Hardcoded farmId for demo - in production, get from auth context
const FARM_ID = 'demo-farm-id';

export default function DashboardPage() {
  const { data: inventorySummary } = useInventorySummary(FARM_ID);
  const { data: financeStats } = useDashboardStats(FARM_ID);

  const profit = (financeStats?.monthlyIncome || 0) - (financeStats?.monthlyExpense || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là tình hình trang trại hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/receipts/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nhập kho
            </Button>
          </Link>
          <Link href="/finance/transactions/new?type=expense">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ghi chi phí
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        {/* Total Cash Balance */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dư</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(financeStats?.cashBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {financeStats?.accounts?.length || 0} tài khoản
            </p>
          </CardContent>
        </Card>

        {/* Monthly Income */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Thu tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(financeStats?.monthlyIncome || 0)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+12% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expense */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chi tháng này</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(financeStats?.monthlyExpense || 0)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600">+5% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(inventorySummary?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventorySummary?.totalProducts || 0} sản phẩm
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Profit & Alerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Profit Card */}
        <Card className={profit >= 0 ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-red-200 bg-red-50/50 dark:bg-red-950/20'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lợi nhuận tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Thu: {formatCurrency(financeStats?.monthlyIncome || 0)} - Chi: {formatCurrency(financeStats?.monthlyExpense || 0)}
            </p>
          </CardContent>
        </Card>

        {/* Supplier Debt */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Công nợ nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(financeStats?.totalSupplierDebt || 0)}
            </div>
            <Link href="/finance/supplier-debts">
              <Button variant="link" className="p-0 h-auto text-sm mt-2">
                Xem chi tiết →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Cảnh báo tồn kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sắp hết hàng</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  {inventorySummary?.lowStock || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hết hàng</span>
                <Badge variant="outline" className="bg-red-100 text-red-700">
                  {inventorySummary?.outOfStock || 0}
                </Badge>
              </div>
            </div>
            <Link href="/inventory?stockStatus=low_stock">
              <Button variant="link" className="p-0 h-auto text-sm mt-2">
                Xem danh sách →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/inventory/receipts/new">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span>Nhập kho</span>
                </Button>
              </Link>
              <Link href="/inventory/issues/new">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  <span>Xuất kho</span>
                </Button>
              </Link>
              <Link href="/finance/transactions/new?type=income">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Phiếu thu</span>
                </Button>
              </Link>
              <Link href="/finance/transactions/new?type=expense">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span>Phiếu chi</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Account Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Số dư tài khoản</CardTitle>
            <CardDescription>Các quỹ tiền hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            {financeStats?.accounts?.length ? (
              <div className="space-y-3">
                {financeStats.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        account.type === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <Wallet className={`h-5 w-5 ${
                          account.type === 'cash' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chưa có tài khoản nào</p>
                <Link href="/finance/accounts/new">
                  <Button variant="link" className="mt-2">
                    Tạo tài khoản đầu tiên
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}