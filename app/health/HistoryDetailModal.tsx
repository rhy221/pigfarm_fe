"use client";

import React from "react";
import { X } from "lucide-react";

interface TreatmentStep {
  stt: number;
  ngay: string;
  thuoc: string;
  lieuLuong: string;
  tinhTrang: string;
}

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    chuong: string;
    ngayPhatHien: string;
    soLuong: number;
    loaiBenh: string;
    trieuChung?: string;
  } | null;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const treatmentHistory: TreatmentStep[] = [
    { 
        stt: 1, 
        ngay: "13/11/2025", 
        thuoc: "Amoxicillin + Gentamycin", 
        lieuLuong: "5cc/con + 2cc/con", 
        tinhTrang: "Giảm nhẹ" 
    },
    { 
        stt: 2, 
        ngay: "14/11/2025", 
        thuoc: "Amoxicillin + Gentamycin", 
        lieuLuong: "5cc/con + 2cc/con", 
        tinhTrang: "Giảm nhẹ" 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in duration-200 border-[3px] border-blue-400">
        
        <div className="flex justify-between items-center px-10 py-6">
          <h2 className="text-2xl font-bold text-emerald-700">Lịch sử điều trị</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} className="text-gray-400" />
          </button>
        </div>

        <div className="px-10 pb-10">
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-6">
              Thông tin
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[15px]">
              <div className="flex items-center">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Chuồng</span>
                <span className="text-gray-800">{data.chuong}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày phát bệnh</span>
                <span className="text-gray-800">{data.ngayPhatHien}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số lượng</span>
                <span className="text-gray-800">{data.soLuong}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại bệnh</span>
                <span className="text-gray-800">{data.loaiBenh}</span>
              </div>
              <div className="flex items-start col-span-2 mt-2">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Triệu chứng</span>
                <span className="text-gray-800 flex-1 leading-relaxed">
                  {data.trieuChung || "Bỏ ăn, sốt cao, phân lỏng có bọt"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-6">
              Nhật ký điều trị
            </h3>
            <div className="overflow-hidden border border-emerald-50 rounded-2xl">
              <table className="w-full text-[14px]">
                <thead className="bg-emerald-50/50">
                  <tr className="text-[#53A88B] font-bold">
                    <th className="py-4 px-4 text-center">STT</th>
                    <th className="py-4 px-4 text-center">Ngày</th>
                    <th className="py-4 px-4 text-center">Thuốc sử dụng</th>
                    <th className="py-4 px-4 text-center">Liều lượng</th>
                    <th className="py-4 px-4 text-center">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-gray-200">
                  {treatmentHistory.map((step) => (
                    <tr key={step.stt} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-4 text-center text-gray-500">{step.stt}</td>
                      <td className="py-5 px-4 text-center text-gray-700">{step.ngay}</td>
                      <td className="py-5 px-4 text-center text-gray-700 font-medium">{step.thuoc}</td>
                      <td className="py-5 px-4 text-center text-gray-700">{step.lieuLuong}</td>
                      <td className="py-5 px-4 text-center text-gray-700">{step.tinhTrang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailModal;