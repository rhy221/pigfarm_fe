// =====================================================
// INVENTORY DASHBOARD PAGE
// =====================================================

'use client';

import { useState } from 'react';
import { useInventorySummary, useInventory, useWarehouses } from '@/hooks/use-inventory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  Warehouse, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Plus,
  FileDown,
  Filter
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import Link from 'next/link';

interface InventoryDashboardProps {
  farmId: string;
}

export default function InventoryDashboard({ farmId }: InventoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: summary, isLoading: summaryLoading } = useInventorySummary(farmId);
  const { data: warehouses } = useWarehouses(farmId);
  const { data: inventory, isLoading: inventoryLoading } = useInventory({
    farmId,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    search: searchTerm || undefined,
    stockStatus: stockStatus as any,
    page,
    limit: 20,
  });

  const getStockStatusBadge = (quantity: number, minQuantity: number) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Hết hàng</Badge>;
    }
    if (quantity <= minQuantity) {
      return <Badge 
    //   variant="warning" 
      className="bg-yellow-500">Sắp hết</Badge>;
    }
    return <Badge 
    // variant="success" 
    className="bg-green-500">Còn hàng</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý kho</h1>
          <p className="text-muted-foreground">Theo dõi tồn kho và các hoạt động xuất nhập</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Link href="/inventory/receipts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nhập kho
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm trong kho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalValue || 0)}</div>
            <p className="text-xs text-muted-foreground">Tổng giá trị</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary?.lowStock || 0}</div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.outOfStock || 0}</div>
            <p className="text-xs text-muted-foreground">Cần bổ sung ngay</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="receipts">Phiếu nhập</TabsTrigger>
          <TabsTrigger value="issues">Phiếu xuất</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kho</SelectItem>
                    {warehouses?.map((wh) => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockStatus} onValueChange={setStockStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="in_stock">Còn hàng</SelectItem>
                    <SelectItem value="low_stock">Sắp hết</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tồn kho</CardTitle>
              <CardDescription>
                Hiển thị {inventory?.data?.length || 0} / {inventory?.total || 0} sản phẩm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Kho</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead className="text-right">Đơn giá TB</TableHead>
                    <TableHead className="text-right">Giá trị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : inventory?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory?.data?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.product?.code}</TableCell>
                        <TableCell className="font-medium">{item.product?.name}</TableCell>
                        <TableCell>{item.product?.category?.name || '-'}</TableCell>
                        <TableCell>{item.warehouse?.name}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.quantity)} {item.product?.unit?.abbreviation}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.avgCost)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.quantity * item.avgCost)}
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(item.quantity, item.product?.minQuantity || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {inventory && inventory.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {page} / {inventory.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(inventory.totalPages, p + 1))}
                      disabled={page === inventory.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts">
          <StockReceiptsList farmId={farmId} />
        </TabsContent>

        <TabsContent value="issues">
          <StockIssuesList farmId={farmId} />
        </TabsContent>

        <TabsContent value="history">
          <InventoryHistoryList farmId={farmId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components
function StockReceiptsList({ farmId }: { farmId: string }) {
  // Implementation for stock receipts list
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phiếu nhập kho</CardTitle>
            <CardDescription>Danh sách các phiếu nhập kho</CardDescription>
          </div>
          <Link href="/inventory/receipts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo phiếu nhập
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {/* Receipt table will be implemented */}
        <p className="text-muted-foreground text-center py-8">
          Xem component StockReceiptForm để tạo phiếu nhập
        </p>
      </CardContent>
    </Card>
  );
}

function StockIssuesList({ farmId }: { farmId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phiếu xuất kho</CardTitle>
            <CardDescription>Danh sách các phiếu xuất kho</CardDescription>
          </div>
          <Link href="/inventory/issues/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo phiếu xuất
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Xem component StockIssueForm để tạo phiếu xuất
        </p>
      </CardContent>
    </Card>
  );
}

function InventoryHistoryList({ farmId }: { farmId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử xuất nhập kho</CardTitle>
        <CardDescription>Theo dõi các hoạt động xuất nhập kho</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Lịch sử sẽ được hiển thị ở đây
        </p>
      </CardContent>
    </Card>
  );
}