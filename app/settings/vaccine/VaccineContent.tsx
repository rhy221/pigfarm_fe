"use client";

import React, { useState } from "react";
import VaccineTable from "./VaccineTable";
import AddNewVaccineModal from "./AddNewVaccineModal";

export interface Vaccine {
  stt: number;
  name: string;
}

interface VaccineContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const VaccineContent: React.FC<VaccineContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([
    { stt: 1, name: "Vaccine A" },
    { stt: 2, name: "Vaccine B" },
    { stt: 3, name: "Vaccine C" },
  ]);

  const [editedVaccines, setEditedVaccines] = useState<Vaccine[]>([...vaccines]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(vaccines.map(() => true));

  const allChecked = checkedRows.every(Boolean);
  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addVaccine = (name: string) => {
    setVaccines([...vaccines, { stt: vaccines.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newVaccines = vaccines.filter((_, index) => !checkedRows[index]);
    setVaccines(newVaccines.map((v, idx) => ({ ...v, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <VaccineTable
          vaccines={vaccines}
          editedVaccines={editedVaccines}
          setEditedVaccines={setEditedVaccines}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewVaccineModal onClose={() => setIsAdding(false)} onSave={addVaccine} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các vắc xin được chọn không?</p>
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

export default VaccineContent;
