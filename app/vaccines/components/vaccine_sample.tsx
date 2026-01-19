"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, ArrowRight } from "lucide-react"
import {
  fetchVaccineSamples,
  fetchVaccineSuggestions,
  saveVaccinationTemplates, 
  deleteTemplateItem,       
  VaccineSampleItem,
  VaccineSuggestion,
} from "@/app/api/vaccines"

export default function VaccineSample() {
  const [samples, setSamples] = useState<VaccineSampleItem[]>([])
  const [suggestions, setSuggestions] = useState<VaccineSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 1. Load dữ liệu khi vào trang
  useEffect(() => {
    Promise.all([fetchVaccineSamples(), fetchVaccineSuggestions()])
      .then(([samplesData, suggestionsData]) => {
        setSamples(samplesData)
        setSuggestions(suggestionsData)
      })
      .finally(() => setLoading(false))
  }, [])

  // 2. Xử lý xóa dòng
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mẫu này?")) return
    
    // Optimistic update (Xóa trên UI trước cho mượt)
    const oldSamples = [...samples]
    setSamples(prev => prev.filter(item => item.id !== id))

    try {
      await deleteTemplateItem(id) // Gọi API xóa thật
    } catch (error) {
      alert("Xóa thất bại")
      setSamples(oldSamples) // Rollback nếu lỗi
    }
  }

  // 3. Xử lý thêm từ Gợi ý vào Danh sách mẫu
  const handleAddFromSuggestion = (sug: VaccineSuggestion) => {
    const newItem: VaccineSampleItem = {
      id: `temp-${Date.now()}`, // ID tạm
      vaccineId: sug.vaccineId, // ID vaccine gốc
      name: sug.name,
      dose: sug.dosage,
      age: `${sug.daysOld} ngày tuổi`,
      daysOld: sug.daysOld,     // Cần trường này để sort/lưu
      note: sug.description,
      stage: 1
    }
    
    setSamples(prev => [...prev, newItem].sort((a, b) => (a.daysOld || 0) - (b.daysOld || 0)))
    // Xóa khỏi gợi ý
    setSuggestions(prev => prev.filter(s => s.vaccineId !== sug.vaccineId))
  }

  // 4. Lưu toàn bộ (Save Changes)
  const handleSave = async () => {
    try {
      setSaving(true)
      // Map lại dữ liệu cho đúng DTO Backend yêu cầu
      const payload = samples.map(s => ({
        vaccineId: s.vaccineId, // Có thể undefined nếu nhập tay (sẽ xử lý sau)
        vaccineName: s.name,
        stage: s.stage || 1,
        daysOld: s.daysOld || parseInt(s.age) || 0,
        dosage: s.dose,
        notes: s.note
      }))

      await saveVaccinationTemplates(payload)
      alert("Đã lưu cấu hình thành công!")
      
      // Reload lại để lấy ID thật
      const refreshedData = await fetchVaccineSamples()
      setSamples(refreshedData)
      
    } catch (e) {
      alert("Lỗi khi lưu dữ liệu")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#53A88B] text-white">
            <tr>
              <th className="w-12 text-center py-2">#</th>
              <th className="text-left px-3 py-2">Tên vắc-xin</th>
              <th className="text-left px-3 py-2">Liều lượng</th>
              <th className="text-left px-3 py-2">Tuổi tiêm</th>
              <th className="text-left px-3 py-2">Ghi chú</th>
              <th className="w-12"></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Đang tải...</td></tr>
            ) : samples.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Chưa có mẫu nào</td></tr>
            ) : (
              samples.map((item, idx) => (
                <tr key={item.id} className="border-b last:border-b-0 hover:bg-slate-50">
                  <td className="text-center text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{item.name}</td>
                  <td className="px-3 py-2">{item.dose}</td>
                  <td className="px-3 py-2">{item.age}</td>
                  <td className="px-3 py-2 text-slate-500 italic truncate max-w-[200px]">{item.note}</td>
                  <td className="text-center">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
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

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/80 p-4 backdrop-blur border rounded-xl shadow-lg">
          <span className="text-sm text-slate-500 mr-auto">
            Tổng cộng: <b>{samples.length}</b> mũi tiêm
          </span>
          <Button variant="outline">Hủy thay đổi</Button>
          <Button 
            className="bg-[#53A88B] hover:bg-[#45b883]" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu Cấu Hình"}
          </Button>
      </div>

      {/* GỢI Ý TIÊM (Gap Analysis) */}
      {suggestions.length > 0 && (
        <div className="border-2 border-orange-200 bg-orange-50/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
            ⚡ Gợi ý bổ sung (Còn thiếu)
          </div>
          <p className="text-sm text-slate-500">
            Hệ thống phát hiện các loại vắc-xin phổ biến sau chưa có trong lịch của bạn:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((sug) => (
              <div
                key={sug.vaccineId}
                className="group relative border bg-white rounded-xl p-4 hover:shadow-md transition-all border-l-4"
                style={{ borderLeftColor: sug.color || 'orange' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{sug.name}</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {sug.daysOld} ngày tuổi
                    </span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleAddFromSuggestion(sug)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                <div className="mt-3 text-xs text-slate-500 line-clamp-2">
                  {sug.description}
                </div>
                
                <div className="mt-2 text-xs font-semibold text-slate-400">
                  Liều: {sug.dosage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}