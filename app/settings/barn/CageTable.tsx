"use client";

import React from "react";
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

const CageTable: React.FC<CageTableProps> = ({
  cages,
  editedCages,
  setEditedCages,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => (
  <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
    <table className="min-w-full divide-y divide-[var(--color-border)] table-fixed">
      <thead className="bg-[var(--color-muted)]">
        <tr>
          <th className="w-12 px-4 py-3 text-left text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            STT
          </th>
          <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Chuồng
          </th>
          <th className="w-40 px-4 py-3 text-left text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Loại chuồng
          </th>
          <th className="w-32 px-4 py-3 text-left text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Trạng thái
          </th>
          <th className="w-12 text-center">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--color-border)]">
        {cages.map((row, index) => (
          <tr
            key={row.stt}
            className="hover:bg-[var(--color-muted)] transition-colors"
          >
            <td className="w-12 px-4 py-3 text-sm font-medium text-[var(--color-foreground)]">
              {row.stt}
            </td>
            <td className="w-24 px-4 py-3 text-sm text-[var(--color-foreground)]">
              {row.chuong}
            </td>
            <td className="w-40 px-4 py-3 text-sm text-[var(--color-foreground)]">
              <select
                value={editedCages[index]?.loaiChuong || row.loaiChuong}
                onChange={(e) => {
                  const newEdited = [...editedCages];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].loaiChuong = e.target.value;
                  setEditedCages(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-1 text-sm bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="Chuồng thịt">Chuồng thịt</option>
                <option value="Chuồng cách ly">Chuồng cách ly</option>
              </select>
            </td>
            <td className="w-32 px-4 py-3 text-sm text-[var(--color-foreground)]">
              {row.trangThai}
            </td>
            <td className="w-12 text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checkedRows[index] ?? false}
                  onChange={() => toggleRow(index)}
                  className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CageTable;
