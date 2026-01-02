"use client";

import React, { useState, useEffect } from "react";
import CageTypeTable from "./CageTypeTable";
import AddNewCageTypeModal from "./AddNewCageTypeModal";

export interface CageType {
  stt: number;
  loaiChuong: string;
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
    { stt: 1, loaiChuong: "Chuồng thịt"},
    { stt: 2, loaiChuong: "Chuồng cách ly"},
  ]);

  const [editedCageTypes, setEditedCageTypes] = useState<CageType[]>([...cageTypes]);
  useEffect(() => setEditedCageTypes([...cageTypes]), [cageTypes]);

  const [checkedRows, setCheckedRows] = useState<boolean[]>(cageTypes.map(() => false));
  
  useEffect(() => {
    setCheckedRows(cageTypes.map(() => false));
  }, [cageTypes]);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = cageTypes.length > 0 && checkedRows.every(Boolean);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(cageTypes.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addCageType = (loaiChuong: string) => {
    setCageTypes([
      ...cageTypes,
      { stt: cageTypes.length + 1, loaiChuong },
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-in zoom-in duration-200 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              {hasSelected ? "Xác nhận xoá" : "Thông báo"}
            </h3>
            
            <p className="mb-6 text-center text-gray-600">
              {hasSelected 
                ? "Bạn có chắc muốn xoá các loại chuồng được chọn không?" 
                : "Vui lòng chọn loại chuồng từ danh sách để thực hiện thao tác xoá."}
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

export default CageTypeContent;