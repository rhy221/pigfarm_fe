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
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
      <table className="min-w-full divide-y divide-[var(--color-border)] table-fixed">
        {/* HEADER */}
        <thead className="bg-[var(--color-muted)] text-[var(--color-secondary-foreground)]">
          <tr>
            <th className="w-12 px-4 py-3 text-left text-xs font-semibold uppercase">
              STT
            </th>
            <th className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase">
              Chuồng
            </th>
            <th className="w-40 px-4 py-3 text-left text-xs font-semibold uppercase">
              Loại chuồng
            </th>
            <th className="w-32 px-4 py-3 text-left text-xs font-semibold uppercase">
              Trạng thái
            </th>
            <th className="w-12 text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
              />
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-[var(--color-border)]">
          {cages.map((row, index) => {
            const current = editedCages[index] || row;
            const isEditing =
              editingCell?.row === index &&
              editingCell.field === "loaiChuong";

            return (
              <tr
                key={row.stt}
                className="hover:bg-[var(--color-muted)] transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-foreground)]">
                  {row.stt}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--color-foreground)]">
                  {row.chuong}
                </td>

                {/* Loại chuồng */}
                <td className="px-4 py-3 text-sm text-[var(--color-foreground)]">
                  {isEditing ? (
                    <select
                      autoFocus
                      value={current.loaiChuong}
                      onChange={(e) =>
                        updateLoaiChuong(index, e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      className="w-full border border-[var(--color-border)] rounded-md px-2 py-1 text-sm
                                 bg-[var(--color-card)] text-[var(--color-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
                                 hover:bg-[var(--color-muted)]"
                    >
                      {current.loaiChuong}
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-[var(--color-foreground)]">
                  {row.trangThai}
                </td>

                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="form-checkbox h-4 w-4 text-[var(--color-primary)]"
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
