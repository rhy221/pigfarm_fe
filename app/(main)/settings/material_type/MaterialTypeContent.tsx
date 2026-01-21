"use client";

import React, { useState, useEffect } from "react";
import MaterialTypeTable from "./MaterialTypeTable";
import AddNewMaterialTypeModal from "./AddNewMaterialTypeModal";

export interface MaterialType {
  id?: string;
  stt: number;
  name: string;
  type: string;
  description: string;
  inUse: boolean;
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
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [editedMaterials, setEditedMaterials] = useState<MaterialType[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouse-categories`);
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      const mappedData = rawData.map((item: any, index: number) => ({
        id: item.id,
        stt: index + 1,
        name: item.name,
        type: item.type,
        description: item.description || "",
        inUse: item._count?.products > 0
      }));
      setMaterials(mappedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, updateData: { name?: string; description?: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouse-categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        setMaterials((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updateData } : item))
        );
        await fetchMaterials();
      } else {
        const err = await res.json();
        console.error("Lỗi cập nhật:", err);
        fetchMaterials(); 
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    setEditedMaterials([...materials]);
    setCheckedRows(materials.map(() => false));
  }, [materials]);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = materials.length > 0 && materials.every((m, i) => m.inUse || checkedRows[i]);

  const toggleAll = () => {
    const isAllChecked = materials.length > 0 && materials.every((m, i) => m.inUse || checkedRows[i]);
    const nextValue = !isAllChecked;
    setCheckedRows(materials.map((m) => (m.inUse ? false : nextValue)));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addMaterial = async (data: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouse-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchMaterials();
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = materials
        .filter((_, index) => checkedRows[index])
        .map((m) => m.id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/warehouse-categories`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (res.ok) {
        fetchMaterials();
        setShowDeleteConfirm(false);
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (error) {
      console.error(error);
    }
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
          onUpdate={handleUpdate}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewMaterialTypeModal onClose={() => setIsAdding(false)} onSave={addMaterial} />
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
                ? "Bạn có chắc muốn xoá các loại vật tư được chọn không?" 
                : "Vui lòng chọn loại vật tư từ danh sách để thực hiện thao tác xoá."}
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

export default MaterialTypeContent;