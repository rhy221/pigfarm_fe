"use client";

import React, { useState } from "react";
import { ChevronLeft, Search, ChevronRight, ChevronLeft as ChevronLeftIcon } from "lucide-react";
import TransferPigModal from "./TransferPigModal"; 
import DeathReportModal from "./DeathReportModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [treatmentSteps, setTreatmentSteps] = useState<TreatmentStep[]>([
    { id: 1, date: "13/11/2025", medicine: "Amoxicillin + Gentamycin", dosage: "5cc/con + 2cc/con", status: "Giảm nhẹ", checked: false },
    { id: 2, date: "14/11/2025", medicine: "Amoxicillin + Gentamycin", dosage: "5cc/con + 2cc/con", status: "Giảm nhẹ", checked: false },
  ]);

  const [pigs, setPigs] = useState([
    { id: 1, code: "00030001", checked: false },
    { id: 2, code: "00030002", checked: false },
    { id: 3, code: "00030003", checked: false },
    { id: 4, code: "00030004", checked: false },
    { id: 5, code: "00030005", checked: false },
    { id: 6, code: "00030006", checked: false },
    { id: 7, code: "00030007", checked: false },
    { id: 8, code: "00030008", checked: false },
    { id: 9, code: "00030009", checked: false },
    { id: 10, code: "00030010", checked: false },
    { id: 11, code: "00030011", checked: false },
    { id: 12, code: "00030012", checked: false },
  ]);

  const selectedPigs = pigs.filter(p => p.checked);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPigs = pigs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pigs.length / itemsPerPage);

  const handleRemovePigFromSelection = (id: number) => {
    setPigs(pigs.map(p => p.id === id ? { ...p, checked: false } : p));
  };

  const handleConfirmTransfer = (targetBarn: string) => {
    setPigs(pigs.filter(p => !p.checked));
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const allPigsInPageChecked = currentPigs.length > 0 && currentPigs.every((p) => p.checked);

  const toggleAllPigsInPage = (checked: boolean) => {
    const currentIds = currentPigs.map(p => p.id);
    setPigs(pigs.map(p => currentIds.includes(p.id) ? { ...p, checked } : p));
  };

  const toggleOnePig = (id: number, checked: boolean) => {
    setPigs(pigs.map(p => p.id === id ? { ...p, checked } : p));
  };

  const updateTreatmentStep = (id: number, field: keyof TreatmentStep, value: string) => {
    setTreatmentSteps(prev => prev.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const addTreatmentStep = () => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const newStep: TreatmentStep = {
      id: Date.now(),
      date: formattedDate,
      medicine: "",
      dosage: "",
      status: "",
    };
    setTreatmentSteps([...treatmentSteps, newStep]);
  };

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
      <TransferPigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPigs={selectedPigs}
        onConfirm={handleConfirmTransfer}
        onRemovePig={handleRemovePigFromSelection}
      />

      <DeathReportModal 
        isOpen={isDeathModalOpen}
        onClose={() => setIsDeathModalOpen(false)}
        selectedPigs={selectedPigs}
        onRemovePig={handleRemovePigFromSelection} 
        onConfirm={() => {
          setIsDeathModalOpen(false);
        }}
      />

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
            {showPigList ? "Đóng" : "Danh sách heo điều trị"}
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
                <button 
                  onClick={() => selectedPigs.length > 0 && setIsModalOpen(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm 
                    ${selectedPigs.length === 0 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                  disabled={selectedPigs.length === 0}
                >
                  Chuyển chuồng
                </button>

                <button 
                  onClick={() => selectedPigs.length > 0 && setIsDeathModalOpen(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition border
                    ${selectedPigs.length === 0 
                      ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                      : "border-red-600 text-red-600 hover:bg-red-50"}`}
                  disabled={selectedPigs.length === 0}
                >
                  Báo chết
                </button>
              </div>
              
              <div className="border border-emerald-100 rounded-xl bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-center">
                  <thead className="bg-emerald-50 text-emerald-700">
                    <tr>
                      <th className="px-6 py-3">
                        <input type="checkbox" checked={allPigsInPageChecked} onChange={(e) => toggleAllPigsInPage(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer" />
                      </th>
                      <th className="px-6 py-3 font-semibold uppercase text-xm">STT</th>
                      <th className="px-6 py-3 font-semibold text-xm">Mã số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentPigs.map((p, i) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={p.checked} onChange={(e) => toggleOnePig(p.id, e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer" />
                        </td>
                        <td className="px-6 py-3 text-gray-500">{indexOfFirstItem + i + 1}</td>
                        <td className="px-6 py-3 text-gray-800">{p.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, pigs.length)} / {pigs.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
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
            <button onClick={addTreatmentStep} className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">Thêm</button>
          </div>
        </div>
        <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-m">STT</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider text-xm">Ngày</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider text-xm">Thuốc sử dụng</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider text-xm">Liều lượng</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider text-xm">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {treatmentSteps.map((step, index) => (
                <tr key={step.id} className="hover:bg-gray-100/50 transition">
                  <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="date" 
                      value={
                        step.date.split('/').reverse().join('-')
                      } 
                      onChange={(e) => {
                        const [y, m, d] = e.target.value.split('-');
                        updateTreatmentStep(step.id, 'date', `${d}/${m}/${y}`);
                      }}
                      className="bg-transparent text-center w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 transition-all cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      value={step.medicine} 
                      onChange={(e) => updateTreatmentStep(step.id, 'medicine', e.target.value)}
                      className="bg-transparent text-center font-bold text-gray-800 w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 transition-all"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      value={step.dosage} 
                      onChange={(e) => updateTreatmentStep(step.id, 'dosage', e.target.value)}
                      className="bg-transparent text-center text-gray-600 w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 transition-all"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      value={step.status} 
                      onChange={(e) => updateTreatmentStep(step.id, 'status', e.target.value)}
                      className="bg-transparent text-center text-gray-600 w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 transition-all"
                    />
                  </td>
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