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
      <h3 className="text-xl font-bold mb-5 text-[#53A88B]">Thêm giống heo</h3>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên giống heo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onSave(name);
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

export default AddNewPigBreedModal;
