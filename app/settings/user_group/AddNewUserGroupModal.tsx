"use client";

import React, { useState } from "react";

interface AddNewUserGroupModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddNewUserGroupModal: React.FC<AddNewUserGroupModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        onSave();
        setName("");
        onClose();
      } else {
        const error = await res.json();
        alert(error.message || "Không thể thêm nhóm");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 w-80">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm nhóm người dùng</h3>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm người dùng</label>
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