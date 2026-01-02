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
  const [checkedRows, setCheckedRows] = useState<boolean[]>(diseases.map(() => false));

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = diseases.length > 0 && checkedRows.every(Boolean);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(diseases.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addDisease = (name: string) => {
    setDiseases([...diseases, { stt: diseases.length + 1, name }]);
    setCheckedRows([...checkedRows, false]); 
  };

  const deleteSelected = () => {
    const newDiseases = diseases.filter((_, index) => !checkedRows[index]);
    setDiseases(newDiseases.map((d, idx) => ({ ...d, stt: idx + 1 })));
    setCheckedRows(newDiseases.map(() => false)); 
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-in zoom-in duration-200 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              {hasSelected ? "Xác nhận xoá" : "Thông báo"}
            </h3>
            
            <p className="mb-6 text-center text-gray-600">
              {hasSelected 
                ? "Bạn có chắc muốn xoá các loại bệnh được chọn không?" 
                : "Vui lòng chọn loại bệnh từ danh sách để thực hiện thao tác xoá."}
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

export default DiseaseContent;