// =====================================================
// INVENTORY PAGE - app/(dashboard)/inventory/page.tsx
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Warehouse,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  FileDown,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Layers,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageBreadcrumb, BREADCRUMB_CONFIGS } from '@/components/page-breadcrumb';
import { InventoryBatchDetail } from '@/components/inventory/inventory-batch-detail';
import {
  useInventorySummary,
  useInventory,
  useWarehouses,
  useWarehouseCategories,
  useExpirySummary,
} from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { StockStatus, Inventory } from '@/types/inventory';

// const  = 'demo-farm-id';

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('stockStatus') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatus, setStockStatus] = useState<string>(initialStatus);
  const [page, setPage] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [batchDetailOpen, setBatchDetailOpen] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useInventorySummary();
  const { data: expirySummary } = useExpirySummary();
  const { data: warehouses } = useWarehouses();
  const { data: categories } = useWarehouseCategories();
  const { data: inventory, isLoading: inventoryLoading } = useInventory({
    // farmId: ,
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined,
    stockStatus: stockStatus as any,
    page,
    limit: 20,
  });

  const handleViewBatches = (item: Inventory) => {
    setSelectedInventory(item);
    setBatchDetailOpen(true);
  };

  const getStockStatusBadge = (quantity: number, minQuantity: number) => {
    if (quantity <= 0) {
      return <Badge className="badge-danger">Hết hàng</Badge>;
    }
    if (quantity <= minQuantity) {
      return <Badge className="badge-warning">Sắp hết</Badge>;
    }
    return <Badge className="badge-success">Còn hàng</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <PageBreadcrumb items={BREADCRUMB_CONFIGS.inventory} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Kho</h1>
          <p className="text-muted-foreground">
            Theo dõi tồn kho và các hoạt động xuất nhập
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Xuất Excel
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 stagger-children">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm trong kho</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng giá trị</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary?.lowStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary?.outOfStock || 0}
            </div>
            <p className="text-xs text-muted-foreground">Cần bổ sung ngay</p>
          </CardContent>
        </Card>

        {/* Expiry Alert Card */}
        <Link href="/inventory/expiry">
          <Card className={cn(
            "card-hover cursor-pointer transition-all",
            (expirySummary?.expiredCount || 0) + (expirySummary?.criticalCount || 0) > 0
              ? "border-orange-200 bg-orange-50/50 dark:bg-orange-950/20"
              : "border-green-200 bg-green-50/50 dark:bg-green-950/20"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hạn sử dụng</CardTitle>
              <Clock className={cn(
                "h-4 w-4",
                (expirySummary?.expiredCount || 0) + (expirySummary?.criticalCount || 0) > 0
                  ? "text-orange-500"
                  : "text-green-500"
              )} />
            </CardHeader>
            <CardContent>
              {(expirySummary?.expiredCount || 0) + (expirySummary?.criticalCount || 0) > 0 ? (
                <>
                  <div className="text-2xl font-bold text-orange-600">
                    {(expirySummary?.expiredCount || 0) + (expirySummary?.criticalCount || 0)} lô
                  </div>
                  <p className="text-xs text-orange-600">
                    {expirySummary?.expiredCount || 0} hết hạn, {expirySummary?.criticalCount || 0} sắp hết
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">Tốt</div>
                  <p className="text-xs text-green-600">Không có cảnh báo</p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

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
              <SelectTrigger className="w-full md:w-[180px]">
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockStatus} onValueChange={setStockStatus}>
              <SelectTrigger className="w-full md:w-[160px]">
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
          <div className="rounded-md border">
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : inventory?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Không có dữ liệu</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory?.data?.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-mono text-sm">
                        {item.product?.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product?.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.product?.category?.name || '-'}
                      </TableCell>
                      <TableCell>{item.warehouse?.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(item.quantity)}{' '}
                        <span className="text-muted-foreground text-xs">
                          {item.product?.unit?.abbreviation}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.avgCost)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.quantity * item.avgCost)}
                      </TableCell>
                      <TableCell>
                        {getStockStatusBadge(
                          item.quantity,
                          item.product?.minQuantity || 0
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewBatches(item)}>
                              <Layers className="mr-2 h-4 w-4" />
                              Xem lô hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Lịch sử giao dịch
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

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

      {/* Batch Detail Dialog */}
      <InventoryBatchDetail
        open={batchDetailOpen}
        onClose={() => {
          setBatchDetailOpen(false);
          setSelectedInventory(null);
        }}
        inventory={selectedInventory}
      />
    </div>
  );
}