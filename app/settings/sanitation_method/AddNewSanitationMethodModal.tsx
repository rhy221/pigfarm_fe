"use client";

import React, { useState } from "react";

interface AddNewSanitationMethodModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddNewSanitationMethodModal: React.FC<AddNewSanitationMethodModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (name.trim() === "") return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cleaning-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        onSave();
        setName("");
        onClose();
      } else {
        const err = await res.json();
        alert(err.message || "Không thể lưu hình thức vệ sinh");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm hình thức vệ sinh mới</h3>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tên hình thức vệ sinh</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        placeholder="Tên hình thức vệ sinh"
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
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

export default AddNewSanitationMethodModal;