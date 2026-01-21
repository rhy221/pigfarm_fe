"use client";

import React, { useState } from "react";

interface AddNewWorkShiftModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddNewWorkShiftModal: React.FC<AddNewWorkShiftModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("14:00");

  const handleSave = async () => {
    const payload = {
      session: name,          
      start_time: startTime,   
      end_time: endTime,       
    };

    if (startTime >= endTime) {
      alert("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-shifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Lỗi khi lưu!");
        return;
      }

      onSave(); 
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm ca làm mới</h3>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tên ca làm</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        placeholder="Ca làm"
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
      />
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Giờ bắt đầu</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-1 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium">Giờ kết thúc</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-1 text-sm"
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
          onClick={handleSave}
          className="px-6 py-2 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewWorkShiftModal;