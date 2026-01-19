"use client";

import React, { useState, useEffect } from "react";
import CageTypeTable from "./CageTypeTable";
import AddNewCageTypeModal from "./AddNewCageTypeModal";

export interface CageType {
  id?: string;
  stt: number;
  loaiChuong: string;
  hasPigs: boolean;
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
  const [cageTypes, setCageTypes] = useState<CageType[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types`);
      const result = await res.json();
      const rawData = Array.isArray(result) ? result : (result.data || []);
      
      const mappedData = rawData.map((t: any, index: number) => ({
        id: t.id,
        stt: index + 1,
        loaiChuong: t.pen_type_name,
        hasPigs: t._count?.pens > 0,
      }));
      setCageTypes(mappedData);
    } catch (error) {
      console.error("Lỗi tải loại chuồng:", error);
    }
  };

  const handleUpdate = async (id: string, updateData: { pen_type_name: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        await fetchTypes();
      } else {
        const err = await res.json();
        console.error("Lỗi cập nhật:", err);
        fetchTypes();
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    setCheckedRows(cageTypes.map(() => false));
  }, [cageTypes]);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = cageTypes.length > 0 && 
                   checkedRows.length > 0 && 
                   checkedRows.every(Boolean);

  const toggleAll = () => {
    if (cageTypes.length === 0) return;
    const isCurrentlyAllChecked = cageTypes.every((t, i) => t.hasPigs || checkedRows[i]);
    const nextValue = !isCurrentlyAllChecked;
    setCheckedRows(cageTypes.map((t) => (t.hasPigs ? false : nextValue)));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addCageType = async (loaiChuong: string) => {
    const isDuplicate = cageTypes.some(t => t.loaiChuong.toLowerCase() === loaiChuong.toLowerCase());
    if (isDuplicate) {
      alert("Loại chuồng này đã tồn tại!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pen_type_name: loaiChuong }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      fetchTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = cageTypes
        .filter((_, index) => checkedRows[index])
        .map((ct) => ct.id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Không thể xoá loại chuồng đang được sử dụng");
      } else {
        fetchTypes();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Lỗi xoá loại chuồng:", error);
    }
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <CageTypeTable
          cageTypes={cageTypes}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
          onUpdate={handleUpdate}
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