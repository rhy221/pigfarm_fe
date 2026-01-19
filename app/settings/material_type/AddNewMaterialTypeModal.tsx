"use client";

import React, { useState } from "react";

interface AddNewMaterialTypeModalProps {
  onClose: () => void;
  onSave: (data: { name: string; type: string; description: string }) => void;
}

const AddNewMaterialTypeModal: React.FC<AddNewMaterialTypeModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "FEED",
    description: ""
  });

  const handleSave = () => {
    if (formData.name.trim() !== "") {
      const dataToSave = {
        ...formData,
        type: formData.type.toLowerCase() 
      };
      onSave(dataToSave);
      setFormData({ name: "", type: "FEED", description: "" });
      onClose();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="text-lg py-2 font-bold text-emerald-700 border-b border-emerald-50">Thêm loại vật tư mới</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại vật tư</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ví dụ: Cám hỗn hợp, Thuốc sát trùng..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm chính</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="FEED">Thức ăn (Feed)</option>
          <option value="MEDICINE">Thuốc (Medicine)</option>
          <option value="VACCINE">Vắc xin (Vaccine)</option>
          <option value="EQUIPMENT">Thiết bị (Equipment)</option>
          <option value="HARVEST">Sản phẩm thu hoạch (Harvest)</option>
          <option value="OTHER">Khác (Other)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Thông tin thêm về loại vật tư này..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
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

export default AddNewMaterialTypeModal;