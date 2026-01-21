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
  onUpdate: (id: string, updateData: any) => Promise<void>;
}

type EditableField = "name" | "startTime" | "endTime";

type EditingCell = { row: number; field: EditableField } | null;

const WorkShiftTable: React.FC<WorkShiftTableProps> = ({
  shifts,
  editedShifts,
  setEditedShifts,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const handleFinishEditing = async (index: number, field: EditableField) => {
    const originalRow = shifts[index];
    const editedRow = editedShifts[index];
    
    if (!originalRow || !editedRow) {
      setEditingCell(null);
      return;
    }

    const value = editedRow[field]?.trim();
    const oldValue = originalRow[field];

    if (field === "startTime" || field === "endTime") {
      if (editedRow.startTime >= editedRow.endTime) {
        alert("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
        const resetEdited = [...editedShifts];
        resetEdited[index] = { ...originalRow };
        setEditedShifts(resetEdited);
        setEditingCell(null);
        return;
      }
    }

    const fieldMapping = {
      name: "session",
      startTime: "start_time",
      endTime: "end_time",
    };

    if (value && value !== oldValue) {
      const dbField = fieldMapping[field];
      try {
        await onUpdate(originalRow.id!, { [dbField]: value });
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
      }
    }
    
    setEditingCell(null);
  };

  const updateValue = (
    index: number,
    field: EditableField,
    value: string
  ) => {
    const newEdited = [...editedShifts];
    newEdited[index] = { ...newEdited[index], [field]: value };
    setEditedShifts(newEdited);
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm"> 
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-3 py-3 text-center text-sm font-semibold uppercase">STT</th>
            <th className="w-[150px] px-3 py-3 text-center text-sm font-semibold">Ca làm</th>
            <th className="w-[150px] px-3 py-3 text-center text-sm font-semibold">Giờ bắt đầu</th>
            <th className="w-[150px] px-3 py-3 text-center text-sm font-semibold">Giờ kết thúc</th>
            <th className="w-[80px] px-3 py-3 text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="h-5 w-5 text-emerald-600 align-middle cursor-pointer"
              />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-100">
          {shifts.map((row, index) => {
            const current = editedShifts[index] || row;

            return (
              <tr
                key={row.id || index}
                className="hover:bg-gray-100 transition-colors divide-x divide-emerald-50"
              >
                <td className="px-3 py-3 text-center align-middle font-medium text-gray-500">
                  {row.stt}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index && editingCell.field === "name" ? (
                    <input
                      autoFocus
                      type="text"
                      value={current.name}
                      onChange={(e) => updateValue(index, "name", e.target.value)}
                      onBlur={() => handleFinishEditing(index, "name")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFinishEditing(index, "name");
                        if (e.key === "Escape") setEditingCell(null);
                      }}
                      className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCell({ row: index, field: "name" })}
                      className="block cursor-pointer rounded-md px-2 py-1 hover:bg-emerald-50 text-emerald-900 font-medium"
                    >
                      {current.name}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index && editingCell.field === "startTime" ? (
                    <input
                      autoFocus
                      type="time"
                      value={current.startTime}
                      onChange={(e) => updateValue(index, "startTime", e.target.value)}
                      onBlur={() => handleFinishEditing(index, "startTime")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFinishEditing(index, "startTime");
                        if (e.key === "Escape") setEditingCell(null);
                      }}
                      className="w-full border border-emerald-200 rounded-md px-1 py-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCell({ row: index, field: "startTime" })}
                      className="inline-block w-full cursor-pointer rounded-md px-1 py-1 hover:bg-emerald-50"
                    >
                      {current.startTime}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {editingCell?.row === index && editingCell.field === "endTime" ? (
                    <input
                      autoFocus
                      type="time"
                      value={current.endTime}
                      onChange={(e) => updateValue(index, "endTime", e.target.value)}
                      onBlur={() => handleFinishEditing(index, "endTime")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFinishEditing(index, "endTime");
                        if (e.key === "Escape") setEditingCell(null);
                      }}
                      className="w-full border border-emerald-200 rounded-md px-1 py-1 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCell({ row: index, field: "endTime" })}
                      className="inline-block w-full cursor-pointer rounded-md px-1 py-1 hover:bg-emerald-50"
                    >
                      {current.endTime}
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 text-center align-middle">
                  {!row.hasAssignments && (
                    <input
                      type="checkbox"
                      checked={checkedRows[index] ?? false}
                      onChange={() => toggleRow(index)}
                      className="h-5 w-5 text-emerald-600 align-middle cursor-pointer"
                    />
                  )}
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