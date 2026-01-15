"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

interface CageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cageData: {
    id: string; 
    chuong: string;
    giong: string;
    soLuong: number;
  };
  onConfirmSelection: (selectedPigIds: string[]) => void;
}

const CageDetailModal: React.FC<CageDetailModalProps> = ({ isOpen, onClose, cageData, onConfirmSelection }) => {
  const [details, setDetails] = useState<{ stt: number; id: string; maSo: string; checked: boolean; giongHeo: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isOpen && cageData?.id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/pigs/pen/${cageData.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDetails(data.map((pig: any, index: number) => ({
              stt: index + 1,
              id: pig.id, 
              maSo: pig.ear_tag_number || "N/A",
              checked: false,
              // Lấy tên giống từ pig_breeds do Backend trả về
              giongHeo: pig.pig_breeds?.breed_name || "N/A"
            })));
          } else {
            console.error("Dữ liệu trả về không hợp lệ:", data);
            setDetails([]);
          }
        })
        .catch(err => {
          console.error("Lỗi truy vấn danh sách heo từ CSDL:", err);
          setDetails([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, cageData]);

  if (!isOpen) return null;

  // Hiển thị giống: ưu tiên lấy từ con heo đầu tiên trong chuồng, nếu không có thì lấy từ cageData
  const displayBreed = details.length > 0 ? details[0].giongHeo : cageData.giong;

  const hasSelectedItems = details.some((item) => item.checked);
  const isTableEmpty = details.length === 0;
  const isAllSelected = details.length > 0 && details.every((item) => item.checked);

  const handleSelectAll = () => {
    const newValue = !isAllSelected;
    setDetails(details.map((item) => ({ ...item, checked: newValue })));
  };

  const handleSelectRow = (id: string) => {
    setDetails(details.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleSaveSelection = () => {
    const selectedPigIds = details
      .filter(item => item.checked)
      .map(item => item.id);
    
    onConfirmSelection(selectedPigIds);
    onClose();
  };

  const handleDeleteFromList = () => {
    setDetails(details.filter((item) => !item.checked).map((item, index) => ({ ...item, stt: index + 1 })));
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in duration-200 border border-gray-100">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-emerald-700">Chi tiết chuồng xuất</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="animate-in slide-in-from-left duration-500">
            <div className="flex justify-between items-center mb-6 border-b pb-1 border-gray-200 h-[45px]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Thông tin chuồng</h2>
            </div>
            <div className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Chuồng:</span>
                  <span className="text-sm text-gray-800">{cageData.chuong}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Giống:</span>
                  <span className="text-sm text-gray-800">{displayBreed}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--color-secondary-foreground)] w-32">Số lượng hiện tại:</span>
                  <span className="text-sm text-gray-800">{loading ? "..." : details.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-6 border-b pb-1 border-gray-200 h-[45px]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Chi tiết mã số heo</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleSaveSelection}
                  disabled={isTableEmpty || loading}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300"
                >
                  Lưu
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isTableEmpty || loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300"
                >
                  Xóa
                </button>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-emerald-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-center w-16">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 font-bold text-emerald-700 text-center uppercase tracking-wider">STT</th>
                    <th className="px-6 py-4 font-bold text-emerald-700 text-center tracking-wider">Mã số heo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {loading ? (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                  ) : details.length > 0 ? (
                    details.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={row.checked} 
                            onChange={() => handleSelectRow(row.id)}
                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-center text-gray-400 font-medium">{row.stt}</td>
                        <td className="px-6 py-4 text-center text-gray-800 group-hover:text-emerald-600 transition-colors">{row.maSo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">Chuồng này không có heo để xuất</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-3 text-gray-900">{hasSelectedItems ? "Loại bỏ khỏi danh sách" : "Thông báo"}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {hasSelectedItems ? "Các mã số heo đã chọn sẽ bị loại khỏi đợt xuất này. Tiếp tục?" : "Vui lòng chọn ít nhất một mã số để xóa."}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700">Hủy</button>
              {hasSelectedItems && (
                <button onClick={handleDeleteFromList} className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">Xác nhận</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CageDetailModal;