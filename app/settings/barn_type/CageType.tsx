"use client";

import React, { useState, useEffect } from "react";
import CageTypeTable from "./CageTypeTable";
import AddNewCageTypeModal from "./AddNewCageTypeModal";

export interface CageType {
  stt: number;
  loaiChuong: string;
  moTa: string;
}

interface CageTypeContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CageTypeContent: React.FC<CageTypeContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [cageTypes, setCageTypes] = useState<CageType[]>([
    { stt: 1, loaiChuong: "Chuồng thịt", moTa: "Dùng để nuôi heo thịt" },
    { stt: 2, loaiChuong: "Chuồng cách ly", moTa: "Dùng cho heo mới hoặc bệnh" },
  ]);

  const [editedCageTypes, setEditedCageTypes] = useState<CageType[]>([...cageTypes]);
  useEffect(() => setEditedCageTypes([...cageTypes]), [cageTypes]);

  const [checkedRows, setCheckedRows] = useState<boolean[]>(cageTypes.map(() => true));
  useEffect(() => setCheckedRows(cageTypes.map(() => true)), [cageTypes]);

  const allChecked = checkedRows.every(Boolean);
  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addCageType = (loaiChuong: string, moTa: string) => {
    setCageTypes([
      ...cageTypes,
      { stt: cageTypes.length + 1, loaiChuong, moTa },
    ]);
  };

  const deleteSelected = () => {
    const newTypes = cageTypes.filter((_, index) => !checkedRows[index]);
    setCageTypes(newTypes.map((ct, idx) => ({ ...ct, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <CageTypeTable
          cageTypes={cageTypes}
          editedCageTypes={editedCageTypes}
          setEditedCageTypes={setEditedCageTypes}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewCageTypeModal onClose={() => setIsAdding(false)} onSave={addCageType} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các loại chuồng được chọn không?</p>
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

export default CageTypeContent;
