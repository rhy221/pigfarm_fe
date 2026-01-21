"use client";

import React, { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import ExpandableContent from "./ExpandableContent";
import CageContent from "./barn/CageContent";
import CageTypeContent from "./barn_type/CageType"; 
import PigBreedContent from "./pig_breed/PigBreedContent";
import VaccineContent from "./vaccine/VaccineContent";
import DiseaseContent from "./disease/DiseaseContent";  
import AddNewDiseaseModal from "./disease/AddNewDiseaseModal";
import { ca } from "zod/v4/locales";
import MaterialTypeContent from "./material_type/MaterialTypeContent";
import ChemicalTypeContent from "./chemical_type/ChemicalTypeContent";
import SanitationMethodContent from "./sanitation_method/SanitationMethodContent";
import WorkShiftContent from "./work/WorkShiftContent";
import UserGroupContent from "./user_group/UserGroupContent";
import UserListContent from "./users/UserListContent";
import AccessControlContent from "./access/AccessControlContent";

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
      case "LOAI_CHUONG":
        return (
          <CageTypeContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "GIONG_HEO":
        return (
          <PigBreedContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "VAC_XIN":
        return (
          <VaccineContent 
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm} 
            setShowDeleteConfirm={setShowDeleteConfirm}         
          />  
        );
      case "LOAI_BENH":
        return (  
          <DiseaseContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );  
      case "VAT_TU":
        return (
          <MaterialTypeContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "LOAI_HOA_CHAT":
        return (
          <ChemicalTypeContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "HINH_THUC_VE_SINH":
        return (
          <SanitationMethodContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "CA_LAM":
        return (
          <WorkShiftContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );   
      case "NHOM_NGUOI_DUNG":
        return (
          <UserGroupContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm} 
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      case "NGUOI_DUNG":
        return (
          <UserListContent
            isAdding={isAdding} 
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );  
      case "PHAN_QUYEN":
        return (
          <AccessControlContent
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        );
      default:
        return <div>Chưa có thông tin về {title}.</div>;
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
            <span className="text-base font-bold text-gray-900">{title}</span>
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
