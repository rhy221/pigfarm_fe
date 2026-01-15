"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Search, ChevronRight, ChevronLeft as ChevronLeftIcon, Loader2 } from "lucide-react";
import TransferPigModal from "./TransferPigModal"; 
import DeathReportModal from "./DeathReportModal";

interface TreatmentDetailProps {
  data: any;
  onBack: () => void;
}

const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ data, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [treatmentData, setTreatmentData] = useState<any>(null);
  const [showPigList, setShowPigList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [treatmentSteps, setTreatmentSteps] = useState<any[]>([]);
  const [pigs, setPigs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!data?.id) return;
      try {
        const res = await fetch(`http://localhost:3000/health/${data.id}`);
        const result = await res.json();
        setTreatmentData(result);
        setTreatmentSteps(result.treatment_logs || []);
        setPigs(result.pigs_in_treatment.map((pit: any) => ({
          id: pit.id,
          code: pit.pigs?.ear_tag_number || "N/A",
          checked: false,
          status: pit.status
        })).filter((p: any) => p.status === 'SICK'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [data?.id]);

  const selectedPigs = pigs.filter(p => p.checked);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPigs = pigs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pigs.length / itemsPerPage);

  const handleConfirmDeath = async () => {
    try {
      const ids = selectedPigs.map(p => p.id);
      const res = await fetch("http://localhost:3000/health/report-death", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pig_ids: ids }),
      });
      if (res.ok) {
        setPigs(pigs.filter(p => !ids.includes(p.id)));
        setIsDeathModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmTransfer = async () => {
    try {
      const ids = selectedPigs.map(p => p.id);
      const res = await fetch("http://localhost:3000/health/transfer-recovered", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pig_ids: ids }),
      });
      if (res.ok) {
        setPigs(pigs.filter(p => !ids.includes(p.id)));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveLogs = async () => {
    try {
      const newLogs = treatmentSteps.filter(step => !step.created_at);
      for (const log of newLogs) {
        await fetch(`http://localhost:3000/health/${data.id}/logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date().toISOString(),
            medicine: log.medicine,
            dosage: log.dosage,
            condition: log.condition
          }),
        });
      }
      onBack();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAllPigsInPage = (checked: boolean) => {
    const currentIds = currentPigs.map(p => p.id);
    setPigs(pigs.map(p => currentIds.includes(p.id) ? { ...p, checked } : p));
  };

  const toggleOnePig = (id: string, checked: boolean) => {
    setPigs(pigs.map(p => p.id === id ? { ...p, checked } : p));
  };

  const addTreatmentStep = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    setTreatmentSteps([...treatmentSteps, { id: Date.now().toString(), date: today, medicine: "", dosage: "", condition: "" }]);
  };

  const updateTreatmentStep = (id: string, field: string, value: string) => {
    setTreatmentSteps(prev => prev.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
      <TransferPigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPigs={selectedPigs}
        onConfirm={handleConfirmTransfer}
        onRemovePig={(id: string) => toggleOnePig(id, false)}
      />

      <DeathReportModal 
        isOpen={isDeathModalOpen}
        onClose={() => setIsDeathModalOpen(false)}
        selectedPigs={selectedPigs}
        onRemovePig={(id: string) => toggleOnePig(id, false)} 
        onConfirm={handleConfirmDeath}
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
              <div className="text-sm text-gray-800">{treatmentData?.pens?.pen_name}</div>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số lượng</label>
              <div className="text-sm text-gray-800">{pigs.length} con</div>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại bệnh</label>
              <div className="text-sm text-gray-800">{treatmentData?.diseases?.name}</div>
            </div>
            <div className="flex items-baseline">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Triệu chứng</label>
              <div className="flex-1 text-sm text-gray-800 ">{treatmentData?.symptom}</div>
            </div>
          </div>

          <div className="transition-all duration-300">
            {showPigList && (
            <div className="animate-in slide-in-from-right-5 duration-300">
              <div className="flex items-center justify-end gap-3 mb-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm 
                    ${selectedPigs.length === 0 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                  disabled={selectedPigs.length === 0}
                >
                  Chuyển chuồng
                </button>

                <button 
                  onClick={() => setIsDeathModalOpen(true)}
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
                        <input type="checkbox" checked={currentPigs.length > 0 && currentPigs.every((p) => p.checked)} onChange={(e) => toggleAllPigsInPage(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer" />
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
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition">
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition">
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
            <button onClick={handleSaveLogs} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-md">Lưu</button>
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
                      type="text" 
                      disabled={!!step.created_at}
                      value={step.created_at ? new Date(step.date).toLocaleDateString('vi-VN') : step.date} 
                      onChange={(e) => updateTreatmentStep(step.id, 'date', e.target.value)}
                      className="bg-transparent text-center w-full outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      disabled={!!step.created_at}
                      value={step.medicine || ""} 
                      onChange={(e) => updateTreatmentStep(step.id, 'medicine', e.target.value)}
                      className="bg-transparent text-center font-bold text-gray-800 w-full outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      disabled={!!step.created_at}
                      value={step.dosage || ""} 
                      onChange={(e) => updateTreatmentStep(step.id, 'dosage', e.target.value)}
                      className="bg-transparent text-center text-gray-600 w-full outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="text" 
                      disabled={!!step.created_at}
                      value={step.condition || step.status || ""} 
                      onChange={(e) => updateTreatmentStep(step.id, 'condition', e.target.value)}
                      className="bg-transparent text-center text-gray-600 w-full outline-none"
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