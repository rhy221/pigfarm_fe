"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { feedingApi } from "@/app/api/feeding";
import { FeedingFormulaPayload } from "@/app/api/feeding";
import { Trash2 } from "lucide-react";
import AddFeedingFormulaModal from "./add_feeding";

/* ================= TYPES ================= */
type FormulaItem = {
  productId: string;
  productName: string;
  percentage: number;
};

type FormulaRow = {
  id: string;
  name: string;
  startDay: number;
  amountPerPig: number;
  items: FormulaItem[];
  feedingTime: string;
};

type ProductOption = {
  id: string;
  name: string;
};

export default function FeedingAdjust() {
  const [formulas, setFormulas] = useState<FormulaRow[]>([]);
  const [editingFormulas, setEditingFormulas] = useState<FormulaRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /* ================= UPDATE CELL ================= */
  const updateCell = <K extends keyof FormulaRow>(
    index: number,
    key: K,
    value: FormulaRow[K]
  ) => {
    setEditingFormulas((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  /* ================= ITEM HELPERS ================= */
  const updateItem = (
    formulaIndex: number,
    itemIndex: number,
    key: "productId" | "percentage",
    value: any
  ) => {
    const items = [...editingFormulas[formulaIndex].items];

    if (key === "productId") {
      const product = products.find((p) => p.id === value);
      items[itemIndex] = {
        ...items[itemIndex],
        productId: value,
        productName: product?.name || "",
      };
    } else {
      items[itemIndex] = {
        ...items[itemIndex],
        percentage: value,
      };
    }

    updateCell(formulaIndex, "items", items);
  };

  const addItem = (formulaIndex: number) => {
    updateCell(formulaIndex, "items", [
      ...editingFormulas[formulaIndex].items,
      { productId: "", productName: "", percentage: 0 },
    ]);
  };

  const removeItem = (formulaIndex: number, itemIndex: number) => {
    updateCell(
      formulaIndex,
      "items",
      editingFormulas[formulaIndex].items.filter((_, i) => i !== itemIndex)
    );
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      for (const f of editingFormulas) {
        const payload: FeedingFormulaPayload = {
          name: f.name,
          startDay: f.startDay,
          amountPerPig: f.amountPerPig,
          items: f.items.map((i) => ({
            productId: i.productId,
            percentage: i.percentage,
          })),
        };
        await feedingApi.updateFormula(f.id, payload);
      }

      setIsEditing(false);
      await fetchFormulas();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isSaving || isEditing) return;

    if (!confirm("Bạn có chắc muốn xóa công thức này không?")) return;

    try {
      console.log("🗑️ Delete formula id:", id);

      setIsSaving(true);
      await feedingApi.deleteFormula(id);
      await fetchFormulas();
    } catch (err) {
      console.error("Delete formula failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  /* ================= FETCH ================= */
  const fetchFormulas = async () => {
    const res = await feedingApi.getFormulas();

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
    }));

    setFormulas(mapped);
    setEditingFormulas(mapped);
  };

  useEffect(() => {
    fetchFormulas();
    feedingApi.fetchFeedProducts().then(setProducts);
  }, []);

  /* ================= RENDER ================= */
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Danh sách công thức</h2>

        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setOpenModal(true)}
        >
          + Thêm công thức
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-emerald-600">
          <TableRow>
            <TableHead className="text-white">Tên công thức</TableHead>
            <TableHead className="text-white">Định lượng</TableHead>
            <TableHead className="text-white">Giai đoạn</TableHead>
            <TableHead className="text-white">Thành phần</TableHead>
            <TableHead className="text-white text-center w-12">Xóa</TableHead>
            {/* <TableHead className="text-white">Giờ cho ăn</TableHead> */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {editingFormulas.map((f, index) => (
            <TableRow key={f.id}>
              {/* NAME */}
              <TableCell>
                {isEditing ? (
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={f.name}
                    onChange={(e) => updateCell(index, "name", e.target.value)}
                  />
                ) : (
                  f.name
                )}
              </TableCell>

              {/* AMOUNT */}
              <TableCell>
                {isEditing ? (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24"
                    value={f.amountPerPig}
                    onChange={(e) =>
                      updateCell(index, "amountPerPig", Number(e.target.value))
                    }
                  />
                ) : (
                  `${f.amountPerPig} g/con`
                )}
              </TableCell>

              {/* STAGE */}
              <TableCell>
                {isEditing ? (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-24"
                    value={f.startDay}
                    onChange={(e) =>
                      updateCell(index, "startDay", Number(e.target.value))
                    }
                  />
                ) : (
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    Từ {f.startDay} ngày
                  </span>
                )}
              </TableCell>

              {/* ITEMS */}
              <TableCell className="space-y-2">
                {f.items.map((item, idx) =>
                  isEditing ? (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        className="border rounded px-2 py-1 w-40"
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, idx, "productId", e.target.value)
                        }
                      >
                        <option value="">-- Chọn SP --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={item.percentage}
                        onChange={(e) =>
                          updateItem(
                            index,
                            idx,
                            "percentage",
                            Number(e.target.value)
                          )
                        }
                      />
                      <span>%</span>

                      <button
                        className="text-red-500"
                        onClick={() => removeItem(index, idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={idx} className="text-sm">
                      {item.productName} | {item.percentage}%
                    </div>
                  )
                )}

                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addItem(index)}
                  >
                    + Thêm thành phần
                  </Button>
                )}
              </TableCell>

              {/* TIME */}
              {/* <TableCell>⏰ {f.feedingTime}</TableCell> */}
              <TableCell className="text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isSaving || isEditing}
                  onClick={() => handleDelete(f.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-2">
        {isEditing && (
          <Button
            variant="destructive"
            disabled={isSaving}
            onClick={() => {
              setEditingFormulas(formulas);
              setIsEditing(false);
            }}
          >
            Hủy bỏ
          </Button>
        )}

        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={isSaving}
          onClick={() =>
            isEditing
              ? handleSave()
              : (setEditingFormulas(formulas), setIsEditing(true))
          }
        >
          {isEditing ? (isSaving ? "Đang lưu..." : "Lưu") : "Chỉnh sửa"}
        </Button>
      </div>
      <AddFeedingFormulaModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={async () => {
          setOpenModal(false);
          await fetchFormulas();
        }}
      />
    </div>
  );
}
