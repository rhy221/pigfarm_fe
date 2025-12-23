"use client";

import React, { useState } from "react";

interface AddNewChemicalTypeModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewChemicalTypeModal: React.FC<AddNewChemicalTypeModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim() === "") return;
    onSave(name.trim());
    setName("");
    onClose();
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Thêm loại hóa chất mới</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên loại hóa chất"
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewChemicalTypeModal;
