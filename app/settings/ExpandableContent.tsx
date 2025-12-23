"use client";

import React, { useState, ReactElement, isValidElement, cloneElement } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

interface ExpandableChildProps {
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  cages: any[];
  setCages: React.Dispatch<React.SetStateAction<any[]>>;
  editedCages: any[];
  setEditedCages: React.Dispatch<React.SetStateAction<any[]>>;
}

interface ExpandableContentProps {
  contentType: string;
  children: ReactElement<ExpandableChildProps>;
  addForm?: React.ReactNode;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({ contentType, children, addForm }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [cages, setCages] = useState<any[]>([]);
  const [editedCages, setEditedCages] = useState<any[]>([]);

  const renderChild = () => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        isAdding,
        setIsAdding,
        showDeleteConfirm,
        setShowDeleteConfirm,
        cages,
        setCages,
        editedCages,
        setEditedCages,
      });
    }
    return null;
  };

  return (
    <div className="w-full bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-900">{contentType}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCages(editedCages)}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Save size={16} />
            <span>Lưu</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            <Plus size={16} />
            <span>Thêm</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Trash2 size={16} />
            <span>Xoá</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 transition-all duration-300">
        <div className={isAdding ? "w-3/5" : "w-full"}>{renderChild()}</div>
        {isAdding && addForm && (
          <div className="w-2/5 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">{addForm}</div>
        )}
      </div>
    </div>
  );
};

export default ExpandableContent;
