"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Pencil, Sparkles, Syringe } from "lucide-react" // Import thêm icon Sparkles, Syringe
import {
  fetchVaccineSamples,
  fetchVaccineSuggestions,
  saveVaccinationTemplates,
  deleteTemplateItem,
  VaccineSampleItem,
  VaccineSuggestion,
} from "@/app/api/vaccines"
import AddVaccineSampleModal from "@/app/(main)/vaccines/components/add_vaccine_sample"
import { cn } from "@/lib/utils"

export default function VaccineSample() {
  const [samples, setSamples] = useState<VaccineSampleItem[]>([])
  const [backupSamples, setBackupSamples] = useState<VaccineSampleItem[]>([])
  const [suggestions, setSuggestions] = useState<VaccineSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    Promise.all([fetchVaccineSamples(), fetchVaccineSuggestions()])
      .then(([samplesData, suggestionsData]) => {
        setSamples(samplesData)

        const mappedSuggestions = suggestionsData.map((s: any) => ({
            ...s,
            name: s.name || s.vaccineName || s.nameDisplay || "Không tên"
        }))
        setSuggestions(mappedSuggestions)
      })
      .finally(() => setLoading(false))
  }, [])

  /* ================= ACTIONS ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mẫu này?")) return

    const oldSamples = [...samples]
    setSamples(prev => prev.filter(item => item.id !== id))

    try {
      if (!id.startsWith("temp-") && !id.startsWith("manual-")) {
        await deleteTemplateItem(id)
      }
    } catch {
      alert("Xóa thất bại")
      setSamples(oldSamples)
    }
  }

  const handleAddFromSuggestion = (sug: VaccineSuggestion) => {
    const newItem: VaccineSampleItem = {
      id: `temp-${Date.now()}`,
      vaccineId: sug.vaccineId,
      name: sug.name,
      dose: sug.dosage,
      age: `${sug.daysOld} ngày tuổi`,
      daysOld: sug.daysOld,
      note: sug.description,
      stage: 1,
    }

    setSamples(prev =>
      [...prev, newItem].sort(
        (a, b) => (a.daysOld || 0) - (b.daysOld || 0)
      )
    )
    setSuggestions(prev =>
      prev.filter(s => s.vaccineId !== sug.vaccineId)
    )
    
    // Tự động bật chế độ edit để user thấy thay đổi chưa lưu
    setEditMode(true)
    setBackupSamples(samples) // Lưu snapshot trước khi thêm
  }

  const handleAddManual = (data: {
    vaccineName: string
    dosage: string
    daysOld: number
    stage: number
    notes?: string
  }) => {
    const newItem: VaccineSampleItem = {
      id: `manual-${Date.now()}`,
      vaccineId: "",
      name: data.vaccineName,
      dose: data.dosage,
      age: `${data.daysOld} ngày tuổi`,
      daysOld: data.daysOld,
      stage: data.stage,
      note: data.notes,
    }

    setSamples(prev =>
      [...prev, newItem].sort(
        (a, b) => (a.daysOld || 0) - (b.daysOld || 0)
      )
    )
    setEditMode(true)
  }

  /* ================= EDIT & SAVE ================= */

  const startEdit = () => {
    setBackupSamples(JSON.parse(JSON.stringify(samples)))
    setEditMode(true)
  }

  const cancelEdit = () => {
    setSamples(backupSamples)
    setEditMode(false)
  }

  const updateSample = (
    id: string,
    field: keyof VaccineSampleItem,
    value: any
  ) => {
    setSamples(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    )
  }
  
  const handleSave = async () => {
        try {
          setSaving(true)
          const payload = samples.map(s => ({
            vaccineId: s.vaccineId,
            vaccineName: s.name,
            stage: s.stage || 1,
            daysOld: s.daysOld || 0,
            dosage: s.dose,
            notes: s.note,
          }))

          await saveVaccinationTemplates(payload)
          alert("Đã lưu chỉnh sửa thành công")

          // reload lại từ BE
          const refreshedSamples = await fetchVaccineSamples()
          const refreshedSuggestions = await fetchVaccineSuggestions()
          
          setSamples(refreshedSamples)
          setSuggestions(refreshedSuggestions)
          setEditMode(false)
        } catch (e) {
          console.error(e)
          alert("Lưu thất bại")
          if(backupSamples.length > 0) setSamples(backupSamples)
        } finally {
          setSaving(false)
        }
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 pb-20"> {/* Thêm padding bottom để không bị che bởi bottom bar */}
      
      {/* 1. BẢNG DANH SÁCH (TABLE) */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#53A88B] text-white">
            <tr>
              <th className="w-12 text-center py-2">#</th>
              <th className="text-left px-3 py-2">Tên vắc-xin</th>
              <th className="text-left px-3 py-2">Liều lượng</th>
              <th className="text-left px-3 py-2">Tuổi tiêm</th>
              <th className="text-left px-3 py-2">Ghi chú</th>
              <th className="w-12 text-center">
                {!editMode && (
                  <button
                    onClick={startEdit}
                    className="hover:text-yellow-200"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : samples.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  Chưa có mẫu nào
                </td>
              </tr>
            ) : (
              samples.map((item, idx) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="text-center text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">
                    {item.name}
                  </td>

                  {/* LIỀU */}
                  <td className="px-3 py-2">
                    {editMode ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={item.dose}
                        onChange={e =>
                          updateSample(item.id, "dose", e.target.value)
                        }
                      />
                    ) : (
                      item.dose
                    )}
                  </td>

                  {/* TUỔI */}
                  <td className="px-3 py-2">
                    {editMode ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-full"
                        value={item.daysOld || 0}
                        onChange={e =>
                          updateSample(
                            item.id,
                            "daysOld",
                            Number(e.target.value)
                          )
                        }
                      />
                    ) : (
                      item.age
                    )}
                  </td>

                  {/* NOTE */}
                  <td className="px-3 py-2">
                    {editMode ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={item.note || ""}
                        onChange={e =>
                          updateSample(item.id, "note", e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-slate-500 italic truncate max-w-[200px] block" title={item.note}>
                        {item.note}
                      </span>
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(item.id.toString())}
                      className="text-slate-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 2. KHU VỰC GỢI Ý (SUGGESTIONS SECTION) */}
      {suggestions.length > 0 && (
        <div className="border-2 border-orange-300 rounded-xl p-4 bg-orange-50/30">
            {/* Header Gợi ý */}
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-orange-500 w-5 h-5 fill-orange-500" />
                <h3 className="text-lg font-bold text-orange-600">Gợi ý tiêm</h3>
            </div>

            {/* Grid Cards - ĐÃ CHỈNH SỬA CÂN ĐỐI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((sug) => (
                    <div 
                        key={sug.vaccineId}
                        onClick={() => handleAddFromSuggestion(sug)}
                        className={cn(
                            "group relative border rounded-xl p-5 bg-white shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between", // Tăng padding lên p-5, dùng flex flex-col để căn đều chiều cao
                            sug.color === 'red' ? "border-red-200 hover:border-red-300" :
                            sug.color === 'orange' ? "border-orange-200 hover:border-orange-300" :
                            "border-emerald-100 hover:border-emerald-300"
                        )}
                    >
                        <div>
                            {/* Header: Icon & Tên Vaccine */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className={cn("p-2 rounded-full shrink-0", 
                                     sug.color === 'red' ? "bg-red-50 text-red-500" :
                                     sug.color === 'orange' ? "bg-orange-50 text-orange-500" :
                                     "bg-emerald-50 text-[#53A88B]"
                                )}>
                                    <Syringe size={18} />
                                </div>
                                <h4 className="font-bold text-base text-slate-800 leading-tight pt-1 group-hover:text-[#53A88B] transition-colors line-clamp-2" title={sug.name}>
                                    {sug.name}
                                </h4>
                            </div>
                            
                            {/* Info Badges: Tuổi & Liều */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {/* Badge Tuổi - Quan trọng nhất */}
                                <div className="bg-[#53A88B]/10 text-[#53A88B] text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                                    <span>📅 {sug.daysOld} ngày tuổi</span>
                                </div>
                                {/* Badge Liều - Phụ */}
                                <div className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 truncate max-w-[120px]" title={sug.dosage}>
                                    <span>💧 {sug.dosage}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer: Mô tả */}
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 border-t pt-3 mt-auto">
                            {sug.description || "Chưa có mô tả chi tiết."}
                        </p>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <span className="bg-[#53A88B] text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg hover:bg-[#45b883] transform scale-95 group-hover:scale-100 transition-all flex items-center gap-2">
                                <Plus size={16} /> Thêm vào lịch
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 3. BOTTOM BAR (ACTION BUTTONS) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/95 backdrop-blur border border-slate-200 rounded-full shadow-xl p-2 px-4 flex justify-between items-center z-50">
        <Button
          variant="ghost"
          className="text-slate-600 hover:text-[#53A88B] hover:bg-emerald-50 rounded-full"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={18} className="mr-2" />
          Thêm thủ công
        </Button>

        {editMode && (
             <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full border-slate-300 text-slate-600"
                    onClick={cancelEdit}
                >
                    Hủy bỏ
                </Button>
                <Button
                    size="sm"
                    className="bg-[#53A88B] hover:bg-[#45b883] text-white rounded-full px-6"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
             </div>
        )}
      </div>

      {/* MODAL THÊM THỦ CÔNG */}
      <AddVaccineSampleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddManual}
      />
    </div>
  )
}