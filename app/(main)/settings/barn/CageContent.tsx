"use client";

import React, { useState, useEffect } from "react";
import CageTable from "./CageTable";
import AddNewCageModal from "./AddNewCageModal";

export interface Cage {
  id?: string;
  stt: number;
  chuong: string;
  loaiChuong: string;
  loaiChuongId: string;
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
  const [cages, setCages] = useState<Cage[]>([]);
  const [editedCages, setEditedCages] = useState<Cage[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchCages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens`);
      const result = await res.json();
      const rawData = Array.isArray(result) ? result : (result.data || []);
      const mappedData = rawData.map((p: any, index: number) => ({
        id: p.id,
        stt: index + 1,
        chuong: p.pen_name,
        loaiChuong: p.pen_types?.pen_type_name || "Chưa xác định",
        loaiChuongId: p.pen_type_id,
        trangThai: p.pigs && p.pigs.length > 0 ? "Có heo" : "Trống"
      }));
      setCages(mappedData);
    } catch (error) {
      console.error("Lỗi tải danh sách chuồng:", error);
      setCages([]);
    }
  };

  const handleUpdate = async (id: string, updateData: { pen_name?: string; pen_type_id?: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        await fetchCages();
      } else {
        const err = await res.json();
        console.error("Lỗi cập nhật chi tiết:", err.message || err);
        alert(err.message || "Cập nhật thất bại");
        fetchCages(); 
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  useEffect(() => {
    fetchCages();
  }, []);

  useEffect(() => {
    setEditedCages([...cages]);
    setCheckedRows(cages.map(() => false));
  }, [cages]);

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = cages.length > 0 && cages.every((m, i) => m.trangThai === "Có heo" || checkedRows[i]);

  const toggleAll = () => {
    const isCurrentlyAllChecked = cages.length > 0 && cages.every((m, i) => m.trangThai === "Có heo" || checkedRows[i]);
    const nextValue = !isCurrentlyAllChecked;
    setCheckedRows(cages.map((m) => (m.trangThai === "Có heo" ? false : nextValue)));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addCage = async (chuong: string, loaiChuongId: string) => {
    const isDuplicate = cages.some(c => c.chuong.toLowerCase() === chuong.toLowerCase());
    if (isDuplicate) {
      alert("Tên chuồng này đã tồn tại trong danh sách!");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pen_name: chuong, pen_type_id: loaiChuongId }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      fetchCages();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = cages
        .filter((_, index) => checkedRows[index])
        .map((c) => c.id);
      if (idsToDelete.length === 0) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.message || "Không thể xoá chuồng");
        return;
      }
      fetchCages();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Lỗi xoá chuồng:", error);
    }
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
          onUpdate={handleUpdate}
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

export default CageContent;