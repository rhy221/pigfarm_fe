"use client";

import React, { useState } from "react";

interface AddNewVaccineModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewVaccineModal: React.FC<AddNewVaccineModalProps> = ({ onClose, onSave }) => {
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
      <h3 className="text-lg font-bold mb-2">Thêm vắc xin mới</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên vắc xin"
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

export default AddNewVaccineModal;
