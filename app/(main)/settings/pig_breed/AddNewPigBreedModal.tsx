"use client";

import React, { useState } from "react";

interface AddNewPigBreedModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewPigBreedModal: React.FC<AddNewPigBreedModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-sm">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm giống heo</h3>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên giống heo</label>
          <input
            type="text"
            placeholder="Ví dụ: Landrace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
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
            if (name.trim()) {
              onSave(name.trim());
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

export default AddNewPigBreedModal;