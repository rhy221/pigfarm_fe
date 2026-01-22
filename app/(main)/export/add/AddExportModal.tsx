"use client";

import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";

export interface SelectedItem {
  chuong_id: string;
  chuong: string;
  donGia: number;
}

interface AddExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedItems: SelectedItem[]) => void;
}

const AddExportModal = ({ isOpen, onClose, onSave }: AddExportModalProps) => {
  const [breedData, setBreedData] = useState<Record<string, any[]>>({});
  const [selectedBreed, setSelectedBreed] = useState("");
  const [currentCageId, setCurrentCageId] = useState("");
  const [price, setPrice] = useState<number>(60000); 
  const [tempList, setTempList] = useState<SelectedItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/facility/pens/grouped-by-breed`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            const filteredData: Record<string, any[]> = {};

            Object.keys(data).forEach((breed) => {
              const validCages = data[breed].filter((cage: any) => 
                !cage.pen_name.trim().toLowerCase().startsWith('c')
              );

              if (validCages.length > 0) {
                filteredData[breed] = validCages;
              }
            });

            setBreedData(filteredData);
            
            const breeds = Object.keys(filteredData);
            if (breeds.length > 0) {
              const firstBreed = breeds[0];
              setSelectedBreed(firstBreed);
              if (filteredData[firstBreed] && filteredData[firstBreed].length > 0) {
                setCurrentCageId(filteredData[firstBreed][0].id);
              }
            } else {
              setSelectedBreed("");
              setCurrentCageId("");
            }
          }
        })
        .catch((err) => console.error("Lỗi fetch dữ liệu chuồng:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedBreed && breedData[selectedBreed] && breedData[selectedBreed].length > 0) {
      setCurrentCageId(breedData[selectedBreed][0].id);
    } else {
      setCurrentCageId("");
    }
  }, [selectedBreed, breedData]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!currentCageId) return;

    const cageObj = breedData[selectedBreed]?.find((c) => c.id === currentCageId);
    
    if (cageObj && !tempList.some((item) => item.chuong_id === currentCageId)) {
      setTempList([
        ...tempList,
        {
          chuong_id: cageObj.id, 
          chuong: cageObj.pen_name,
          donGia: price,
        },
      ]);
    }
  };

  const handleRemove = (cageId: string) => {
    setTempList(tempList.filter((item) => item.chuong_id !== cageId));
  };

  const handleFinalSave = () => {
    onSave(tempList);
    setTempList([]);
    onClose();
  };

  const formatter = new Intl.NumberFormat("vi-VN");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-emerald-700">Thêm chuồng xuất</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Giống</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm text-sm"
              >
                {Object.keys(breedData).map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Chuồng</label>
              <select
                value={currentCageId}
                onChange={(e) => setCurrentCageId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm text-sm"
              >
                {Array.isArray(breedData[selectedBreed]) && 
                  breedData[selectedBreed].map((cage: any) => (
                    <option key={cage.id} value={cage.id}>
                      {cage.pen_name}
                    </option>
                ))} 
              </select>
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Đơn giá (VNĐ/kg)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-sm"
                />
              </div>
              <button
                onClick={handleAdd}
                className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
              >
                Thêm
              </button>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8 max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-emerald-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-center w-16">STT</th>
                  <th className="px-6 py-3 font-bold text-emerald-700">Chuồng</th>
                  <th className="px-6 py-3 font-bold text-emerald-700 text-right">Đơn giá dự kiến</th>
                  <th className="px-6 py-3 text-center w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tempList.map((item, index) => (
                  <tr key={item.chuong_id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.chuong}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {formatter.format(item.donGia)} <span className="text-[10px] text-gray-400">VNĐ</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemove(item.chuong_id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {tempList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                      Vui lòng chọn chuồng và nhấn "Thêm"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleFinalSave}
              disabled={tempList.length === 0}
              className="px-8 py-3 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300"
            >
              Lưu vào phiếu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExportModal;
