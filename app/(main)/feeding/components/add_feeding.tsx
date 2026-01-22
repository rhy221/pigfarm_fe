"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { feedingApi, FeedingFormulaPayload2, FeedingProduct } from "@/app/api/feeding"
import { Trash2, Plus } from "lucide-react"

/* ================= TYPES ================= */
type IngredientItem = {
  productId: string
  percentage: number
}

type FeedingFormulaForm = {
  name: string
  amountPerPig: number
  startDay: number
  items: IngredientItem[]
}

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: (data: FeedingFormulaForm) => void
}

/* ================= COMPONENT ================= */
export default function AddFeedingFormulaModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [products, setProducts] = useState<FeedingProduct[]>([])
  const [form, setForm] = useState<FeedingFormulaForm>({
    name: "",
    amountPerPig: 0,
    startDay: 0,
    items: [],
  })

  /* ===== load feed products ===== */
  useEffect(() => {
    feedingApi.fetchFeedProducts().then(setProducts)
  }, [])

  /* ===== handlers ===== */
  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", percentage: 0 }],
    }))
  }

  const updateIngredient = (
    index: number,
    field: keyof IngredientItem,
    value: any
  ) => {
    const items = [...form.items]
    items[index] = { ...items[index], [field]: value }
    setForm({ ...form, items })
  }

  const removeIngredient = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async () => {
    console.log("🔥 handleSubmit CALLED")
    if (!form.name || !form.amountPerPig || !form.startDay) return
    if (form.items.length === 0) return

    const payload: FeedingFormulaPayload2 = {
      name: form.name,
      startDay: form.startDay,
      amountPerPig: form.amountPerPig,
      items: form.items.map(i => ({
        productId: i.productId,
        percentage: i.percentage,
      })),
    }
    console.log("📤 [Create Feeding Formula] Payload gửi lên:", payload)
    try {
      await feedingApi.createFormula(payload)

      // reset form
      setForm({
        name: "",
        amountPerPig: 0,
        startDay: 0,
        items: [],
      })

      onClose()
    } catch (err) {
      console.error("Create feeding formula failed", err)
    }
  }

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm công thức ăn</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* ===== NAME ===== */}
          <Input
            placeholder="Tên công thức"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          {/* ===== AMOUNT ===== */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Định lượng"
              value={form.amountPerPig || ""}
              onChange={e =>
                setForm({ ...form, amountPerPig: Number(e.target.value) })
              }
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              g / con
            </span>
          </div>

          {/* ===== START DAY ===== */}
          <Input
            type="number"
            min={0}
            placeholder="Ngày bắt đầu"
            value={form.startDay || ""}
            onChange={e =>
              setForm({ ...form, startDay: Number(e.target.value) })
            }
          />

          {/* ===== INGREDIENTS ===== */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Thành phần</span>
              <Button
                size="sm"
                variant="outline"
                onClick={addIngredient}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm thành phần
              </Button>
            </div>

            {form.items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Select
                  value={item.productId}
                  onValueChange={v =>
                    updateIngredient(index, "productId", v)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn nguyên liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="%"
                  className="w-24"
                  value={item.percentage || ""}
                  onChange={e =>
                    updateIngredient(
                      index,
                      "percentage",
                      Number(e.target.value)
                    )
                  }
                />

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSubmit}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}