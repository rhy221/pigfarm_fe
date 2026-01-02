"use client";

import React, { useState } from "react";
import { CageType } from "./CageType";

interface CageTypeTableProps {
  cageTypes: CageType[];
  editedCageTypes: CageType[];
  setEditedCageTypes: React.Dispatch<React.SetStateAction<CageType[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const CageTypeTable: React.FC<CageTypeTableProps> = ({
  cageTypes,
  editedCageTypes,
  setEditedCageTypes,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-[var(--color-muted)]">
          <tr className="divide-x divide-[var(--color-border)]/50">
            <th className="w-[80px] px-4 py-3 text-center text-sm font-semibold text-[var(--color-secondary-foreground)] uppercase">
              STT
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold text-[var(--color-secondary-foreground)]">
              Loại chuồng
            </th>
            <th className="w-[80px] text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {cageTypes.map((row, index) => (
            <tr
              key={row.stt}
              className="hover:bg-[var(--color-muted)] transition-colors"
            >
              <td className="w-12 px-4 py-3 text-center text-sm font-medium text-[var(--color-foreground)]">
                {row.stt}
              </td>

              <td className="w-40 px-4 py-3 text-center text-sm text-[var(--color-foreground)]">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedCageTypes[index]?.loaiChuong ?? row.loaiChuong}
                    autoFocus
                    onChange={(e) => {
                      const newEdited = [...editedCageTypes];
                      if (!newEdited[index]) newEdited[index] = { ...row };
                      newEdited[index].loaiChuong = e.target.value;
                      setEditedCageTypes(newEdited);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIndex(null);
                    }}
                    className="w-full border border-[var(--color-border)] rounded-lg p-1 text-sm
                               text-center bg-[var(--color-card)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    title="Nhấn để sửa loại chuồng"
                    className="cursor-pointer block px-1 py-1 rounded
                               hover:bg-[var(--color-muted)]
                               hover:text-[var(--color-primary)]"
                  >
                    {editedCageTypes[index]?.loaiChuong ?? row.loaiChuong}
                  </span>
                )}
              </td>

              <td className="w-12 text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
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
