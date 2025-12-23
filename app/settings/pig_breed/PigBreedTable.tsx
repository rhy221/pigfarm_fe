"use client";

import React from "react";
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
}) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="w-16 px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">STT</th>
          <th className="w-64 px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Giống heo</th>
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
        {pigBreeds.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <input
                type="text"
                value={editedPigBreeds[index]?.name || row.name}
                onChange={(e) => {
                  const newEdited = [...editedPigBreeds];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].name = e.target.value;
                  setEditedPigBreeds(newEdited);
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

export default PigBreedTable;
