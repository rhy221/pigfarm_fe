"use client";

import React from "react";
import type { Vaccine } from "./VaccineContent";

interface VaccineTableProps {
  vaccines: Vaccine[];
  editedVaccines: Vaccine[];
  setEditedVaccines: React.Dispatch<React.SetStateAction<Vaccine[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const VaccineTable: React.FC<VaccineTableProps> = ({
  vaccines,
  editedVaccines,
  setEditedVaccines,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-4 py-3 text-center text-sm font-semibold uppercase">
              STT
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Vắc xin
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
          {vaccines.map((row, index) => (
            <tr
              key={row.stt}
              className={`transition-colors hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
              }`}
            >
              <td className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                {row.stt}
              </td>
              <td className="px-4 py-2 text-center text-sm text-emerald-900 font-medium">
                {editingIndex === index ? (
                  <input
                    autoFocus
                    type="text"
                    value={editedVaccines[index]?.name ?? row.name}
                    onChange={(e) => {
                      const newEdited = [...editedVaccines];
                      if (!newEdited[index]) newEdited[index] = { ...row };
                      newEdited[index].name = e.target.value;
                      setEditedVaccines(newEdited);
                    }}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIndex(null);
                    }}
                    className="w-full border border-emerald-200 rounded-lg p-2 text-sm text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    className="block cursor-pointer rounded px-1 py-1 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {editedVaccines[index]?.name ?? row.name}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer"
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

export default VaccineTable;
