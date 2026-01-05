"use client";

import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";

const BREED_DATA: Record<string, string[]> = {
  Landrace: ["A001", "A002", "A003", "A004", "A005"],
  Yorkshire: ["B001", "B002", "B003", "B004", "B005"],
};

export interface SelectedItem {
  chuong: string;
  donGia: number;
}

interface AddExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedItems: SelectedItem[]) => void;
}

const AddExportModal = ({ isOpen, onClose, onSave }: AddExportModalProps) => {
  const [selectedBreed, setSelectedBreed] = useState("Landrace");
  const [currentCage, setCurrentCage] = useState("A001");
  const [price, setPrice] = useState<number>(120000);
  const [tempList, setTempList] = useState<SelectedItem[]>([]);

  useEffect(() => {
    if (BREED_DATA[selectedBreed]) {
      setCurrentCage(BREED_DATA[selectedBreed][0]);
    }
  }, [selectedBreed]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!tempList.some((item) => item.chuong === currentCage)) {
      setTempList([...tempList, { chuong: currentCage, donGia: price }]);
    }
  };

  const handleRemove = (cageName: string) => {
    setTempList(tempList.filter((item) => item.chuong !== cageName));
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
                {Object.keys(BREED_DATA).map((breed) => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Chuồng</label>
              <select
                value={currentCage}
                onChange={(e) => setCurrentCage(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm text-sm"
              >
                {BREED_DATA[selectedBreed].map((cage) => (
                  <option key={cage} value={cage}>{cage}</option>
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
                  <tr key={item.chuong} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4 text-center text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.chuong}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {formatter.format(item.donGia)} <span className="text-[10px] text-gray-400">VNĐ</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleRemove(item.chuong)} 
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
              className="bg-emerald-600 text-white px-12 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 disabled:bg-gray-300 disabled:shadow-none"
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