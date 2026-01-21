"use client";

import React from "react";
import { X } from "lucide-react";

interface DeathReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRemovePig: (id: string) => void; 
  selectedPigs: { id: string; code: string }[]; 
}

const DeathReportModal: React.FC<DeathReportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onRemovePig,
  selectedPigs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-6 tracking-tight">Xác nhận báo chết</h2>

        <div className="space-y-6">
          <p className="italic text-sm text-gray-600">
            Xác nhận báo chết cho các mã heo dưới đây. Hệ thống sẽ ngay lập tức loại bỏ các cá thể này khỏi toàn bộ danh sách nghiệp vụ chăn nuôi và đưa vào hồ sơ lưu trữ.
          </p>

          <div className="flex items-start gap-4">
            <label className="w-32 text-sm font-semibold text-red-600 mt-1">
              Danh sách heo
            </label>
            <div className="flex flex-wrap gap-2 flex-1 max-h-40 overflow-y-auto p-1">
              {selectedPigs.map((pig) => (
                <div
                  key={pig.id}
                  className="flex items-center gap-2 px-3 py-1.5 border border-red-100 rounded-lg bg-red-50/30 text-red-800 text-sm"
                >
                  {pig.code}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => onRemovePig(pig.id)}
                  />
                </div>
              ))}
              {selectedPigs.length === 0 && (
                <span className="text-sm text-gray-400 italic">Chưa chọn heo nào...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button
            onClick={onConfirm}
            disabled={selectedPigs.length === 0}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition shadow-md active:scale-95 ${
              selectedPigs.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Xác nhận
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeathReportModal;