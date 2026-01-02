"use client";

import React, { useState } from "react";
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

type EditingCell =
  | { row: number; field: "name" | "startTime" | "endTime" }
  | null;

const WorkShiftTable: React.FC<WorkShiftTableProps> = ({
  shifts,
  editedShifts,
  setEditedShifts,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const updateValue = (
    index: number,
    field: "name" | "startTime" | "endTime",
    value: string
  ) => {
    const newEdited = [...editedShifts];
    if (!newEdited[index]) newEdited[index] = { ...shifts[index] };
    newEdited[index][field] = value;
    setEditedShifts(newEdited);
  };

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-[var(--color-muted)]">
          <tr className="divide-x divide-[var(--color-border)]/50">
            <th className="w-[80px] px-3 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              STT
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              Ca làm
            </th>
            <th className="w-[150px] px-3 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              Giờ bắt đầu
            </th>
            <th className="w-[150px] px-3 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              Giờ kết thúc
            </th>
            <th className="w-[80px] px-3 py-3 text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="h-5 w-5 text-[var(--color-primary)] align-middle"
              />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {shifts.map((row, index) => {
            const current = editedShifts[index] || row;

            return (
              <tr
                key={row.stt}
                className="hover:bg-[var(--color-muted)]/50 transition-colors divide-x divide-[var(--color-border)]/30"
              >
                <td className="px-3 py-3 text-center align-middle font-medium">
                  {row.stt}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index &&
                  editingCell.field === "name" ? (
                    <input
                      autoFocus
                      type="text"
                      value={current.name}
                      onChange={(e) =>
                        updateValue(index, "name", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingCell(null)
                      }
                      className="w-full border border-[var(--color-border)] rounded-md px-2 py-1 text-sm text-center focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "name" })
                      }
                      className="block cursor-pointer rounded-md px-2 py-1 hover:bg-[var(--color-muted)]"
                    >
                      {current.name}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index &&
                  editingCell.field === "startTime" ? (
                    <input
                      autoFocus
                      type="time"
                      value={current.startTime}
                      onChange={(e) =>
                        updateValue(index, "startTime", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingCell(null)
                      }
                      className="w-full border border-[var(--color-border)] rounded-md px-1 py-1 text-sm text-center focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "startTime" })
                      }
                      className="inline-block w-full cursor-pointer rounded-md px-1 py-1 hover:bg-[var(--color-muted)]"
                    >
                      {current.startTime}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index &&
                  editingCell.field === "endTime" ? (
                    <input
                      autoFocus
                      type="time"
                      value={current.endTime}
                      onChange={(e) =>
                        updateValue(index, "endTime", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingCell(null)
                      }
                      className="w-full border border-[var(--color-border)] rounded-md px-1 py-1 text-sm text-center focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "endTime" })
                      }
                      className="inline-block w-full cursor-pointer rounded-md px-1 py-1 hover:bg-[var(--color-muted)]"
                    >
                      {current.endTime}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="h-5 w-5 text-[var(--color-primary)] align-middle cursor-pointer"
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

export default WorkShiftTable;