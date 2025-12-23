"use client";

import React, { useState } from "react";
import PigBreedTable from "./PigBreedTable";
import AddNewPigBreedModal from "./AddNewPigBreedModal";

export interface PigBreed {
  stt: number;
  name: string;
}

interface PigBreedContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PigBreedContent: React.FC<PigBreedContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [pigBreeds, setPigBreeds] = useState<PigBreed[]>([
    { stt: 1, name: "Landrace" },
    { stt: 2, name: "Yorkshire" },
    { stt: 3, name: "Duroc" },
  ]);

  const [editedPigBreeds, setEditedPigBreeds] = useState<PigBreed[]>([...pigBreeds]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(pigBreeds.map(() => true));

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addPigBreed = (name: string) => {
    setPigBreeds([...pigBreeds, { stt: pigBreeds.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newBreeds = pigBreeds.filter((_, index) => !checkedRows[index]);
    setPigBreeds(newBreeds.map((b, idx) => ({ ...b, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <PigBreedTable
          pigBreeds={pigBreeds}
          editedPigBreeds={editedPigBreeds}
          setEditedPigBreeds={setEditedPigBreeds}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewPigBreedModal onClose={() => setIsAdding(false)} onSave={addPigBreed} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các giống heo được chọn không?</p>
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

export default PigBreedContent;
