"use client";

import React, { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import ExpandableContent from "./ExpandableContent";
import CageContent from "./barn/CageContent";

interface SettingItemProps {
  IconComponent: LucideIcon;
  title: string;
  isExpandable: boolean;
  contentTypeKey: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  IconComponent,
  title,
  isExpandable,
  contentTypeKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const primaryColor = "#53A88B";

  const toggleOpen = () => {
    if (isExpandable) setIsOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (contentTypeKey) {
      case "CHUONG_TRAI":
        return (
          <CageContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      default:
        return <div>Nội dung chưa được định nghĩa cho {title}.</div>;
    }
  };

  return (
    <div className="w-full">
      <div onClick={toggleOpen}>
        <div
          className={`group flex items-center justify-between w-full px-6 py-4
            bg-white rounded-xl shadow-md transition duration-200
            hover:bg-gray-50 hover:shadow-lg hover:border-green-500
            cursor-pointer border border-gray-200
            ${isOpen && isExpandable ? "rounded-b-none border-b-0" : ""}`}
        >
          <div className="flex items-center space-x-6">
            <div className="p-3 bg-gray-100 rounded-full flex items-center justify-center">
              <IconComponent size={20} style={{ color: primaryColor }} />
            </div>
            <span className="text-base font-medium text-gray-900">{title}</span>
          </div>

          {isExpandable && (
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isExpandable && isOpen && (
        <ExpandableContent contentType={title} addForm={null}>
          {renderContent()}
        </ExpandableContent>
      )}
    </div>
  );
};

export default SettingItem;
