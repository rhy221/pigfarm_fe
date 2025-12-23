"use client";

import React, { useState } from "react";
import DiseaseTable from "./DiseaseTable";
import AddNewDiseaseModal from "./AddNewDiseaseModal";

export interface Disease {
  stt: number;
  name: string;
}

interface DiseaseContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiseaseContent: React.FC<DiseaseContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [diseases, setDiseases] = useState<Disease[]>([
    { stt: 1, name: "Bệnh A" },
    { stt: 2, name: "Bệnh B" },
    { stt: 3, name: "Bệnh C" },
  ]);

  const [editedDiseases, setEditedDiseases] = useState<Disease[]>([...diseases]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(diseases.map(() => true));

  const allChecked = checkedRows.every(Boolean);
  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addDisease = (name: string) => {
    setDiseases([...diseases, { stt: diseases.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newDiseases = diseases.filter((_, index) => !checkedRows[index]);
    setDiseases(newDiseases.map((d, idx) => ({ ...d, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <DiseaseTable
          diseases={diseases}
          editedDiseases={editedDiseases}
          setEditedDiseases={setEditedDiseases}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewDiseaseModal onClose={() => setIsAdding(false)} onSave={addDisease} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các loại bệnh được chọn không?</p>
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

export default DiseaseContent;
