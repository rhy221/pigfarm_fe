"use client";

import React from "react";
import type { WorkShift } from "./WorkShiftContent";

interface WorkShiftTableProps {
  shifts: WorkShift[];
  editedShifts: WorkShift[];
  setEditedShifts: React.Dispatch<React.SetStateAction<WorkShift[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

const WorkShiftTable: React.FC<WorkShiftTableProps> = ({
  shifts,
  editedShifts,
  setEditedShifts,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => (
  <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
    <table className="min-w-full divide-y divide-[var(--color-border)] table-auto">
      <thead className="bg-[var(--color-muted)]">
        <tr>
          <th className="w-12 px-3 py-2 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            STT
          </th>
          <th className="w-48 px-3 py-2 text-left text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Ca làm
          </th>
          <th className="w-36 px-3 py-2 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Giờ bắt đầu
          </th>
          <th className="w-36 px-3 py-2 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Giờ kết thúc
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
        {shifts.map((row, index) => (
          <tr key={row.stt} className="hover:bg-[var(--color-muted)] transition-colors">
            <td className="px-3 py-2 text-center text-sm font-medium text-[var(--color-foreground)]">
              {row.stt}
            </td>
            <td className="px-3 py-2 text-left text-sm text-[var(--color-foreground)]">
              <input
                type="text"
                value={editedShifts[index]?.name || row.name}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].name = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-3 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="time"
                value={editedShifts[index]?.startTime || row.startTime}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].startTime = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-1 text-sm text-center bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-3 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="time"
                value={editedShifts[index]?.endTime || row.endTime}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].endTime = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-1 text-sm text-center bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-3 py-2 text-center">
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

export default WorkShiftTable;
