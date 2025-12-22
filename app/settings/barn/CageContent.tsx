"use client";

import React, { useState, useEffect } from "react";
import CageTable, { Cage } from "./CageTable";
import AddNewCageModal from "./AddNewCageModal";

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

  const [checkedRows, setCheckedRows] = useState<boolean[]>(cages.map(() => true));

  useEffect(() => {
    setCheckedRows(cages.map(() => true));
  }, [cages]);

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các chuồng được chọn không?</p>
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

export default CageContent;
