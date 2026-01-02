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
    <div className="w-full bg-[var(--color-card)] p-6 rounded-b-xl border border-t-0 border-[var(--color-border)] shadow-sm transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h2 className="text-x italic text-[var(--color-card-foreground)]">Danh sách {contentType.toLowerCase()}</h2>
        <div className="flex flex-wrap gap-2">
          {/* Lưu */}
          <button
            onClick={() => setCages(editedCages)}
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg
                      bg-green-700 text-white
                      hover:bg-green-800 transition"
          >
            <Save size={16} />
            <span>Lưu</span>
          </button>

          {/* Thêm */}
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg
                      bg-blue-700 text-white
                      hover:bg-blue-800 disabled:opacity-50 transition"
          >
            <Plus size={16} />
            <span>Thêm</span>
          </button>

          {/* Xoá */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg
                      bg-red-700 text-white
                      hover:bg-red-800 transition"
          >
            <Trash2 size={16} />
            <span>Xoá</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 transition-all duration-300">
        <div className={isAdding ? "lg:w-3/5 w-full" : "w-full"}>{renderChild()}</div>
        {isAdding && addForm && (
          <div className="lg:w-2/5 w-full bg-[var(--color-muted)] p-4 rounded-lg border border-[var(--color-border)] shadow-inner">
            {addForm}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableContent;
