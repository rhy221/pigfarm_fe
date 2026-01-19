"use client";

import React, { useState, useEffect } from "react";
import PigBreedTable from "./PigBreedTable";
import AddNewPigBreedModal from "./AddNewPigBreedModal";

export interface PigBreed {
  id?: string;
  stt: number;
  name: string;
  hasPigs: boolean;
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
  const [pigBreeds, setPigBreeds] = useState<PigBreed[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchBreeds = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pig/breeds`); 
      
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      const mappedData = rawData.map((b: any, index: number) => ({
        id: b.id,
        stt: index + 1,
        name: b.breed_name,
        hasPigs: b.hasPigs,
      }));
      setPigBreeds(mappedData);
      setCheckedRows(mappedData.map(() => false));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, updateData: { breed_name: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pig/breeds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (res.ok) await fetchBreeds();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  const hasSelected = checkedRows.some((val) => val === true);


  const selectableIndices = pigBreeds
    .map((b, i) => (!b.hasPigs ? i : -1))
    .filter((i) => i !== -1);

  const allChecked =
    selectableIndices.length > 0 && 
    selectableIndices.every((i) => checkedRows[i]); 

  const toggleAll = () => {
    if (pigBreeds.length === 0) return;
    
    const nextValue = !allChecked;
    setCheckedRows(
      pigBreeds.map((b) => (b.hasPigs ? false : nextValue))
    );
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addPigBreed = async (name: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pig/breeds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breed_name: name }),
      });
      if (res.ok) fetchBreeds();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = pigBreeds.filter((_, i) => checkedRows[i]).map((b) => b.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pig/breeds`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (res.ok) {
        fetchBreeds();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <PigBreedTable
          pigBreeds={pigBreeds}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
          onUpdate={handleUpdate}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewPigBreedModal onClose={() => setIsAdding(false)} onSave={addPigBreed} />
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
                ? "Bạn có chắc muốn xoá các giống heo được chọn không?" 
                : "Vui lòng chọn giống heo từ danh sách để thực hiện thao tác xoá."}
            </p>
            <div className="flex justify-center gap-3">
              {hasSelected ? (
                <>
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">Hủy</button>
                  <button onClick={deleteSelected} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">Xác nhận</button>
                </>
              ) : (
                <button onClick={() => setShowDeleteConfirm(false)} className="px-8 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm">Đã hiểu</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PigBreedContent;