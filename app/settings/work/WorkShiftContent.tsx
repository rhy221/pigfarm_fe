"use client";

import React, { useState } from "react";
import WorkShiftTable from "./WorkShiftTable";
import AddNewWorkShiftModal from "./AddNewWorkShiftModal";

export interface WorkShift {
  stt: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface WorkShiftContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkShiftContent: React.FC<WorkShiftContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [shifts, setShifts] = useState<WorkShift[]>([
    { stt: 1, name: "Ca sáng", startTime: "06:00", endTime: "14:00" },
    { stt: 2, name: "Ca chiều", startTime: "14:00", endTime: "22:00" },
    { stt: 3, name: "Ca đêm", startTime: "22:00", endTime: "06:00" },
  ]);

  const [editedShifts, setEditedShifts] = useState<WorkShift[]>([...shifts]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(shifts.map(() => true));

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addShift = (name: string, startTime: string, endTime: string) => {
    setShifts([...shifts, { stt: shifts.length + 1, name, startTime, endTime }]);
  };

  const deleteSelected = () => {
    const newShifts = shifts.filter((_, index) => !checkedRows[index]);
    setShifts(newShifts.map((s, idx) => ({ ...s, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <WorkShiftTable
          shifts={shifts}
          editedShifts={editedShifts}
          setEditedShifts={setEditedShifts}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-96 flex-shrink-0">
          <AddNewWorkShiftModal onClose={() => setIsAdding(false)} onSave={addShift} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các ca làm được chọn không?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkShiftContent;
