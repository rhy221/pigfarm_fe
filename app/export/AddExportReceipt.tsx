"use client";

import React, { useState } from "react";
import { ExportDetailItem } from "./type";

interface AddExportReceiptProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const AddExportReceipt: React.FC<AddExportReceiptProps> = ({ onBack, onSave }) => {
  const formatter = new Intl.NumberFormat("vi-VN");

  const [formData, setFormData] = useState({
    dotXuat: "DXC-004",
    ngayXuat: "2025-11-20",
    tenKhachHang: "",
    sdt: "",
    diaChi: "",
    tinhThanh: "Tp. Hồ Chí Minh",
    phuongXa: "Phường Thủ Đức"
  });

  const [items, setItems] = useState<ExportDetailItem[]>([
    { stt: 1, chuong: "A001", tongTrongLuong: 0, donGia: 120000, checked: false },
    { stt: 2, chuong: "A001", tongTrongLuong: 0, donGia: 110000, checked: false }
  ]);

  const allChecked = items.every(item => item.checked);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full transition hover:bg-[var(--color-muted)/20]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[var(--color-secondary-foreground)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Phiếu xuất chuồng</h1>
      </div>

      {/* Form thông tin */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4 border-b pb-1 border-[var(--color-border)] text-[var(--color-muted-foreground)]">Thông tin</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <div className="space-y-4">
            {/* Đợt xuất */}
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-[var(--color-secondary-foreground)]">Đợt xuất</label>
              <input
                type="text"
                value={formData.dotXuat}
                onChange={(e) => setFormData({ ...formData, dotXuat: e.target.value })}
                className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
              />
            </div>
            {/* Tên khách hàng */}
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-[var(--color-secondary-foreground)]">Tên khách hàng</label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={formData.tenKhachHang}
                onChange={(e) => setFormData({ ...formData, tenKhachHang: e.target.value })}
                className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
              />
            </div>
            {/* Địa chỉ */}
            <div className="flex items-start">
              <label className="w-32 text-sm font-semibold text-[var(--color-secondary-foreground)] pt-2">Địa chỉ</label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] italic w-36 text-[var(--color-muted-foreground)]">Số nhà, đường, tổ/khu phố</span>
                  <input
                    type="text"
                    className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary)] bg-[var(--color-card)] text-[var(--color-foreground)]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] italic w-36 text-[var(--color-muted-foreground)]">Tỉnh/Thành phố</span>
                  <select
                    className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
                    value={formData.tinhThanh}
                    onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
                  >
                    <option>Tp. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] italic w-36 text-[var(--color-muted-foreground)]">Xã/Phường/Đặc khu</span>
                  <select
                    className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
                    value={formData.phuongXa}
                    onChange={(e) => setFormData({ ...formData, phuongXa: e.target.value })}
                  >
                    <option>Phường Thủ Đức</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày xuất</label>
              <input
                type="date"
                value={formData.ngayXuat}
                onChange={(e) => setFormData({ ...formData, ngayXuat: e.target.value })}
                className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                value={formData.sdt}
                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                className="flex-1 border border-[var(--color-border)] rounded-md px-3 py-2 text-sm focus:border-[var(--color-primary)] outline-none bg-[var(--color-card)] text-[var(--color-foreground)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết hàng */}
      <div>
        <div className="flex justify-between items-end mb-4 border-b pb-1 border-[var(--color-border)]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Chi tiết</h2>
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => onSave(formData)}
              className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-5 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Lưu
            </button>
            <button className="border border-[var(--color-primary)] text-[var(--color-primary)] px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--color-primary)/10] transition">
              Thêm
            </button>
            <button className="bg-[var(--color-destructive)] text-[var(--color-primary-foreground)] px-5 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
              Xoá
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm max-w-5xl mx-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-muted)] text-[var(--color-primary)]">
              <tr>
                <th className="w-[60px] px-4 py-4 text-center font-semibold">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) =>
                      setItems(items.map(item => ({ ...item, checked: e.target.checked })))
                    }
                    className="h-5 w-5 align-middle"
                  />
                </th>

                <th className="w-[80px] px-4 py-4 text-center font-semibold">
                  STT
                </th>

                <th className="w-[120px] px-4 py-4 text-center font-semibold">
                  Chuồng
                </th>

                <th className="w-[200px] px-4 py-4 text-center font-semibold">
                  Đơn giá (VNĐ/kg)
                </th>

                <th className="w-[60px] px-4 py-4 text-center font-semibold"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dashed divide-[var(--color-border)]">
              {items.map((item, index) => (
                <tr
                  key={item.stt}
                  className="hover:bg-[var(--color-muted)]/20 transition"
                >
                  <td className="px-4 py-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].checked = e.target.checked;
                        setItems(newItems);
                      }}
                      className="h-5 w-5 align-middle"
                    />
                  </td>

                  <td className="px-4 py-4 text-center align-middle text-gray-600">
                    {item.stt}
                  </td>

                  <td className="px-4 py-4 text-center align-middle text-[var(--color-text-main)]">
                    {item.chuong}
                  </td>

                  <td className="px-4 py-4 text-center align-middle">
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
                        className="w-full text-center border border-[var(--color-border)] rounded-md px-2 py-1
                                  focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingIndex(index)}
                        className="cursor-pointer font-medium text-gray-800 hover:text-[var(--color-primary)]"
                        title="Nhấn để sửa đơn giá"
                      >
                        {formatter.format(item.donGia)}
                      </span>
                    )}
                  </td>


                  <td className="px-4 py-4 text-center align-middle">
                    <button className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default AddExportReceipt;
