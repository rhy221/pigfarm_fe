"use client";

import React, { useState, useEffect } from "react";

interface AddNewCageModalProps {
  onClose: () => void;
  onSave: (chuong: string, loaiChuongId: string) => void;
}

const AddNewCageModal: React.FC<AddNewCageModalProps> = ({ onClose, onSave }) => {
  const [chuong, setChuong] = useState("");
  const [loaiChuongId, setLoaiChuongId] = useState("");
  const [cageTypes, setCageTypes] = useState<{ id: string, pen_type_name: string }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pens/types`);
        const data = await res.json();
        const types = Array.isArray(data) ? data : (data.data || []);
        setCageTypes(types);
        if (types.length > 0) setLoaiChuongId(types[0].id);
      } catch (error) {
        console.error("Lỗi lấy loại chuồng:", error);
      }
    };
    fetchTypes();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-sm">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm chuồng trại</h3>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chuồng</label>
          <input
            type="text"
            placeholder="Ví dụ: A004"
            value={chuong}
            onChange={(e) => setChuong(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại chuồng</label>
          <select
            value={loaiChuongId}
            onChange={(e) => setLoaiChuongId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {cageTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.pen_type_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            if (chuong && loaiChuongId) {
              onSave(chuong, loaiChuongId);
              onClose();
            }
          }}
          className="px-6 py-2 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewCageModal;