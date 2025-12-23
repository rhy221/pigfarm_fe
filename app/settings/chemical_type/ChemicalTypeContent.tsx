"use client";

import React, { useState } from "react";
import ChemicalTypeTable from "./ChemicalTypeTable";
import AddNewChemicalTypeModal from "./AddNewChemicalTypeModal";

export interface ChemicalType {
  stt: number;
  name: string;
}

interface ChemicalTypeContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChemicalTypeContent: React.FC<ChemicalTypeContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [chemicalTypes, setChemicalTypes] = useState<ChemicalType[]>([
    { stt: 1, name: "Thuốc sát trùng" },
    { stt: 2, name: "Kháng sinh" },
    { stt: 3, name: "Vitamin" },
  ]);

  const [editedChemicalTypes, setEditedChemicalTypes] = useState<ChemicalType[]>([...chemicalTypes]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(chemicalTypes.map(() => true));

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addChemicalType = (name: string) => {
    setChemicalTypes([...chemicalTypes, { stt: chemicalTypes.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newTypes = chemicalTypes.filter((_, index) => !checkedRows[index]);
    setChemicalTypes(newTypes.map((b, idx) => ({ ...b, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <ChemicalTypeTable
          chemicalTypes={chemicalTypes}
          editedChemicalTypes={editedChemicalTypes}
          setEditedChemicalTypes={setEditedChemicalTypes}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewChemicalTypeModal onClose={() => setIsAdding(false)} onSave={addChemicalType} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các loại hóa chất được chọn không?</p>
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

export default ChemicalTypeContent;
