// components/inventory/ExpiredMaterialsDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { MaterialBatch } from '@/schemas/inventory.schema';

interface ExpiredMaterialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expiredBatches: MaterialBatch[];
}

export default function ExpiredMaterialsDialog({
  open,
  onOpenChange,
  expiredBatches
}: ExpiredMaterialsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Bồ lương 50 lương
          </div>

          <div>
            <h3 className="font-semibold mb-2">Bí hết</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Vật tư</TableHead>
                  <TableHead className="text-right">Số lượng tồn</TableHead>
                  <TableHead className="text-right">Ngày hết hạn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      Không có vật tư hết hạn
                    </TableCell>
                  </TableRow>
                ) : (
                  expiredBatches.map((batch, index) => (
                    <TableRow key={batch.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{batch.material?.name || 'N/A'}</TableCell>
                      <TableCell className="text-right">{batch.remainQuantity}</TableCell>
                      <TableCell className="text-right">
                        {batch.expiryDate ? format(new Date(batch.expiryDate), 'dd/MM/yyyy') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Chỉ ý hết hạn</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Vật tư</TableHead>
                  <TableHead className="text-right">Số lượng tồn</TableHead>
                  <TableHead className="text-right">Ngày hết hạn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Thức ăn cho heo con</TableCell>
                  <TableCell className="text-right">16</TableCell>
                  <TableCell className="text-right text-red-600">
                    30/11/2025
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Cầm hổi</TableCell>
                  <TableCell className="text-right">13</TableCell>
                  <TableCell className="text-right text-red-600">
                    26/11/2025
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="link" className="text-blue-600">
              Chỉ ý hết hạn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}