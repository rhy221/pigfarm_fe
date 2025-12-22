"use client";

import React, { useState } from "react";

interface AddNewCageModalProps {
  onClose: () => void;
  onSave: (chuong: string, loaiChuong: string) => void;
}

const AddNewCageModal: React.FC<AddNewCageModalProps> = ({ onClose, onSave }) => {
  const [chuong, setChuong] = useState("A004");
  const [loaiChuong, setLoaiChuong] = useState("Chuồng thịt");

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-sm">
      <h3 className="text-xl font-bold mb-5 text-[#53A88B]">Thêm chuồng trại</h3>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chuồng</label>
          <input
            type="text"
            value={chuong}
            onChange={(e) => setChuong(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại chuồng</label>
          <input
            type="text"
            value={loaiChuong}
            onChange={(e) => setLoaiChuong(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            onSave(chuong, loaiChuong);
            onClose();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewCageModal;
