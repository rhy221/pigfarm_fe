"use client";

import React, { useState } from "react";
import type { PigBreed } from "./PigBreedContent";

interface PigBreedTableProps {
  pigBreeds: PigBreed[];
  editedPigBreeds: PigBreed[];
  setEditedPigBreeds: React.Dispatch<React.SetStateAction<PigBreed[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const PigBreedTable: React.FC<PigBreedTableProps> = ({
  pigBreeds,
  editedPigBreeds,
  setEditedPigBreeds,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  // ✅ State quản lý dòng đang sửa
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
      <table className="min-w-full divide-y divide-[var(--color-border)] table-auto">
        <thead className="bg-[var(--color-muted)]">
          <tr>
            <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              STT
            </th>
            <th className="w-64 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              Giống heo
            </th>
            <th className="w-16 text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {pigBreeds.map((row, index) => (
            <tr
              key={row.stt}
              className="hover:bg-[var(--color-muted)] transition-colors"
            >
              <td className="px-4 py-2 text-center text-sm font-medium text-[var(--color-foreground)]">
                {row.stt}
              </td>
             
              <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedPigBreeds[index]?.name ?? row.name}
                    autoFocus
                    onChange={(e) => {
                      const newEdited = [...editedPigBreeds];
                      if (!newEdited[index]) newEdited[index] = { ...row };
                      newEdited[index].name = e.target.value;
                      setEditedPigBreeds(newEdited);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIndex(null);
                    }}
                    className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm
                               text-center bg-[var(--color-card)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    title="Nhấn để sửa giống heo"
                    className="cursor-pointer block px-2 py-1 rounded
                               hover:bg-[var(--color-muted)]
                               hover:text-[var(--color-primary)]"
                  >
                    {editedPigBreeds[index]?.name ?? row.name}
                  </span>
                )}
              </td>

              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
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

export default PigBreedTable;
