"use client";

import React, { useState, useEffect } from "react";
import { Cage } from "./CageContent";

interface CageTableProps {
  cages: Cage[];
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, data: { pen_name?: string; pen_type_id?: string }) => Promise<void>;
}

const CageTable: React.FC<CageTableProps> = ({
  cages,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<"chuong" | "loaiChuong" | null>(null);
  const [cageTypes, setCageTypes] = useState<{ id: string, pen_type_name: string }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types`);
        const data = await res.json();
        setCageTypes(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTypes();
  }, []);

  const handleFinishEditing = (index: number, row: Cage, newValue: string) => {
    const field = editingField;
    if (!field) return;

    const trimmedValue = newValue.trim();
    const isNameField = field === "chuong";
    const oldValue = isNameField ? row.chuong : row.loaiChuongId;

    if ((isNameField && trimmedValue === "") || trimmedValue === oldValue) {
      setEditingIndex(null);
      setEditingField(null);
      return;
    }

    const updateData = isNameField 
      ? { pen_name: trimmedValue } 
      : { pen_type_id: trimmedValue };

    onUpdate(row.id!, updateData);
    setEditingIndex(null);
    setEditingField(null);
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-4 py-3 text-center font-semibold uppercase">STT</th>
            <th className="w-[150px] px-4 py-3 text-center font-semibold">Chuồng</th>
            <th className="w-[180px] px-4 py-3 text-center font-semibold">Loại chuồng</th>
            <th className="w-[120px] px-4 py-3 text-center font-semibold">Trạng thái</th>
            <th className="w-[80px] text-center">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="form-checkbox h-4 w-4 text-emerald-600 cursor-pointer" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-50">
          {cages.map((row, index) => (
            <tr key={row.id || index} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"}`}>
              <td className="px-4 py-3 text-sm text-center font-medium text-gray-500">{index + 1}</td>

              <td className="px-4 py-3 text-sm text-center text-emerald-900 font-medium">
                {editingIndex === index && editingField === "chuong" ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={row.chuong}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index, row, e.currentTarget.value);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    onBlur={(e) => handleFinishEditing(index, row, e.currentTarget.value)}
                    className="w-full border border-emerald-200 rounded-lg p-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                ) : (
                  <span onClick={() => { setEditingIndex(index); setEditingField("chuong"); }} className="block cursor-pointer rounded px-1 py-1 hover:bg-emerald-50">
                    {row.chuong}
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-sm text-center text-emerald-900">
                {editingIndex === index && editingField === "loaiChuong" ? (
                  <select
                    autoFocus
                    defaultValue={row.loaiChuongId}
                    onChange={(e) => handleFinishEditing(index, row, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    className="w-full border border-emerald-200 rounded-md p-1 text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {cageTypes.map(t => <option key={t.id} value={t.id}>{t.pen_type_name}</option>)}
                  </select>
                ) : (
                  <span onClick={() => { setEditingIndex(index); setEditingField("loaiChuong"); }} className="block cursor-pointer rounded px-2 py-1 hover:bg-emerald-50">
                    {row.loaiChuong}
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-sm text-center text-emerald-900">{row.trangThai}</td>

              <td className="text-center">
                <input
                  type="checkbox"
                  checked={checkedRows[index] ?? false}
                  onChange={() => toggleRow(index)}
                  disabled={row.trangThai === "Có heo"}
                  className={`form-checkbox h-4 w-4 text-emerald-600 ${row.trangThai === "Có heo" ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CageTable;