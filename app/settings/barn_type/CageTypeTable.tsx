"use client";

import React from "react";
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
}) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          <th className="w-12 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">STT</th>
          <th className="w-40 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Loại chuồng</th>
          <th className="w-12 text-center">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-4 w-4 text-green-600"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {cageTypes.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="w-12 px-4 py-3 text-center text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="w-40 px-4 py-3 text-center text-sm text-gray-700">
              <input
                type="text"
                value={editedCageTypes[index]?.loaiChuong || row.loaiChuong}
                onChange={(e) => {
                  const newEdited = [...editedCageTypes];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].loaiChuong = e.target.value;
                  setEditedCageTypes(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-1 text-sm text-center"
              />
            </td>
            <td className="w-12 text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checkedRows[index] ?? false}
                  onChange={() => toggleRow(index)}
                  className="form-checkbox h-4 w-4 text-green-600"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CageTypeTable;
