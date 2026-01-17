// =====================================================
// INVENTORY HISTORY PAGE - Lịch sử xuất nhập kho
// =====================================================

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { 
  useInventoryHistory, 
  useWarehouses,
  useProducts,
} from '@/hooks/use-inventory';
import { formatCurrency, formatNumber, cn } from '@/lib/utils';
import { HistoryTransactionType, HistoryReferenceType } from '@/types/inventory';

const FARM_ID = 'demo-farm-id';

const transactionTypeLabels: Record<HistoryTransactionType, { label: string; color: string; icon: any }> = {
  [HistoryTransactionType.IN]: { label: 'Nhập kho', color: 'bg-green-500', icon: ArrowDownCircle },
  [HistoryTransactionType.OUT]: { label: 'Xuất kho', color: 'bg-red-500', icon: ArrowUpCircle },
  [HistoryTransactionType.ADJUSTMENT]: { label: 'Điều chỉnh', color: 'bg-yellow-500', icon: RefreshCw },
};

const referenceTypeLabels: Record<string, string> = {
  receipt: 'Phiếu nhập',
  issue: 'Phiếu xuất',
  adjustment: 'Điều chỉnh',
  transfer: 'Chuyển kho',
  check: 'Kiểm kê',
};

export default function InventoryHistoryPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: warehouses } = useWarehouses();
  const { data: productsData } = useProducts({  limit: 100 });
  const { data: history, isLoading } = useInventoryHistory({
    // farmId: 
    warehouseId: selectedWarehouse !== 'all' ? selectedWarehouse : undefined,
    productId: selectedProduct !== 'all' ? selectedProduct : undefined,
    transactionType: transactionType !== 'all' ? transactionType as HistoryTransactionType : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    limit: 20,
  });

  const handleClearFilters = () => {
    setSelectedWarehouse('all');
    setSelectedProduct('all');
    setTransactionType('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb
        items={[
          { label: 'Quản lý Kho', href: '/inventory' },
          { label: 'Lịch sử kho' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử xuất nhập kho</h1>
          <p className="text-muted-foreground">
            Theo dõi tất cả biến động tồn kho
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kho</SelectItem>
                {warehouses?.map((w) => (
                  <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                {productsData?.data?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="in">Nhập kho</SelectItem>
                <SelectItem value="out">Xuất kho</SelectItem>
                <SelectItem value="adjustment">Điều chỉnh</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                placeholder="Từ ngày"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                placeholder="Đến ngày"
              />
            </div>

            <Button variant="outline" onClick={handleClearFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Xóa lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử giao dịch
          </CardTitle>
          <CardDescription>
            {history?.total || 0} giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-right">Trước</TableHead>
                  <TableHead className="text-right">Thay đổi</TableHead>
                  <TableHead className="text-right">Sau</TableHead>
                  <TableHead className="text-right">Giá trị</TableHead>
                  <TableHead>Chứng từ</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !history?.data?.length ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  history.data.map((item) => {
                    const typeInfo = transactionTypeLabels[item.transactionType];
                    const TypeIcon = typeInfo?.icon || History;
                    const isPositive = item.quantityChange > 0;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            <p className="font-medium">
                              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('text-white', typeInfo?.color)}>
                            <TypeIcon className="mr-1 h-3 w-3" />
                            {typeInfo?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.warehouse?.name || '-'}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.product?.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.quantityBefore)}
                        </TableCell>
                        <TableCell className={cn(
                          'text-right font-medium',
                          isPositive ? 'text-green-600' : 'text-red-600'
                        )}>
                          {isPositive ? '+' : ''}{formatNumber(item.quantityChange)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(item.quantityAfter)}
                        </TableCell>
                        <TableCell className={cn(
                          'text-right',
                          isPositive ? 'text-green-600' : 'text-red-600'
                        )}>
                          {isPositive ? '+' : ''}{formatCurrency(item.totalCost)}
                        </TableCell>
                        <TableCell>
                          {item.referenceType && (
                            <Badge variant="outline">
                              {referenceTypeLabels[item.referenceType] || item.referenceType}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.notes || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {history && history.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Trang {page} / {history.totalPages} ({history.total} giao dịch)
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
                  onClick={() => setPage((p) => Math.min(history.totalPages, p + 1))}
                  disabled={page === history.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}