"use client";

import React, { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";

interface TreatmentDetailProps {
  data: any;
  onBack: () => void;
}

interface TreatmentStep {
  id: number;
  date: string;
  medicine: string;
  dosage: string;
  status: string;
  checked?: boolean;
}

const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ data, onBack }) => {
  const [showPigList, setShowPigList] = useState(false);
  const [treatmentSteps, setTreatmentSteps] = useState<TreatmentStep[]>([
    { id: 1, date: "13/11/2025", medicine: "Amoxicillin + Gentamycin", dosage: "5cc/con + 2cc/con", status: "Giảm nhẹ", checked: false },
    { id: 2, date: "14/11/2025", medicine: "Amoxicillin + Gentamycin", dosage: "5cc/con + 2cc/con", status: "Giảm nhẹ", checked: false },
  ]);

  const pigs = [
    { id: 1, code: "00030001", status: "Giảm nhẹ" },
    { id: 2, code: "00030002", status: "Giảm nhẹ" },
    { id: 3, code: "00030003", status: "Giảm nhẹ" },
  ];

  const allChecked = treatmentSteps.length > 0 && treatmentSteps.every((step) => step.checked);

  const toggleAll = (checked: boolean) => {
    setTreatmentSteps(treatmentSteps.map(s => ({ ...s, checked })));
  };

  const toggleOne = (index: number, checked: boolean) => {
    const newSteps = [...treatmentSteps];
    newSteps[index].checked = checked;
    setTreatmentSteps(newSteps);
  };

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full transition hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-emerald-600" />
        </button>
        <h1 className="text-2xl font-semibold text-[var(--color-secondary-foreground)]">Chi tiết điều trị</h1>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b pb-1 border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Thông tin</h2>
          <div 
            className="text-sm text-gray-500 cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={() => setShowPigList(!showPigList)}
          >
            {showPigList ? "Đóng danh sách heo" : "Danh sách heo điều trị"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-5 transition-all duration-300">
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Chuồng</label>
              <div className="text-sm text-gray-800">{data?.chuong || "C001"}</div>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số lượng</label>
              <div className="text-sm text-gray-800">{data?.soLuong || 20} con</div>
            </div>
            {showPigList && (
              <>
                <div className="flex items-center">
                  <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày phát bệnh</label>
                  <div className="text-sm text-gray-800">{data?.ngayPhatHien || "11/11/2025"}</div>
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại bệnh</label>
                  <div className="text-sm text-gray-800">Dịch tả heo Châu Phi</div>
                </div>
              </>
            )}
            <div className="flex items-baseline">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Triệu chứng</label>
              <div className="flex-1 text-sm text-gray-800 ">Bỏ ăn, sốt cao, phân lỏng có bọt</div>
            </div>
          </div>

          <div className="transition-all duration-300">
            {!showPigList ? (
              <div className="space-y-5">
                <div className="flex items-center">
                  <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày phát bệnh</label>
                  <div className="text-sm text-gray-800">11/11/2025</div>
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại bệnh</label>
                  <div className="text-sm text-gray-800">Dịch tả heo Châu Phi</div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm outline-none w-32 focus:w-44 transition-all" placeholder="Tìm kiếm..." />
                  </div>
                  <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-md text-xs font-medium">Chuyển chuồng</button>
                  <button className="px-3 py-1.5 border border-red-500 text-red-500 rounded-md text-xs font-medium">Báo chết</button>
                </div>
                <table className="w-full text-sm text-center">
                  <thead className="text-emerald-600 border-b border-emerald-50">
                    <tr>
                      <th className="pb-3"><input type="checkbox" checked readOnly className="h-4 w-4 accent-emerald-600" /></th>
                      <th className="pb-3 font-semibold">STT</th>
                      <th className="pb-3 font-semibold">Mã số</th>
                      <th className="pb-3 font-semibold text-right">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-gray-100">
                    {pigs.map((p, i) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3"><input type="checkbox" checked readOnly className="h-4 w-4 accent-emerald-600" /></td>
                        <td className="py-3 text-gray-500">{i + 1}</td>
                        <td className="py-3 font-medium text-gray-800">{p.code}</td>
                        <td className="py-3 text-right italic text-emerald-700">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Theo dõi điều trị</h2>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-md">Lưu</button>
            <button className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">Thêm</button>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-md">Xoá</button>
          </div>
        </div>
        <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="w-[50px] px-6 py-4 text-center">
                  <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-emerald-600 cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-center font-semibold">STT</th>
                <th className="px-6 py-4 text-center font-semibold">Ngày</th>
                <th className="px-6 py-4 text-center font-semibold">Thuốc sử dụng</th>
                <th className="px-6 py-4 text-center font-semibold">Liều lượng</th>
                <th className="px-6 py-4 text-center font-semibold">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {treatmentSteps.map((step, index) => (
                <tr key={step.id} className="hover:bg-gray-100/50 transition">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={step.checked} onChange={(e) => toggleOne(index, e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-emerald-600 cursor-pointer" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-center">{step.date}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">{step.medicine}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{step.dosage}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{step.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;