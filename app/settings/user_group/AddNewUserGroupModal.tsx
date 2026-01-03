"use client";

import React, { useState } from "react";

interface AddNewUserGroupModalProps {
  onClose: () => void;
  onSave: (name: string) => void;
}

const AddNewUserGroupModal: React.FC<AddNewUserGroupModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    onClose();
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 w-80">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm nhóm người dùng</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên nhóm"
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
      <div className="flex justify-end gap-3">
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

export default AddNewUserGroupModal;
