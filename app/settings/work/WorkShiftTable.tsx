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
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="w-12 px-3 py-2 text-center text-sm font-semibold text-gray-600 uppercase">STT</th>
          <th className="w-48 px-3 py-2 text-left text-sm font-semibold text-gray-600 uppercase">Ca làm</th>
          <th className="w-36 px-3 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Giờ bắt đầu</th>
          <th className="w-36 px-3 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Giờ kết thúc</th>
          <th className="w-16 px-3 py-2 text-center">
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
        {shifts.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="px-3 py-2 text-center text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="px-3 py-2 text-left text-sm text-gray-700">
              <input
                type="text"
                value={editedShifts[index]?.name || row.name}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].name = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </td>
            <td className="px-3 py-2 text-center text-sm text-gray-700">
              <input
                type="time"
                value={editedShifts[index]?.startTime || row.startTime}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].startTime = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-1 text-sm text-center"
              />
            </td>
            <td className="px-3 py-2 text-center text-sm text-gray-700">
              <input
                type="time"
                value={editedShifts[index]?.endTime || row.endTime}
                onChange={(e) => {
                  const newEdited = [...editedShifts];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].endTime = e.target.value;
                  setEditedShifts(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-1 text-sm text-center"
              />
            </td>
            <td className="px-3 py-2 text-center">
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

export default WorkShiftTable;
