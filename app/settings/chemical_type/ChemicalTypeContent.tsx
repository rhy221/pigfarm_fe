"use client";

import React, { useState, useEffect } from "react";
import ChemicalTypeTable from "./ChemicalTypeTable";
import AddNewChemicalTypeModal from "./AddNewChemicalTypeModal";

export interface ChemicalType {
  id?: string;
  stt: number;
  name: string;
  hasHistory: boolean;
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
  const [chemicalTypes, setChemicalTypes] = useState<ChemicalType[]>([]);
  const [editedChemicalTypes, setEditedChemicalTypes] = useState<ChemicalType[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchChemicalTypes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chemicals`);
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      const mappedData = rawData.map((c: any, index: number) => ({
        id: c.id,
        stt: index + 1,
        name: c.name,
        hasHistory: c.hasHistory || false,
      }));
      setChemicalTypes(mappedData);
      setEditedChemicalTypes(mappedData);
      setCheckedRows(mappedData.map(() => false));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchChemicalTypes();
  }, []);

  const handleUpdate = async (id: string, name: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chemicals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) await fetchChemicalTypes();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const addChemicalType = async (name: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chemicals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchChemicalTypes();
        if (setIsAdding) setIsAdding(false);
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = chemicalTypes
        .filter((_, i) => checkedRows[i])
        .map((c) => c.id);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chemicals`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      
      if (res.ok) {
        await fetchChemicalTypes();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const selectableIndices = chemicalTypes
    .map((c, i) => (!c.hasHistory ? i : -1))
    .filter((i) => i !== -1);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = selectableIndices.length > 0 && 
                     selectableIndices.every((i) => checkedRows[i]);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(chemicalTypes.map((c) => (c.hasHistory ? false : nextValue)));
  };

  const toggleRow = (index: number) => {
    if (chemicalTypes[index].hasHistory) return;
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
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
          onUpdate={handleUpdate}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewChemicalTypeModal 
            onClose={() => setIsAdding(false)} 
            onSave={fetchChemicalTypes} 
          />
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
                ? "Bạn có chắc muốn xoá các loại hóa chất được chọn không?" 
                : "Vui lòng chọn loại hóa chất từ danh sách để thực hiện thao tác xoá."}
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

export default ChemicalTypeContent;