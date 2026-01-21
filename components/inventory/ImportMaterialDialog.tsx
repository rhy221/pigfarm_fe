// components/inventory/ImportMaterialDialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ImportMaterialDto, Material } from '@/schemas/inventory.schema';
import inventoryService from '@/apis/inventory.api';

interface ImportMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: Material[];
  onSuccess: () => void;
}

export default function ImportMaterialDialog({
  open,
  onOpenChange,
  materials,
  onSuccess
}: ImportMaterialDialogProps) {
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: '',
    unitPrice: '',
    importDate: new Date(),
    expiryDate: undefined as Date | undefined,
    supplier: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.materialId || !formData.quantity || !formData.unitPrice) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setLoading(true);
      const dto: ImportMaterialDto = {
        materialId: formData.materialId,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        importDate: formData.importDate.toISOString(),
        expiryDate: formData.expiryDate?.toISOString(),
        supplier: formData.supplier || undefined,
        note: formData.note || undefined
      };

      await inventoryService.importMaterial(dto);
      
      setFormData({
        materialId: '',
        quantity: '',
        unitPrice: '',
        importDate: new Date(),
        expiryDate: undefined,
        supplier: '',
        note: ''
      });
      
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi nhập kho:', error);
      alert('Có lỗi xảy ra khi nhập kho');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Phiếu nhập vật tư mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên vật tư *</Label>
              <Select
                value={formData.materialId}
                onValueChange={(value) => setFormData({ ...formData, materialId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vật tư" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chất quản chương *</Label>
              <Input
                placeholder="Nhập chất quản chương"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Loại vật tư</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Vật tiêu vỗ sản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumable">Vật tiêu vỗ sản</SelectItem>
                  <SelectItem value="medicine">Thuốc</SelectItem>
                  <SelectItem value="food">Thức ăn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hạn sử dụng</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Ngày nhập *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.importDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.importDate}
                    onSelect={(date) => date && setFormData({ ...formData, importDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Đơn giá *</Label>
              <Input
                type="number"
                placeholder="55000"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Số lượng nhập *</Label>
              <Input
                type="number"
                placeholder="24"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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