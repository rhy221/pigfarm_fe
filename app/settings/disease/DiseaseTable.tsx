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
  onUpdate: (id: string, name: string) => Promise<void>;
}

const DiseaseTable: React.FC<DiseaseTableProps> = ({
  diseases,
  editedDiseases,
  setEditedDiseases,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const handleFinishEditing = async (index: number) => {
    const row = diseases[index];
    const newName = editedDiseases[index]?.name?.trim();

    if (newName && newName !== row.name) {
      await onUpdate(row.id!, newName);
    }
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
              Loại bệnh
            </th>
            <th className="w-[80px] text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {diseases.map((row, index) => (
            <tr
              key={row.id || index}
              className={`transition-colors hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
              }`}
            >
              <td className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                {index + 1}
              </td>
              <td className="px-4 py-2 text-center text-sm text-gray-900 font-medium">
                {editingIndex === index ? (
                  <input
                    autoFocus
                    type="text"
                    value={editedDiseases[index]?.name ?? row.name}
                    onChange={(e) => {
                      const newEdited = [...editedDiseases];
                      newEdited[index] = { ...row, name: e.target.value };
                      setEditedDiseases(newEdited);
                    }}
                    onBlur={() => handleFinishEditing(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    className="w-full border border-emerald-200 rounded-lg p-2 text-sm text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    className="block cursor-pointer rounded px-1 py-1 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {editedDiseases[index]?.name || row.name}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center">
                  {row.hasHistory ? (
                    <span
                      title="Đang có heo điều trị bệnh này"
                      className="text-gray-300"
                    ></span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={checkedRows[index] ?? false}
                      onChange={() => toggleRow(index)}
                      className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer"
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

export default DiseaseTable;