"use client";

import React, { useState, useEffect } from "react";
import CageTable from "./CageTable";
import AddNewCageModal from "./AddNewCageModal";

export interface Cage {
  stt: number;
  chuong: string;
  loaiChuong: string;
  trangThai: string;
}

interface CageContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CageContent: React.FC<CageContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [cages, setCages] = useState<Cage[]>([
    { stt: 1, chuong: "A001", loaiChuong: "Chuồng thịt", trangThai: "Có heo" },
    { stt: 2, chuong: "A002", loaiChuong: "Chuồng thịt", trangThai: "Có heo" },
    { stt: 3, chuong: "A003", loaiChuong: "Chuồng thịt", trangThai: "Có heo" },
  ]);

  const [editedCages, setEditedCages] = useState<Cage[]>([...cages]);

  useEffect(() => {
    setEditedCages([...cages]);
  }, [cages]);

  const [checkedRows, setCheckedRows] = useState<boolean[]>(cages.map(() => false));

  useEffect(() => {
    setCheckedRows(cages.map(() => false));
  }, [cages]);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = cages.length > 0 && checkedRows.every(Boolean);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(cages.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addCage = (chuong: string, loaiChuong: string) => {
    setCages([...cages, { stt: cages.length + 1, chuong, loaiChuong, trangThai: "Chưa có heo" }]);
  };

  const deleteSelected = () => {
    const newCages = cages.filter((_, index) => !checkedRows[index]);
    setCages(newCages.map((cage, idx) => ({ ...cage, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <CageTable
          cages={cages}
          editedCages={editedCages}
          setEditedCages={setEditedCages}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewCageModal onClose={() => setIsAdding(false)} onSave={addCage} />
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
                ? "Bạn có chắc muốn xoá các chuồng được chọn không?" 
                : "Vui lòng chọn chuồng từ danh sách để thực hiện thao tác xoá."}
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

export default CageContent;