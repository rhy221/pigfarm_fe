"use client";

import React, { useState, useEffect } from "react";
import WorkShiftTable from "./WorkShiftTable";
import AddNewWorkShiftModal from "./AddNewWorkShiftModal";

export interface WorkShift {
  id?: string;
  stt: number;
  name: string;
  startTime: string;
  endTime: string;
  hasAssignments: boolean;
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
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [editedShifts, setEditedShifts] = useState<WorkShift[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchShifts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-shifts`);
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      const mappedData = rawData.map((s: any, index: number) => ({
          id: s.id,
          stt: index + 1,
          name: s.session,
          startTime: s.start_time, 
          endTime: s.end_time,
          hasAssignments: s.hasAssignments || false,
      }));
      setShifts(mappedData);
      setEditedShifts(mappedData); 
      setCheckedRows(mappedData.map(() => false));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleUpdate = async (id: string, updateData: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-shifts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    
    if (res.ok) {
      await fetchShifts(); 
    }
  };

  const addShift = async () => {
    await fetchShifts();
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = shifts.filter((_, i) => checkedRows[i]).map((s) => s.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-shifts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (res.ok) {
        await fetchShifts();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectableIndices = shifts
    .map((s, i) => (!s.hasAssignments ? i : -1))
    .filter((i) => i !== -1);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = selectableIndices.length > 0 && selectableIndices.every((i) => checkedRows[i]);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(shifts.map((s) => (s.hasAssignments ? false : nextValue)));
  };

  const toggleRow = (index: number) => {
    if (shifts[index].hasAssignments) return;
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
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
          onUpdate={handleUpdate}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-96 flex-shrink-0">
          <AddNewWorkShiftModal onClose={() => setIsAdding(false)} onSave={addShift} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-in zoom-in duration-200 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              {hasSelected ? "Xác nhận xoá" : "Thông báo"}
            </h3>
            
            <p className="mb-6 text-center text-gray-600">
              {hasSelected 
                ? "Bạn có chắc muốn xoá các ca làm được chọn không?" 
                : "Vui lòng chọn ca làm từ danh sách để thực hiện thao tác xoá."}
            </p>

            <div className="flex justify-center gap-3">
              {hasSelected ? (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Xác nhận
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-8 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm"
                >
                  Đã hiểu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkShiftContent;