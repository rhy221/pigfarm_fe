"use client";

import React, { useState } from "react";
import { Cage } from "./CageContent";

interface CageTableProps {
  cages: Cage[];
  editedCages: Cage[];
  setEditedCages: React.Dispatch<React.SetStateAction<Cage[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

type EditingCell =
  | { row: number; field: "loaiChuong" }
  | null;

const CageTable: React.FC<CageTableProps> = ({
  cages,
  editedCages,
  setEditedCages,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const updateLoaiChuong = (index: number, value: string) => {
    const newEdited = [...editedCages];
    if (!newEdited[index]) newEdited[index] = { ...cages[index] };
    newEdited[index].loaiChuong = value;
    setEditedCages(newEdited);
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
              Chuồng
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Loại chuồng
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Trạng thái
            </th>
            <th className="w-[80px] text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-4 w-4 text-emerald-600 cursor-pointer"
              />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-50">
          {cages.map((row, index) => {
            const current = editedCages[index] || row;
            const isEditing =
              editingCell?.row === index &&
              editingCell.field === "loaiChuong";

            return (
              <tr
                key={row.stt}
                className={`transition-colors hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
                }`}
              >
                <td className="px-4 py-3 text-sm text-center font-medium text-gray-500">
                  {row.stt}
                </td>

                <td className="px-4 py-3 text-sm text-center text-emerald-900 font-medium">
                  {row.chuong}
                </td>

                <td className="px-4 py-3 text-sm text-center text-emerald-900">
                  {isEditing ? (
                    <select
                      autoFocus
                      value={current.loaiChuong}
                      onChange={(e) =>
                        updateLoaiChuong(index, e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm
                                 bg-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Chuồng thịt">Chuồng thịt</option>
                      <option value="Chuồng cách ly">Chuồng cách ly</option>
                    </select>
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({
                          row: index,
                          field: "loaiChuong",
                        })
                      }
                      className="block cursor-pointer rounded-md px-2 py-1
                                 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {current.loaiChuong}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-center text-emerald-900">
                  {row.trangThai}
                </td>

                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="form-checkbox h-4 w-4 text-emerald-600 cursor-pointer"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CageTable;
