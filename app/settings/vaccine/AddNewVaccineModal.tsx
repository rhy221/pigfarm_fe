"use client";

import React, { useState } from "react";

interface AddNewVaccineModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddNewVaccineModal: React.FC<AddNewVaccineModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    vaccine_name: "",
    stage: 1,
    days_old: 0,
    dosage: "",
    description: ""
  });

  const handleSave = () => {
    if (formData.vaccine_name.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-4 space-y-3">
      <h3 className="text-lg font-bold text-emerald-700">Thêm vắc xin mới</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên vắc xin</label>
        <input
          type="text"
          placeholder="Tên vắc xin"
          className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.vaccine_name}
          onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
        />
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Giai đoạn</label>
          <input
            type="number"
            placeholder="Giai đoạn"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.stage}
            onChange={(e) => setFormData({...formData, stage: parseInt(e.target.value) || 0})}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tuổi</label>
          <input
            type="number"
            placeholder="Ngày tuổi"
            className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.days_old}
            onChange={(e) => setFormData({...formData, days_old: parseInt(e.target.value) || 0})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng</label>
        <input
          type="text"
          placeholder="Liều lượng (VD: 2ml/con)"
          className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.dosage}
          onChange={(e) => setFormData({...formData, dosage: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          placeholder="Mô tả"
          className="w-full border p-2 rounded text-sm h-20 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
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

export default AddNewVaccineModal;