"use client";

import React, { useState } from "react";
import { X, ChevronLeft, Save, Trash2 } from "lucide-react";

interface CageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cageData: {
    chuong: string;
    giong: string;
    soLuong: number;
  };
}

const CageDetailModal: React.FC<CageDetailModalProps> = ({ isOpen, onClose, cageData }) => {
  if (!isOpen) return null;

  const [details, setDetails] = useState([
    { stt: 1, maSo: "00030001", checked: true },
    { stt: 2, maSo: "00030002", checked: true },
    { stt: 3, maSo: "00030003", checked: true },
    { stt: 4, maSo: "00030004", checked: false },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const hasSelectedItems = details.some((item) => item.checked);
  const isTableEmpty = details.length === 0;

  const isAllSelected = details.length > 0 && details.every((item) => item.checked);

  const handleSelectAll = () => {
    const newValue = !isAllSelected;
    setDetails(details.map((item) => ({ ...item, checked: newValue })));
  };

  const handleSelectRow = (stt: number) => {
    setDetails(
      details.map((item) =>
        item.stt === stt ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteSelected = () => {
    const remaining = details.filter((item) => !item.checked);
    setDetails(remaining.map((item, index) => ({ ...item, stt: index + 1 })));
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in duration-200 border border-gray-100">
        
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-emerald-700">Chi tiết chuồng xuất</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="animate-in slide-in-from-left duration-500">
            <div className="flex justify-between items-center mb-6 border-b pb-1 border-gray-200 h-[45px]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Thông tin chuồng
              </h2>
            </div>
            
            <div className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Chuồng:</span>
                  <span className="text-sm text-gray-800">
                    {cageData.chuong || "A001"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Giống:</span>
                  <span className="text-sm text-gray-800">
                    {cageData.giong || "Landrace"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Số lượng:</span>
                  <span className="text-sm text-gray-800">
                    {cageData.soLuong || 13}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-6 border-b pb-1 border-gray-200 h-[45px]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Chi tiết mã số
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  disabled={isTableEmpty}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md ${
                    isTableEmpty
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                  }`}
                >
                  Lưu
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-md active:scale-95"
                >
                  Xóa
                </button>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-emerald-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-center w-16">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer transition" 
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 font-bold text-emerald-700 text-center uppercase tracking-wider">STT</th>
                    <th className="px-6 py-4 font-bold text-emerald-700 text-center tracking-wider">Mã số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {details.length > 0 ? (
                    details.map((row) => (
                      <tr key={row.stt} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={row.checked} 
                            onChange={() => handleSelectRow(row.stt)}
                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400 font-medium">{row.stt}</td>
                        <td className="px-6 py-4 text-center text-gray-800 group-hover:text-emerald-600 transition-colors">
                          {row.maSo}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">
                        Danh sách heo rỗng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              {hasSelectedItems ? "Xác nhận xóa" : "Thông báo"}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {hasSelectedItems
                ? "Các mã số đã chọn sẽ bị loại khỏi danh sách này. Bạn có chắc không?"
                : "Vui lòng chọn ít nhất một mã số để thực hiện xóa."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700"
              >
                {hasSelectedItems ? "Hủy" : "Đã hiểu"}
              </button>
              {hasSelectedItems && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow-lg shadow-red-200"
                >
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CageDetailModal;