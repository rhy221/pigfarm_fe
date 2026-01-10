"use client"

import { useState, useEffect } from "react"
import { X, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddVaccineModal({ isOpen, onClose }: ModalProps) {
  // Logic State
  const [inputType, setInputType] = useState<"system" | "manual">("system")
  const [selectedColor, setSelectedColor] = useState("#52d195")
  
  const colors = ["#52d195", "#e68d5c", "#f3ba5f", "#e13e51", "#2d2e2e", "#97c9c9"]

  // Khóa cuộn trang khi mở modal
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Lớp nền tối */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Khung Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-[#1e293b]">Thêm Lịch Tiêm</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Chọn chuồng */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Chọn chuồng áp dụng</label>
            <div className="border border-slate-200 rounded-lg p-2 min-h-[48px] bg-slate-50/50 flex flex-wrap gap-2 focus-within:ring-2 ring-emerald-500/10 transition-all">
               <span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm">
                 Chuồng A1 <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500" />
               </span>
               <span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm">
                 Chuồng C2 <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-red-500" />
               </span>
               <input placeholder="+ Tìm chuồng..." className="bg-transparent outline-none text-sm ml-1 flex-1 min-w-[100px]" />
            </div>
          </div>

          {/* Ngày & Giờ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ngày tiêm</label>
              <div className="relative">
                <input type="date" className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-sm outline-none focus:bg-white transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Giờ</label>
              <input type="time" className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-sm outline-none focus:bg-white transition-colors" />
            </div>
          </div>

          {/* Thông tin vắc xin */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Thông tin vắc xin</label>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden p-1 bg-slate-100/50">
              <button 
                onClick={() => setInputType("system")}
                className={`flex-1 py-2 text-sm font-bold transition-all rounded-md ${
                  inputType === "system" ? "bg-white shadow-sm text-[#53A88B] border border-slate-100" : "text-slate-500"
                }`}
              >
                Chọn từ hệ thống
              </button>
              <button 
                onClick={() => setInputType("manual")}
                className={`flex-1 py-2 text-sm font-bold transition-all rounded-md ${
                  inputType === "manual" ? "bg-white shadow-sm text-[#53A88B] border border-slate-100" : "text-slate-500"
                }`}
              >
                Nhập thủ công
              </button>
            </div>

            {inputType === "system" ? (
              <select className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-sm outline-none cursor-pointer focus:bg-white">
                <option>-- Chọn loại vắc xin có sẵn --</option>
                <option>Vaccine Dịch tả lợn</option>
                <option>Vaccine Tai xanh (PRRS)</option>
                <option>Vaccine Lở mồm long móng</option>
              </select>
            ) : (
              <input 
                type="text" 
                placeholder="Nhập tên vắc xin..." 
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-sm outline-none focus:bg-white"
              />
            )}
          </div>

          {/* Số mũi */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Số mũi</label>
            <input type="number" defaultValue={1} className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-sm outline-none focus:bg-white" />
          </div>

          {/* Chọn màu */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Đánh dấu màu</label>
            <div className="flex gap-3 pt-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all duration-200 relative ${
                    selectedColor === color ? "ring-4 ring-offset-2 scale-110" : "hover:scale-105"
                  }`}
                  style={{ 
                    backgroundColor: color,
                    // @ts-ignore
                    "--tw-ring-color": `${color}40` // ring màu nhạt
                  }}
                >
                  {selectedColor === color && (
                    <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Sử dụng component Button mới */}
        <div className="p-4 bg-slate-50 flex justify-end items-center gap-3 border-t">
          {/* Nút Hủy bỏ sử dụng variant ghost hoặc link */}
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-transparent"
          >
            Huỷ bỏ
          </Button>

          {/* Nút Xác nhận sử dụng variant default kết hợp màu custom */}
          <Button 
            onClick={() => {
              console.log("Xác nhận:", { inputType, selectedColor });
              onClose();
            }}
            
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  )
}