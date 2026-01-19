// app/inventory/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Material } from '@/schemas/inventory.schema';
import inventoryService from '@/apis/inventory.api';
import UseMaterialDialog from '@/components/inventory/UseMaterialDialog';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const materialId = params.id as string;
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUseDialog, setShowUseDialog] = useState(false);

  useEffect(() => {
    loadMaterialDetail();
  }, [materialId]);

  const loadMaterialDetail = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getMaterialDetail(materialId);
      setMaterial(data);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết vật tư:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseSuccess = () => {
    setShowUseDialog(false);
    loadMaterialDetail();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Không tìm thấy vật tư</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chi tiết vật tư</h1>
          <Button
            onClick={() => setShowUseDialog(true)}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Minus className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Tên vật tư</div>
            <div className="font-semibold">{material.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Loại</div>
            <div className="font-semibold">{material.type}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Đơn vị</div>
            <div className="font-semibold">{material.unit}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Tồn kho</div>
            <div className="font-semibold text-emerald-600">{material.totalStock}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Lịch sử nhập kho</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Lần nhập</TableHead>
              <TableHead className="text-right">Số lượng nhập</TableHead>
              <TableHead className="text-right">Ngày sử dụng</TableHead>
              <TableHead className="text-right">Số lượng đã dùng</TableHead>
              <TableHead className="text-right">Số lượng tồn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!material.batches || material.batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Chưa có lịch sử nhập kho
                </TableCell>
              </TableRow>
            ) : (
              material.batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.batchNumber}</TableCell>
                  <TableCell className="text-right">{batch.quantity}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(batch.importDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">{batch.usedQuantity}</TableCell>
                  <TableCell className="text-right">
                    {batch.remainQuantity > 0 ? (
                      <span className="text-emerald-600">{batch.remainQuantity}</span>
                    ) : (
                      <span className="text-red-600">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UseMaterialDialog
        open={showUseDialog}
        onOpenChange={setShowUseDialog}
        material={material}
        onSuccess={handleUseSuccess}
      />
    </div>
  );
}