"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Pencil } from "lucide-react"
import {
  fetchVaccineSamples,
  fetchVaccineSuggestions,
  saveVaccinationTemplates,
  deleteTemplateItem,
  VaccineSampleItem,
  VaccineSuggestion,
} from "@/app/api/vaccines"
import AddVaccineSampleModal from "@/app/(main)/vaccines/components/add_vaccine_sample"

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
        setSuggestions(suggestionsData)
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
      alert("Đã lưu cấu hình thành công!")

      const refreshed = await fetchVaccineSamples()
      setSamples(refreshed)
      setEditMode(false)
    } catch {
      alert("Lỗi khi lưu dữ liệu")
    } finally {
      setSaving(false)
    }
  }

  /* ================= EDIT ================= */

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

  /* ================= RENDER ================= */

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
                      <span className="text-slate-500 italic">
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

      {/* EDIT ACTION */}
      {editMode && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={cancelEdit}>
                Hủy chỉnh sửa
              </Button>
              <Button
      onClick={async () => {
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

          // reload lại từ BE cho chắc
          const refreshed = await fetchVaccineSamples()
          setSamples(refreshed)
          setEditMode(false)
        } catch (e) {
          console.error(e)
          alert("Lưu thất bại, dữ liệu đã được hoàn tác")
          setSamples(backupSamples)
        } finally {
          setSaving(false)
        }
      }}
      disabled={saving}
    >
      {saving ? "Đang lưu..." : "Lưu"}
    </Button>
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="sticky bottom-4 bg-white/90 backdrop-blur border rounded-xl shadow-lg p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setOpenModal(true)}
        >
          <Plus size={16} className="mr-1" />
          Thêm mũi tiêm thủ công
        </Button>

      </div>

      <AddVaccineSampleModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddManual}
      />
    </div>
  )
}
