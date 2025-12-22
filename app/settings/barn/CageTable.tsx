"use client";

import React from "react";

export interface Cage {
  stt: number;
  chuong: string;
  loaiChuong: string;
  trangThai: string;
}

interface CageTableProps {
  cages: Cage[];
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const CageTable: React.FC<CageTableProps> = ({ cages, checkedRows, toggleRow, toggleAll, allChecked }) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">STT</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Chuồng</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại chuồng</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="form-checkbox h-4 w-4 text-green-600"
            />
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {cages.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{row.chuong}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{row.loaiChuong}</td>
            <td className="px-4 py-3 text-sm text-gray-700">00</td>
            <td className="px-4 py-3 text-sm text-gray-700">{row.trangThai}</td>
            <td className="px-4 py-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={checkedRows[index]}
                onChange={() => toggleRow(index)}
                className="form-checkbox h-4 w-4 text-green-600"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CageTable;
