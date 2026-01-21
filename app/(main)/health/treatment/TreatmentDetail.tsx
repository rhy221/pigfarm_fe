"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [currentSymptom, setCurrentSymptom] = useState("");

  const [editingCell, setEditingCell] = useState<{ id: string, field: string } | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!data?.id) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/${data.id}`);
        const result = await res.json();
        setTreatmentData(result);
        setCurrentSymptom(result.symptom || "");
        setTreatmentSteps(result.treatment_logs || []);
        setPigs(result.pigs_in_treatment.map((pit: any) => ({
          id: pit.id,
          code: pit.pig_id || "N/A",
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/report-death`, {
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

  const handleConfirmTransfer = async (targetBarnId: string) => {
    try {
      const ids = selectedPigs.map(p => p.id); 
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/transfer-recovered`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pig_ids: ids, 
          target_pen_id: targetBarnId
        }),
      });

      if (res.ok) {
        setPigs(pigs.filter(p => !ids.includes(p.id)));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSaveLogs = async () => {
    try {
      setLoading(true);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: currentSymptom }),
      });

      for (const log of treatmentSteps) {
        let dateValue = log.date;
        if (dateValue.includes('-') && dateValue.split('-')[0].length === 2) {
          const [d, m, y] = dateValue.split('-');
          dateValue = `${y}-${m}-${d}`;
        }

        if (!log.created_at) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/${data.id}/logs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: new Date(dateValue).toISOString(),
              medicine: log.medicine,
              dosage: log.dosage,
              condition: log.condition
            }),
          });
        } else {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health/logs/${log.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              medicine: log.medicine,
              dosage: log.dosage,
              condition: log.condition,
              date: new Date(dateValue).toISOString() 
            }),
          });
        }
      }
      onBack();
    } catch (error) {
      console.error("Lỗi lưu DB:", error);
    } finally {
      setLoading(false);
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
    const today = new Date().toISOString().split('T')[0]; 
    const newId = Date.now().toString();
    setTreatmentSteps([...treatmentSteps, { id: newId, date: today, medicine: "", dosage: "", condition: "" }]);
    setEditingCell({ id: newId, field: "medicine" });
  };

  const updateTreatmentStep = (id: string, field: string, value: string) => {
    setTreatmentSteps(prev => prev.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  const handleAutoResize = (e: any) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
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
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày phát hiện</label>
              <div className="text-sm text-gray-800">
                {treatmentData?.created_at ? new Date(treatmentData.created_at).toLocaleDateString("vi-VN") : "N/A"}
              </div>
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
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Triệu chứng hiện tại</label>
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
            <button onClick={handleSaveLogs} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-md">Lưu</button>
            <button onClick={addTreatmentStep} className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">Thêm</button>
          </div>
        </div>
        <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="w-16 px-4 py-4 text-center font-semibold uppercase">STT</th>
                <th className="w-32 px-4 py-4 text-center font-semibold">Ngày</th>
                <th className="px-4 py-4 text-center font-semibold">Thuốc sử dụng</th>
                <th className="w-40 px-4 py-4 text-center font-semibold">Liều lượng</th>
                <th className="px-4 py-4 text-center font-semibold">Tình trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {treatmentSteps.map((step, index) => (
                <tr key={step.id} className="hover:bg-gray-100/50 transition">
                  <td className="px-4 py-4 text-center text-gray-500 align-top">{index + 1}</td>
                  
                  <td className="px-4 py-4 text-center align-top" onDoubleClick={() => setEditingCell({ id: step.id, field: "date" })}>
                    {editingCell?.id === step.id && editingCell?.field === "date" ? (
                      <input 
                        autoFocus
                        type="date" 
                        value={step.date && step.date.includes('T') ? step.date.split('T')[0] : step.date} 
                        onChange={(e) => updateTreatmentStep(step.id, 'date', e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        className="bg-white border border-blue-400 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 ring-blue-100 w-full"
                      />
                    ) : (
                      <div className="cursor-pointer py-1 text-gray-800">
                        {step.date ? (() => {
                          const d = new Date(step.date);
                          const day = String(d.getDate()).padStart(2, '0');
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const year = d.getFullYear();
                          return `${day}-${month}-${year}`; 
                        })() : "N/A"}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center align-top" onDoubleClick={() => setEditingCell({ id: step.id, field: "medicine" })}>
                    {editingCell?.id === step.id && editingCell?.field === "medicine" ? (
                      <textarea 
                        autoFocus
                        rows={1}
                        value={step.medicine || ""} 
                        onChange={(e) => updateTreatmentStep(step.id, 'medicine', e.target.value)}
                        onInput={handleAutoResize}
                        onBlur={() => setEditingCell(null)}
                        className="bg-white border border-emerald-500 rounded px-1 text-center font-bold text-gray-800 w-full outline-none resize-none overflow-hidden h-auto block break-words whitespace-pre-wrap leading-relaxed"
                      />
                    ) : (
                      <div className="cursor-pointer font-bold text-gray-800 break-words whitespace-pre-wrap">
                        {step.medicine || "..."}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center align-top" onDoubleClick={() => setEditingCell({ id: step.id, field: "dosage" })}>
                    {editingCell?.id === step.id && editingCell?.field === "dosage" ? (
                      <textarea 
                        autoFocus
                        rows={1}
                        value={step.dosage || ""} 
                        onChange={(e) => updateTreatmentStep(step.id, 'dosage', e.target.value)}
                        onInput={handleAutoResize}
                        onBlur={() => setEditingCell(null)}
                        className="bg-white border border-emerald-500 rounded px-1 text-center text-gray-600 w-full outline-none resize-none overflow-hidden h-auto block break-words whitespace-pre-wrap leading-relaxed"
                      />
                    ) : (
                      <div className="cursor-pointer text-gray-600 break-words whitespace-pre-wrap">
                        {step.dosage || "..."}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center align-top" onDoubleClick={() => setEditingCell({ id: step.id, field: "condition" })}>
                    {editingCell?.id === step.id && editingCell?.field === "condition" ? (
                      <textarea 
                        autoFocus
                        rows={1}
                        value={step.condition || step.status || ""} 
                        onChange={(e) => updateTreatmentStep(step.id, 'condition', e.target.value)}
                        onInput={handleAutoResize}
                        onBlur={() => setEditingCell(null)}
                        className="bg-white border border-emerald-500 rounded px-1 text-center text-gray-600 w-full outline-none resize-none overflow-hidden h-auto block break-words whitespace-pre-wrap leading-relaxed"
                      />
                    ) : (
                      <div className="cursor-pointer text-gray-600 break-words whitespace-pre-wrap">
                        {step.condition || step.status || "..."}
                      </div>
                    )}
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