"use client";

import React from "react";
import type { Disease } from "./DiseaseContent";

interface DiseaseTableProps {
  diseases: Disease[];
  editedDiseases: Disease[];
  setEditedDiseases: React.Dispatch<React.SetStateAction<Disease[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const DiseaseTable: React.FC<DiseaseTableProps> = ({
  diseases,
  editedDiseases,
  setEditedDiseases,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-[var(--color-muted)]">
          <tr className="divide-x divide-[var(--color-border)]/50">
            <th className="w-[80px] px-4 py-3 text-center text-sm font-semibold text-[var(--color-secondary-foreground)] uppercase">
              STT
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold text-[var(--color-secondary-foreground)]">
              Loại bệnh
            </th>
            <th className="w-[80px] text-center">
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
          {diseases.map((row, index) => (
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
                    autoFocus
                    type="text"
                    value={editedDiseases[index]?.name ?? row.name}
                    onChange={(e) => {
                      const newEdited = [...editedDiseases];
                      if (!newEdited[index]) newEdited[index] = { ...row };
                      newEdited[index].name = e.target.value;
                      setEditedDiseases(newEdited);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIndex(null);
                    }}
                    className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    className="block cursor-pointer rounded px-1 py-1 hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)]"
                  >
                    {editedDiseases[index]?.name ?? row.name}
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

export default DiseaseTable;
