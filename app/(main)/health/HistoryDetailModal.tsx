"use client";

import React from "react";
import { X } from "lucide-react";

interface HistoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    chuong: string;
    ngayPhatHien: string;
    soLuong: number;
    loaiBenh: string;
    symptom?: string; 
    treatment_logs?: any[]; 
    pigs_in_treatment?: any[]; 
  } | null;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const logs = data.treatment_logs || [];
  const pigsInTreatment = data.pigs_in_treatment || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in duration-200 border-[3px] border-blue-400 max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center px-10 py-6 shrink-0">
          <h2 className="text-2xl font-bold text-emerald-700">Lịch sử điều trị</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} className="text-gray-400" />
          </button>
        </div>

        <div className="px-10 pb-10 overflow-y-auto">
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
                <span className="text-gray-800">{data.soLuong} con</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại bệnh</span>
                <span className="text-gray-800">{data.loaiBenh}</span>
              </div>
              <div className="flex items-start col-span-2 mt-2">
                <span className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Triệu chứng</span>
                <span className="text-gray-800 flex-1 leading-relaxed">
                  {data.symptom || "Không có ghi chú triệu chứng"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-4">
              Danh sách heo điều trị
            </h3>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {pigsInTreatment.length > 0 ? (
                pigsInTreatment.map((item, index) => (
                  <div key={item.id || index} className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-700 shadow-sm">
                    {item.pigs?.ear_tag_number || item.pig_id?.slice(0, 8).toUpperCase()}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 italic text-sm">Không có dữ liệu heo cụ thể</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-6">
              Nhật ký điều trị thực tế
            </h3>
            <div className="overflow-hidden border border-emerald-50 rounded-2xl shadow-sm">
              <table className="w-full text-[14px]">
                <thead className="bg-emerald-50/50 sticky top-0">
                  <tr className="text-[#53A88B] font-bold">
                    <th className="py-4 px-4 text-center w-16">STT</th>
                    <th className="py-4 px-4 text-center">Ngày</th>
                    <th className="py-4 px-4 text-center">Thuốc sử dụng</th>
                    <th className="py-4 px-4 text-center">Liều lượng</th>
                    <th className="py-4 px-4 text-center">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-gray-200">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={log.id || index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 text-center text-gray-500">{index + 1}</td>
                        <td className="py-5 px-4 text-center text-gray-700">
                          {new Date(log.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-5 px-4 text-center text-gray-700 font-medium">
                          {log.medicine || "—"}
                        </td>
                        <td className="py-5 px-4 text-center text-gray-700">
                          {log.dosage || "—"}
                        </td>
                        <td className="py-5 px-4 text-center text-gray-700">
                          {log.condition || "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                        Chưa có nhật ký điều trị cho ca này.
                      </td>
                    </tr>
                  )}
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
