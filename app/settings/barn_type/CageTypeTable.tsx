"use client";

import React, { useState } from "react";
import { CageType } from "./CageType";

interface CageTypeTableProps {
  cageTypes: CageType[];
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, data: { pen_type_name: string }) => Promise<void>;
}

const CageTypeTable: React.FC<CageTypeTableProps> = ({
  cageTypes,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFinishEditing = (index: number, row: CageType, newValue: string) => {
    const trimmedValue = newValue.trim();
    if (trimmedValue === "" || trimmedValue === row.loaiChuong) {
      setEditingIndex(null);
      return;
    }

    onUpdate(row.id!, { pen_type_name: trimmedValue });
    setEditingIndex(null);
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-4 py-3 text-center text-sm font-semibold uppercase">
              STT
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Loại chuồng
            </th>
            <th className="w-[80px] text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="form-checkbox h-4 w-4 text-emerald-600 cursor-pointer"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-50">
          {cageTypes.map((row, index) => (
            <tr
              key={row.id || index}
              className={`transition-colors hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
              }`}
            >
              <td className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                {index + 1}
              </td>

              <td className="px-4 py-3 text-center text-sm text-emerald-900 font-medium">
                {editingIndex === index ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={row.loaiChuong}
                    onBlur={(e) => handleFinishEditing(index, row, e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index, row, e.currentTarget.value);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    className="w-full border border-emerald-200 rounded-lg p-1 text-center bg-white
                               focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    className="cursor-pointer block px-1 py-1 rounded
                               hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {row.loaiChuong}
                  </span>
                )}
              </td>

              <td className="text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    disabled={row.hasPigs}
                    className={`form-checkbox h-4 w-4 text-emerald-600 ${
                      row.hasPigs ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CageTypeTable;