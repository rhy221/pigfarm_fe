"use client";

import React, { useState } from "react";
import MaterialTypeTable from "./MaterialTypeTable";
import AddNewMaterialTypeModal from "./AddNewMaterialTypeModal";

export interface MaterialType {
  stt: number;
  name: string;
}

interface MaterialTypeContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const MaterialTypeContent: React.FC<MaterialTypeContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [materials, setMaterials] = useState<MaterialType[]>([
    { stt: 1, name: "Vật tư A" },
    { stt: 2, name: "Vật tư B" },
    { stt: 3, name: "Vật tư C" },
  ]);

  const [editedMaterials, setEditedMaterials] = useState<MaterialType[]>([...materials]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(materials.map(() => true));

  const allChecked = checkedRows.every(Boolean);
  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addMaterial = (name: string) => {
    setMaterials([...materials, { stt: materials.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newMaterials = materials.filter((_, index) => !checkedRows[index]);
    setMaterials(newMaterials.map((m, idx) => ({ ...m, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <MaterialTypeTable
          materials={materials}
          editedMaterials={editedMaterials}
          setEditedMaterials={setEditedMaterials}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewMaterialTypeModal onClose={() => setIsAdding(false)} onSave={addMaterial} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">Bạn có chắc muốn xoá các loại vật tư được chọn không?</p>
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

export default MaterialTypeContent;
