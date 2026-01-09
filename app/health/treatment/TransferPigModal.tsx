"use client";
import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

const BARN_TYPES = [
  { id: "thit", name: "Chuồng thịt" },
];

const BARNS_DATABASE = [
  { id: "A001", typeId: "thit", name: "A001" },
  { id: "A002", typeId: "thit", name: "A002" },
];

interface TransferPigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetBarn: string) => void;
  onRemovePig: (id: number) => void;
  selectedPigs: { id: number; code: string }[];
}

const TransferPigModal: React.FC<TransferPigModalProps> = ({ isOpen, onClose, onConfirm, onRemovePig,selectedPigs }) => {
  const [selectedType, setSelectedType] = useState(BARN_TYPES[0].id);
  const [selectedBarn, setSelectedBarn] = useState("");

  const filteredBarns = useMemo(() => {
    const list = BARNS_DATABASE.filter(barn => barn.typeId === selectedType);
    if (list.length > 0) setSelectedBarn(list[0].id);
    return list;
  }, [selectedType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-emerald-600 mb-6 tracking-tight">Chuyển chuồng cho heo khỏi bệnh</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Loại chuồng chuyển về</label>
            <select 
              className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3 outline-none text-gray-700 focus:ring-2 ring-emerald-100 transition"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {BARN_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Chuồng chuyển về</label>
            <select 
              className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3 outline-none text-gray-700 focus:ring-2 ring-emerald-100 transition"
              value={selectedBarn}
              onChange={(e) => setSelectedBarn(e.target.value)}
            >
              {filteredBarns.map(barn => (
                <option key={barn.id} value={barn.id}>{barn.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-4">
            <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Danh sách chuyển</label>
            <div className="flex flex-wrap gap-2 flex-1 max-h-32 overflow-y-auto p-1">
              {selectedPigs.map((pig) => (
                <div key={pig.id} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-800 text-sm">
                  {pig.code}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors" 
                    onClick={() => onRemovePig(pig.id)}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button 
            onClick={() => onConfirm(selectedBarn)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-md"
          >
            Lưu
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-md"
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferPigModal;