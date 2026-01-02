"use client";

import React from "react";
import type { SanitationMethod } from "./SanitationMethodContent";

interface SanitationMethodTableProps {
  methods: SanitationMethod[];
  editedMethods: SanitationMethod[];
  setEditedMethods: React.Dispatch<React.SetStateAction<SanitationMethod[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const SanitationMethodTable: React.FC<SanitationMethodTableProps> = ({
  methods,
  editedMethods,
  setEditedMethods,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => (
  <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
    <table className="min-w-full divide-y divide-[var(--color-border)] table-auto">
      <thead className="bg-[var(--color-muted)]">
        <tr>
          <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            STT
          </th>
          <th className="w-64 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Hình thức vệ sinh
          </th>
          <th className="w-16 text-center">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--color-border)]">
        {methods.map((row, index) => (
          <tr key={row.stt} className="hover:bg-[var(--color-muted)] transition-colors">
            <td className="px-4 py-2 text-center text-sm font-medium text-[var(--color-foreground)]">
              {row.stt}
            </td>
            <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="text"
                value={editedMethods[index]?.name || row.name}
                onChange={(e) => {
                  const newEdited = [...editedMethods];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].name = e.target.value;
                  setEditedMethods(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-foreground)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checkedRows[index] ?? false}
                  onChange={() => toggleRow(index)}
                  className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SanitationMethodTable;
