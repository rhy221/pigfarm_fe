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
    { stt: 1, chuong: "A001", soLuong: 25, tongTrongLuong: 5000, donGia: 120000, checked: false },
    { stt: 2, chuong: "A001", soLuong: 40, tongTrongLuong: 6000, donGia: 110000, checked: false }
  ]);

  const allChecked = items.every(item => item.checked);

  return (
    <div className="p-8 bg-white min-h-screen animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-[#53A88B]">Phiếu xuất chuồng</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1">Thông tin</h2>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-gray-700">Đợt xuất</label>
              <input
                type="text"
                value={formData.dotXuat}
                onChange={(e) => setFormData({ ...formData, dotXuat: e.target.value })}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-[#53A88B] outline-none"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-gray-700">Tên khách hàng</label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={formData.tenKhachHang}
                onChange={(e) => setFormData({ ...formData, tenKhachHang: e.target.value })}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-[#53A88B] outline-none"
              />
            </div>
            <div className="flex items-start">
              <label className="w-32 text-sm font-semibold text-gray-700 pt-2">Địa chỉ</label>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 italic w-36">Số nhà, đường, tổ/khu phố</span>
                  <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-[#53A88B]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 italic w-36">Tỉnh/Thành phố</span>
                  <select
                    className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white outline-none"
                    value={formData.tinhThanh}
                    onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
                  >
                    <option>Tp. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 italic w-36">Xã/Phường/Đặc khu</span>
                  <select
                    className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white outline-none"
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
              <label className="w-32 text-sm font-semibold text-gray-700">Ngày xuất</label>
              <input
                type="date"
                value={formData.ngayXuat}
                onChange={(e) => setFormData({ ...formData, ngayXuat: e.target.value })}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-[#53A88B] outline-none"
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm font-semibold text-gray-700">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                value={formData.sdt}
                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-[#53A88B] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4 border-b pb-1">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết</h2>
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => onSave(formData)}
              className="bg-[#53A88B] text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-[#448a72] transition"
            >
              Lưu
            </button>
            <button className="border border-[#53A88B] text-[#53A88B] px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">
              Thêm
            </button>
            <button className="bg-[#E57373] text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-red-500 transition">
              Xoá
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 table-auto text-sm">
            <thead className="bg-gray-50 text-[#53A88B]">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) =>
                      setItems(items.map(item => ({ ...item, checked: e.target.checked })))
                    }
                    className="form-checkbox h-5 w-5 text-[#53A88B]"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">STT</th>
                <th className="px-4 py-3 text-left font-semibold">Chuồng</th>
                <th className="px-4 py-3 text-center font-semibold">Số lượng</th>
                <th className="px-4 py-3 text-center font-semibold">Tổng trọng lượng</th>
                <th className="px-4 py-3 text-left font-semibold">Đơn giá (VNĐ/kg)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200 border-t border-gray-100">
              {items.map((item, index) => (
                <tr key={item.stt} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].checked = e.target.checked;
                        setItems(newItems);
                      }}
                      className="form-checkbox h-5 w-5 text-[#53A88B]"
                    />
                  </td>
                  <td className="px-4 py-4">{item.stt}</td>
                  <td className="px-4 py-4">{item.chuong}</td>
                  <td className="px-4 py-4 text-center">{item.soLuong}</td>
                  <td className="px-4 py-4 text-center font-medium">{item.tongTrongLuong.toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4">{formatter.format(item.donGia)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-gray-300 hover:text-[#53A88B] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
