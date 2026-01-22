"use client";

import React, { useState, useEffect } from "react";
import { ExportReceipt, ExportDetailItem } from "./type";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

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

  useEffect(() => {
    if (receipt) setCurrentStatus(receipt.tinhTrangThanhToan);
  }, [receipt]);

  if (!isOpen) return null;

  const formatter = new Intl.NumberFormat("vi-VN");

  const totalAmount = detailItems.reduce(
    (sum, item) => sum + item.tongTrongLuong * item.donGia,
    0
  );

  const isTableEmpty = detailItems.length === 0;

  const handleUpdate = async () => {
    if (receipt) {
      try {
        setIsSaving(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/${(receipt as any).id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_status: currentStatus,
            details: detailItems.map(item => ({
              id: (item as any).id,
              total_weight: Number(item.tongTrongLuong)
            }))
          }),
        });

        if (response.ok) {
          onSave(currentStatus, totalAmount);
        } else {
          alert("Lỗi cập nhật trạng thái");
        }
      } catch (error) {
        alert("Không thể kết nối đến máy chủ");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
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
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
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
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm text-gray-700 min-w-[240px]"
              >
                <option value="Chuẩn bị xuất chuồng">Chuẩn bị xuất chuồng</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Chưa thanh toán">Chưa thanh toán</option>
              </select>
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
                        value={item.tongTrongLuong || ""}
                        placeholder="0"
                        onChange={(e) => onWeightChange(index, Number(e.target.value))}
                        className="w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-center focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700 shadow-inner"
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
  );
};

export default ExportDetailModal;