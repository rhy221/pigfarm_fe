"use client";

import React, { useState } from "react";

interface AddNewMaterialTypeModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewMaterialTypeModal: React.FC<AddNewMaterialTypeModalProps> = ({ onClose, onSave }) => {
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
      <h3 className="text-lg font-bold mb-2">Thêm loại vật tư mới</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên loại vật tư"
        className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm"
      />
      <div className="flex justify-end gap-2">
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
          Thêm
        </button>
      </div>
    </div>
  );
};

export default AddNewMaterialTypeModal;
