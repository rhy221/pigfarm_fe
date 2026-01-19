"use client";

import React, { useState } from "react";
import type { MaterialType } from "./MaterialTypeContent";

interface MaterialTypeTableProps {
  materials: MaterialType[];
  editedMaterials: MaterialType[];
  setEditedMaterials: React.Dispatch<React.SetStateAction<MaterialType[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, data: { name?: string; description?: string }) => Promise<void>;
}

const typeMap: { [key: string]: string } = {
  feed: "Thức ăn",
  medicine: "Thuốc thú y",
  vaccine: "Vắc xin",
  equipment: "Thiết bị",
  harvest: "Sản phẩm thu hoạch",
  other: "Khác"
};

const MaterialTypeTable: React.FC<MaterialTypeTableProps> = ({
  materials,
  editedMaterials,
  setEditedMaterials,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<"name" | "description" | null>(null);

  const handleFinishEditing = (index: number, row: MaterialType, newValue: string) => {
    const field = editingField;
    if (!field) return;

    const trimmedValue = newValue.trim();
    const oldValue = field === "name" ? row.name : (row.description || "");

    if ((field === "name" && trimmedValue === "") || trimmedValue === oldValue) {
      setEditingIndex(null);
      setEditingField(null);
      return;
    }

    onUpdate(row.id!, { [field]: trimmedValue });
    setEditingIndex(null);
    setEditingField(null);
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-5xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-4 py-3 text-center font-semibold uppercase">STT</th>
            <th className="w-[150px] px-4 py-3 text-center font-semibold">Loại vật tư</th>
            <th className="w-[120px] px-4 py-3 text-center font-semibold">Phân loại</th>
            <th className="w-[200px] px-4 py-3 text-center font-semibold">Mô tả</th>
            <th className="w-[80px] text-center">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-50">
          {materials.map((row, index) => (
            <tr key={row.id || index} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"}`}>
              <td className="px-4 py-2 text-center text-gray-500">{index + 1}</td>

              <td className="px-4 py-2 text-center text-emerald-900 font-medium">
                {editingIndex === index && editingField === "name" ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={row.name}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index, row, e.currentTarget.value);
                      if (e.key === "Escape") { setEditingIndex(null); setEditingField(null); }
                    }}
                    onBlur={(e) => handleFinishEditing(index, row, e.currentTarget.value)}
                    className="w-full border border-emerald-200 rounded-lg p-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                ) : (
                  <span
                    onClick={() => { setEditingIndex(index); setEditingField("name"); }}
                    className="block cursor-pointer rounded px-1 py-1 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {row.name}
                  </span>
                )}
              </td>

              <td className="px-4 py-2 text-center text-gray-600 font-medium">
                {typeMap[row.type] || row.type}
              </td>

              <td className="px-4 py-2 text-center text-gray-500">
                {editingIndex === index && editingField === "description" ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={row.description || ""}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index, row, e.currentTarget.value);
                      if (e.key === "Escape") { setEditingIndex(null); setEditingField(null); }
                    }}
                    onBlur={(e) => handleFinishEditing(index, row, e.currentTarget.value)}
                    className="w-full border border-emerald-200 rounded-lg p-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                ) : (
                  <span
                    onClick={() => { setEditingIndex(index); setEditingField("description"); }}
                    className="block cursor-pointer rounded px-1 py-1 hover:bg-emerald-50 transition-colors min-h-[20px]"
                  >
                    {row.description || "---"}
                  </span>
                )}
              </td>

              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center">
                  {!row.inUse && (
                    <input 
                      type="checkbox" 
                      checked={checkedRows[index] ?? false} 
                      onChange={() => toggleRow(index)} 
                      className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer rounded border-gray-300 focus:ring-emerald-500" 
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialTypeTable;