"use client";

import React from "react";
import type { MaterialType } from "./MaterialTypeContent";

interface MaterialTypeTableProps {
  materials: MaterialType[];
  editedMaterials: MaterialType[];
  setEditedMaterials: React.Dispatch<React.SetStateAction<MaterialType[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const MaterialTypeTable: React.FC<MaterialTypeTableProps> = ({
  materials,
  editedMaterials,
  setEditedMaterials,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="w-16 px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">STT</th>
          <th className="w-64 px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Loại vật tư</th>
          <th className="w-16 px-4 py-3 text-center">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="form-checkbox h-5 w-5 text-green-600"
            />
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {materials.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <input
                type="text"
                value={editedMaterials[index]?.name || row.name}
                onChange={(e) => {
                  const newEdited = [...editedMaterials];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].name = e.target.value;
                  setEditedMaterials(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <input
                type="checkbox"
                checked={checkedRows[index] ?? false}
                onChange={() => toggleRow(index)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MaterialTypeTable;
