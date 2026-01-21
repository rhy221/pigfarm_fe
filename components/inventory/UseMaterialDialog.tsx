// components/inventory/UseMaterialDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Material, UseMaterialDto } from '@/schemas/inventory.schema';
import inventoryService from '@/apis/inventory.api';

interface UseMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material;
  onSuccess: () => void;
}

export default function UseMaterialDialog({
  open,
  onOpenChange,
  material,
  onSuccess
}: UseMaterialDialogProps) {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || parseInt(quantity) <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    if (parseInt(quantity) > material.totalStock) {
      alert('Số lượng sử dụng vượt quá tồn kho');
      return;
    }

    try {
      setLoading(true);
      const dto: UseMaterialDto = {
        materialId: material.id,
        quantity: parseInt(quantity)
      };

      await inventoryService.useMaterial(dto);
      
      setQuantity('');
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi sử dụng vật tư:', error);
      alert('Có lỗi xảy ra khi sử dụng vật tư');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nhập số lượng đã dùng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Số lượng</Label>
            <Input
              type="number"
              placeholder="8"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={material.totalStock}
            />
            <div className="text-sm text-gray-500">
              Tồn kho: {material.totalStock} {material.unit}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}