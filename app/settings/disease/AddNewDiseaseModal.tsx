"use client";

import React, { useState } from "react";

interface AddNewDiseaseModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewDiseaseModal: React.FC<AddNewDiseaseModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim() !== "") {
      onSave(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm loại bệnh mới</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại bệnh</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên loại bệnh"
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewDiseaseModal;