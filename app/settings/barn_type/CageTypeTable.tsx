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
              key={row.stt}
              className={`transition-colors hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
              }`}
            >
              <td className="w-12 px-4 py-3 text-center text-sm font-medium text-gray-500">
                {row.stt}
              </td>

              <td className="w-40 px-4 py-3 text-center text-sm text-emerald-900 font-medium">
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
                    className="w-full border border-emerald-200 rounded-lg p-1 text-center bg-white
                               focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <span
                    onClick={() => setEditingIndex(index)}
                    title="Nhấn để sửa loại chuồng"
                    className="cursor-pointer block px-1 py-1 rounded
                               hover:bg-emerald-50 hover:text-emerald-700"
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
                    className="form-checkbox h-4 w-4 text-emerald-600 cursor-pointer"
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
