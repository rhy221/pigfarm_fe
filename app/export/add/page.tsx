"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ExportDetailItem } from "../type";
import AddExportModal, { SelectedItem } from "./AddExportModal";

const AddExportReceipt = () => {
  const router = useRouter();
  const formatter = new Intl.NumberFormat("vi-VN");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    dotXuat: "DXC-004",
    ngayXuat: "2025-11-20",
    tenKhachHang: "",
    sdt: "",
    soNha: "",
    tinhThanh: "Tp. Hồ Chí Minh",
    phuongXa: "Phường Thủ Đức",
  });

  const [items, setItems] = useState<ExportDetailItem[]>([
    { stt: 1, chuong: "A001", tongTrongLuong: 0, donGia: 120000, checked: false },
    { stt: 2, chuong: "A001", tongTrongLuong: 0, donGia: 110000, checked: false },
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allChecked = items.length > 0 && items.every((item) => item.checked);
  const hasSelectedItems = items.some((item) => item.checked);
  const isTableEmpty = items.length === 0;

  const handleDeleteSelected = () => {
    const remainingItems = items.filter((item) => !item.checked);
    setItems(remainingItems.map((item, index) => ({ ...item, stt: index + 1 })));
    setShowDeleteModal(false);
  };

  const handleSave = () => {
    if (isTableEmpty) return;
    console.log("Dữ liệu lưu:", { ...formData, items });
    router.push("/export");
  };

  const handleAddCagesFromModal = (selectedItems: SelectedItem[]) => {
    const lastStt = items.length > 0 ? Math.max(...items.map((i) => i.stt)) : 0;

    const newFormattedItems = selectedItems.map((item, index) => ({
      stt: lastStt + index + 1,
      chuong: item.chuong,
      tongTrongLuong: 0,
      donGia: item.donGia,
      checked: false,
    }));

    setItems([...items, ...newFormattedItems]);
  };

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/export"
          className="p-2 rounded-full transition hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--color-secondary-foreground)]">Phiếu xuất chuồng</h1>
      </div>

      <div className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-6 border-b pb-1 border-gray-200 text-gray-500">
          Thông tin
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-5">
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Đợt xuất</label>
              <input
                type="text"
                value={formData.dotXuat}
                onChange={(e) => setFormData({ ...formData, dotXuat: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Tên khách hàng</label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={formData.tenKhachHang}
                onChange={(e) => setFormData({ ...formData, tenKhachHang: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-start">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)] pt-2">Địa chỉ</label>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] italic w-44 text-gray-500">Số nhà, đường, tổ/khu phố</span>
                  <input
                    type="text"
                    value={formData.soNha}
                    onChange={(e) => setFormData({ ...formData, soNha: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] italic w-44 text-gray-500">Tỉnh/Thành phố</span>
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none bg-white"
                    value={formData.tinhThanh}
                    onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
                  >
                    <option>Tp. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] italic w-44 text-gray-500">Xã/Phường/Đặc khu</span>
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none bg-white"
                    value={formData.phuongXa}
                    onChange={(e) => setFormData({ ...formData, phuongXa: e.target.value })}
                  >
                    <option>Phường Thủ Đức</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày xuất</label>
              <input
                type="date"
                value={formData.ngayXuat}
                onChange={(e) => setFormData({ ...formData, ngayXuat: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                value={formData.sdt}
                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Chi tiết</h2>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isTableEmpty}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md ${
                isTableEmpty 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              Lưu
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
            >
              Thêm
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isTableEmpty}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md ${
                isTableEmpty 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Xoá
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="w-[50px] px-6 py-4 text-center font-bold uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) =>
                      setItems(items.map((item) => ({ ...item, checked: e.target.checked })))
                    }
                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="w-[50px] px-6 py-3 text-center font-semibold border-emerald-100">STT</th>
                <th className="w-[80px] px-6 py-3 text-center font-semibold tracking-wider border-emerald-100">Chuồng</th>
                <th className="w-[80px] px-6 py-3 text-center font-semibold tracking-wider border-emerald-100">Đơn giá (VNĐ/kg)</th>
                <th className="w-[80px] px-6 py-3 text-center font-semibold uppercase tracking-wider"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={item.stt} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].checked = e.target.checked;
                        setItems(newItems);
                      }}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3 text-center text-gray-500">{item.stt}</td>
                  <td className="px-6 py-3 text-center font-medium text-emerald-900">{item.chuong}</td>
                  <td className="px-6 py-3 text-center">
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={item.donGia}
                        autoFocus
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].donGia = Number(e.target.value);
                          setItems(newItems);
                        }}
                        onBlur={() => setEditingIndex(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingIndex(null);
                        }}
                        className="w-32 text-center border border-emerald-500 rounded px-2 py-1 outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingIndex(index)}
                        className="cursor-pointer font-bold text-gray-800 hover:text-emerald-600 underline decoration-dotted underline-offset-4"
                      >
                        {formatter.format(item.donGia)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {isTableEmpty && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    Danh sách chi tiết đang trống. Vui lòng thêm chuồng để tiếp tục.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              {hasSelectedItems ? "Xác nhận xóa" : "Thông báo"}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {hasSelectedItems
                ? "Các chuồng đã chọn sẽ bị loại khỏi phiếu xuất này. Bạn có chắc không?"
                : "Vui lòng chọn ít nhất một chuồng để thực hiện xóa."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700"
              >
                {hasSelectedItems ? "Hủy" : "Đã hiểu"}
              </button>
              {hasSelectedItems && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow-lg shadow-red-200"
                >
                  Xác nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AddExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCagesFromModal}
      />
    </div>
  );
};

export default AddExportReceipt;