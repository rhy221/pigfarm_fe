"use client";

import React, { useState } from "react";
import type { PigBreed } from "./PigBreedContent";

interface PigBreedTableProps {
  pigBreeds: PigBreed[];
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, data: { breed_name: string }) => Promise<void>;
}

const PigBreedTable: React.FC<PigBreedTableProps> = ({
  pigBreeds,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFinishEditing = (index: number, row: PigBreed, newValue: string) => {
    const trimmedValue = newValue.trim();
    if (trimmedValue === "" || trimmedValue === row.name) {
      setEditingIndex(null);
      return;
    }

    onUpdate(row.id!, { breed_name: trimmedValue });
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
              Giống heo
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
          {pigBreeds.map((row, index) => (
            <tr
              key={row.id || index}
              className={`transition-colors hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
              }`}
            >
              <td className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                {index + 1}
              </td>

              <td className="px-4 py-2 text-center text-sm text-emerald-900 font-medium">
                {editingIndex === index ? (
                  <input
                    autoFocus
                    type="text"
                    defaultValue={row.name}
                    onBlur={(e) => handleFinishEditing(index, row, e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(index, row, e.currentTarget.value);
                      if (e.key === "Escape") setEditingIndex(null);
                    }}
                    className="w-full border border-emerald-200 rounded-lg p-2 text-sm
                               text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    className="cursor-pointer block px-2 py-1 rounded
                               hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {row.name}
                  </span>
                )}
              </td>

              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center">
                  {!row.hasPigs && (
                    <input
                      type="checkbox"
                      checked={checkedRows[index] ?? false}
                      onChange={() => toggleRow(index)}
                      disabled={row.hasPigs}
                      className={`form-checkbox h-5 w-5 text-emerald-600 ${
                        row.hasPigs ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                      }`}
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

export default PigBreedTable;