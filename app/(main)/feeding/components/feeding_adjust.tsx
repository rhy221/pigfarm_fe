"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { feedingApi } from "@/app/api/feeding"
import { FeedingFormulaPayload } from "@/app/api/feeding"
import AddFeedingFormulaModal from "./add_feeding"
import { Trash2, Plus, Save, Edit2, X } from "lucide-react"

/* ================= TYPES ================= */
type FormulaItem = {
  productId: string
  productName: string
  percentage: number
}

type FormulaRow = {
  id: string
  name: string
  startDay: number
  amountPerPig: number
  items: FormulaItem[]
  feedingTime: string
}

type ProductOption = {
  id: string
  name: string
}

export default function FeedingAdjust() {
  const [formulas, setFormulas] = useState<FormulaRow[]>([])
  const [editingFormulas, setEditingFormulas] = useState<FormulaRow[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  /* ================= UPDATE CELL ================= */
  const updateCell = <K extends keyof FormulaRow>(
    index: number,
    key: K,
    value: FormulaRow[K]
  ) => {
    setEditingFormulas(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [key]: value } : row
      )
    )
  }

  /* ================= ITEM HELPERS ================= */
  const updateItem = (
    formulaIndex: number,
    itemIndex: number,
    key: "productId" | "percentage",
    value: any
  ) => {
    const items = [...editingFormulas[formulaIndex].items]

    if (key === "productId") {
      const product = products.find(p => p.id === value)
      items[itemIndex] = {
        ...items[itemIndex],
        productId: value,
        productName: product?.name || "",
      }
    } else {
      items[itemIndex] = {
        ...items[itemIndex],
        percentage: value,
      }
    }

    updateCell(formulaIndex, "items", items)
  }

  const addItem = (formulaIndex: number) => {
    updateCell(formulaIndex, "items", [
      ...editingFormulas[formulaIndex].items,
      { productId: "", productName: "", percentage: 0 },
    ])
  }

  const removeItem = (formulaIndex: number, itemIndex: number) => {
    updateCell(
      formulaIndex,
      "items",
      editingFormulas[formulaIndex].items.filter(
        (_, i) => i !== itemIndex
      )
    )
  }

  /* ================= SAVE & DELETE ================= */
  const handleSave = async () => {
    if (isSaving) return
    try {
      setIsSaving(true)
      for (const f of editingFormulas) {
        const payload: FeedingFormulaPayload = {
          name: f.name,
          startDay: f.startDay,
          amountPerPig: f.amountPerPig,
          items: f.items.map(i => ({
            productId: i.productId,
            percentage: i.percentage,
          })),
        }
        await feedingApi.updateFormula(f.id, payload)
      }
      setIsEditing(false)
      await fetchFormulas()
    } catch (err) {
      console.error("Save failed", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isSaving || isEditing) return
    if (!confirm("Bạn có chắc muốn xóa công thức này không?")) return
    try {
      setIsSaving(true)
      await feedingApi.deleteFormula(id)
      await fetchFormulas()
    } catch (err) {
      console.error("Delete formula failed", err)
    } finally {
      setIsSaving(false)
    }
  }

  /* ================= FETCH ================= */
  const fetchFormulas = async () => {
    const res = await feedingApi.getFormulas()
    const mapped: FormulaRow[] = res.map((f: any) => ({
      id: f.id,
      name: f.name,
      startDay: f.start_day,
      amountPerPig: f.amount_per_pig,
      items: f.details.map((d: any) => ({
        productId: d.productId,
        productName: d.productName,
        percentage: Number(d.percentage),
      })),
      feedingTime: "--",
    }))
    setFormulas(mapped)
    setEditingFormulas(mapped)
  }

  useEffect(() => {
    fetchFormulas()
    feedingApi.fetchFeedProducts().then(setProducts)
  }, [])

  /* ================= RENDER ================= */
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-slate-800">Cấu hình công thức</h2>
            <p className="text-xs text-slate-500">Quản lý định lượng và thành phần thức ăn</p>
        </div>

        <Button
          className="bg-[#53A88B] hover:bg-[#45b883] text-white shadow-sm"
          onClick={() => setOpenModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm công thức
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
            <TableHeader className="bg-[#53A88B]">
            <TableRow className="hover:bg-[#53A88B]">
                <TableHead className="text-white font-bold pl-4 w-[25%]">Tên công thức</TableHead>
                <TableHead className="text-white font-bold text-center w-[15%]">Định lượng</TableHead>
                <TableHead className="text-white font-bold text-center w-[15%]">Bắt đầu từ</TableHead>
                <TableHead className="text-white font-bold w-[35%]">Thành phần chi tiết</TableHead>
                <TableHead className="text-white font-bold text-center w-[10%] pr-4">Thao tác</TableHead>
            </TableRow>
            </TableHeader>

            <TableBody>
            {editingFormulas.map((f, index) => (
                <TableRow key={f.id} className="hover:bg-slate-50/50">
                {/* NAME */}
                <TableCell className="align-top pl-4">
                    {isEditing ? (
                    <input
                        className="border border-slate-300 rounded px-2 py-1 w-full text-sm focus:border-[#53A88B] outline-none"
                        value={f.name}
                        onChange={e => updateCell(index, "name", e.target.value)}
                    />
                    ) : (
                    <span className="font-bold text-slate-700">{f.name}</span>
                    )}
                </TableCell>

                {/* AMOUNT (CENTER) */}
                <TableCell className="align-top text-center">
                    {isEditing ? (
                    <div className="flex items-center justify-center gap-1">
                        <input
                            type="number"
                            className="border border-slate-300 rounded px-2 py-1 w-16 text-sm text-center focus:border-[#53A88B] outline-none"
                            value={f.amountPerPig}
                            onChange={e => updateCell(index, "amountPerPig", Number(e.target.value))}
                        />
                        <span className="text-xs text-slate-500">g</span>
                    </div>
                    ) : (
                    <span className="font-medium bg-slate-100 px-2 py-1 rounded text-slate-700">{f.amountPerPig} g/con</span>
                    )}
                </TableCell>

                {/* STAGE (CENTER) */}
                <TableCell className="align-top text-center">
                    {isEditing ? (
                    <div className="flex items-center justify-center gap-1">
                        <input
                            type="number"
                            className="border border-slate-300 rounded px-2 py-1 w-16 text-sm text-center focus:border-[#53A88B] outline-none"
                            value={f.startDay}
                            onChange={e => updateCell(index, "startDay", Number(e.target.value))}
                        />
                        <span className="text-xs text-slate-500">ngày</span>
                    </div>
                    ) : (
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                        {f.startDay} ngày tuổi
                    </span>
                    )}
                </TableCell>

                {/* ITEMS */}
                <TableCell className="space-y-2 align-top">
                    {f.items.map((item, idx) =>
                    isEditing ? (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <select
                            className="border border-slate-300 rounded px-2 py-1 w-full text-xs bg-white outline-none"
                            value={item.productId}
                            onChange={e => updateItem(index, idx, "productId", e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className="border border-slate-300 rounded px-2 py-1 w-14 text-xs text-center outline-none"
                            value={item.percentage}
                            onChange={e => updateItem(index, idx, "percentage", Number(e.target.value))}
                        />
                        <span className="text-xs text-slate-500">%</span>

                        <button className="text-slate-400 hover:text-red-500 ml-auto" onClick={() => removeItem(index, idx)}>
                            <X size={14} />
                        </button>
                        </div>
                    ) : (
                        <div key={idx} className="text-sm flex justify-between border-b border-dashed border-slate-100 last:border-0 pb-1 mb-1 last:mb-0 last:pb-0">
                        <span className="text-slate-600">{item.productName}</span>
                        <span className="font-bold text-slate-800">{item.percentage}%</span>
                        </div>
                    )
                    )}

                    {isEditing && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-dashed text-slate-500 hover:text-[#53A88B] hover:border-[#53A88B] h-8 text-xs"
                        onClick={() => addItem(index)}
                    >
                        <Plus size={12} className="mr-1" /> Thêm thành phần
                    </Button>
                    )}
                </TableCell>

                {/* ACTIONS (CENTER) */}
                <TableCell className="text-center align-top pr-4">
                    <Button
                    size="icon"
                    variant="ghost"
                    disabled={isSaving || isEditing}
                    onClick={() => handleDelete(f.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                    <Trash2 className="w-4 h-4" />
                    </Button>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
        {isEditing ? (
            <>
                <Button
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                        setEditingFormulas(formulas)
                        setIsEditing(false)
                    }}
                    className="border-slate-300 text-slate-600"
                >
                    Hủy bỏ
                </Button>
                <Button
                    className="bg-[#53A88B] hover:bg-[#45b883] text-white"
                    disabled={isSaving}
                    onClick={handleSave}
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </>
        ) : (
            <Button
                variant="outline"
                className="border-[#53A88B] text-[#53A88B] hover:bg-emerald-50"
                onClick={() => {
                    setEditingFormulas(formulas)
                    setIsEditing(true)
                }}
            >
                <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa nhanh
            </Button>
        )}
      </div>

      <AddFeedingFormulaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={async () => {
          setOpenModal(false)
          await fetchFormulas()
        }}
      />
    </div>
  )
}