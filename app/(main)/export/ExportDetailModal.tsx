"use client";

import React, { useState, useEffect } from "react";
import { ExportReceipt, ExportDetailItem } from "./type";
import { X } from "lucide-react";
import { api } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { useCashAccounts } from "@/hooks/use-finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ExportReceipt;
  detailItems: ExportDetailItem[];
  onWeightChange: (index: number, weight: number) => void;
  onSave: (newStatus: string, newTotal: number) => void;
}

const ExportDetailModal: React.FC<ExportDetailModalProps> = ({
  isOpen,
  onClose,
  receipt,
  detailItems,
  onWeightChange,
  onSave,
}) => {
  const [currentStatus, setCurrentStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    cashAccountId: "",
    collectionDate: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
  });
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const { data: cashAccounts = [] } = useCashAccounts();

  useEffect(() => {
    if (receipt) setCurrentStatus(receipt.tinhTrangThanhToan);
  }, [receipt]);

  useEffect(() => {
    if(cashAccounts)
    {
      const defaultAccount = cashAccounts.find(a => a.isDefault);
      setCollectionForm(
      {
        ...collectionForm,
        cashAccountId: defaultAccount?.id || "" 
      }
    );
    }
    
  }, [cashAccounts]);


  if (!isOpen) return null;

  const formatter = new Intl.NumberFormat("vi-VN");

  const totalAmount = detailItems.reduce(
    (sum, item) => sum + item.tongTrongLuong * item.donGia,
    0
  );

  const isTableEmpty = detailItems.length === 0;

  const handleUpdate = async () => {
    if (receipt) {
      const updatedStatus = "Đã thanh toán";
      try {
        setIsSaving(true);
        await api.patch(`/sales/${(receipt as any).id}/status`, {
          payment_status: updatedStatus,
          details: detailItems.map(item => ({
            id: (item as any).id,
            total_weight: Number(item.tongTrongLuong)
          }))
        });

        // Hiện dialog tạo phiếu thu
        setCollectionForm(prev => ({
          ...prev,
          amount: Number(totalAmount),
          description: `Thu tiền phiếu xuất ${receipt.dot}`,
          collectionDate: new Date().toISOString().split("T")[0],
        }));
        setShowCollectionDialog(true);
      } catch (error: any) {
        const message = error?.response?.data?.message;
        alert(`Lỗi: ${Array.isArray(message) ? message.join(", ") : message || "Không thể kết nối"}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCreateCollection = async () => {
    if (!collectionForm.cashAccountId) {
      alert("Vui lòng chọn tài khoản thu");
      return;
    }

    try {
      setIsCreatingCollection(true);
      await api.post("/api/finance/pig-sale-collections", {
        customerName: receipt.khachHang,
        pigShippingId: (receipt as any).id,
        cashAccountId: collectionForm.cashAccountId,
        collectionDate: collectionForm.collectionDate,
        amount: collectionForm.amount,
        description: collectionForm.description,
      });

      setShowCollectionDialog(false);
      onSave("Đã thanh toán", totalAmount);
    } catch (error: any) {
      alert(
        "Lỗi tạo phiếu thu: " +
          (error?.response?.data?.message || "Không thể kết nối")
      );
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleSkipCollection = () => {
    setShowCollectionDialog(false);
    onSave("Đã thanh toán", totalAmount);
  };

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-200 border border-gray-100">
        <div className="px-6 py-3 flex justify-between items-center border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-emerald-700">Chi tiết phiếu xuất chuồng</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-3">
          <div className="flex justify-between items-center mb-6 border-b pb-1 border-gray-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Thông tin</h2>
              {currentStatus !== "Đã thanh toán" && (
                <button
                  onClick={handleUpdate}
                  disabled={isTableEmpty || isSaving}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition shadow-md mb-1 ${
                    isTableEmpty || isSaving
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {isSaving && <Spinner className="h-4 w-4" />}
                  {isSaving ? "Đang lưu..." : "Xác nhận & Lưu"}
                </button>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Đợt xuất:</span>
              <span className="text-sm text-gray-800">{receipt.dot}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Khách hàng:</span>
              <span className="text-sm text-gray-800">{receipt.khachHang}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Ngày xuất:</span>
              <span className="text-sm text-gray-800">{new Date(receipt.ngayXuat).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Số điện thoại:</span>
              <span className="text-sm text-gray-800">{receipt.sdt || "Chưa có"}</span>
            </div>
            <div className="flex items-start gap-4 md:col-span-2">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32 shrink-0 pt-0.5">Địa chỉ:</span>
              <span className="text-sm text-gray-600 italic leading-relaxed">
                {receipt.diaChi || "Chưa cập nhật địa chỉ khách hàng"}
              </span>
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32 shrink-0">Tình trạng:</span>
              <span className={`text-sm font-semibold ${currentStatus === "Đã thanh toán" ? "text-emerald-600" : "text-orange-600"}`}>
                {currentStatus}
              </span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8 max-h-[300px] overflow-y-auto shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-emerald-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center w-16">STT</th>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center">Chuồng</th>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center">Tổng trọng lượng (kg)</th>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center">Đơn giá (VNĐ)</th>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {detailItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4 text-center text-gray-400 font-medium">{item.stt}</td>
                    <td className="px-6 py-4 text-center text-gray-800">{item.chuong}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        disabled={currentStatus === "Đã thanh toán"}
                        value={item.tongTrongLuong || ""}
                        placeholder="0"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          onWeightChange(index, value < 0 ? 0 : value);
                        }}
                        className={`w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-center outline-none font-bold shadow-inner ${currentStatus === "Đã thanh toán" ? "bg-gray-100 text-gray-400" : "focus:ring-2 focus:ring-emerald-500 text-emerald-700"}`}
                      />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-800">{formatter.format(item.donGia)}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{formatter.format(item.tongTrongLuong * item.donGia)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-2 border-t border-gray-50">
            <div className="flex items-baseline gap-3 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 shadow-sm">
              <span className="text-sm font-bold text-red-800 uppercase tracking-wider">Tổng tiền:</span>
              <span className="text-3xl font-black text-red-600">
                {formatter.format(totalAmount)}
                <span className="text-sm font-bold ml-1 uppercase">VNĐ</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Dialog tạo phiếu thu */}
    <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent className="max-w-md z-[70]">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu</DialogTitle>
            <DialogDescription>
              Đã xác nhận thanh toán thành công. Bạn có muốn tạo phiếu thu ngay không?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tài khoản thu */}
            <div className="space-y-2">
              <Label>Tài khoản thu *</Label>
              <Select
                value={collectionForm.cashAccountId}
                onValueChange={(value) =>
                  setCollectionForm((prev) => ({ ...prev, cashAccountId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  {cashAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ngày thu */}
            <div className="space-y-2">
              <Label>Ngày thu *</Label>
              <input
                type="date"
                value={collectionForm.collectionDate}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, collectionDate: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Số tiền */}
            <div className="space-y-2">
              <Label>Số tiền *</Label>
              <input
                type="number"
                value={collectionForm.amount}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, amount: Number(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                min="0"
              />
              <p className="text-xs text-gray-500">
                Tổng tiền phiếu xuất: {formatter.format(totalAmount)} VNĐ
              </p>
            </div>

            {/* Diễn giải */}
            <div className="space-y-2">
              <Label>Diễn giải</Label>
              <input
                type="text"
                value={collectionForm.description}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkipCollection}
              disabled={isCreatingCollection}
            >
              Bỏ qua
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={isCreatingCollection || !collectionForm.cashAccountId}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isCreatingCollection && <Spinner className="mr-2 h-4 w-4" />}
              {isCreatingCollection ? "Đang tạo..." : "Tạo phiếu thu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportDetailModal;
