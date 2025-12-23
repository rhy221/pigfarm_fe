"use client";

import React, { useState } from "react";
import { ExportProposal, ExportReceipt } from "./type";
import AddExportReceipt from "./AddExportReceipt";

const ExportManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "add">("list");

  const [proposals] = useState<ExportProposal[]>([
    { stt: 1, chuong: "A001", soLuong: 25, tongTrongLuong: 5000, donGia: 120000, thanhTienDuKien: 600000000, ngayXuatDuKien: "18/11/2025" },
    { stt: 2, chuong: "A001", soLuong: 40, tongTrongLuong: 6000, donGia: 110000, thanhTienDuKien: 660000000, ngayXuatDuKien: "18/11/2025" },
  ]);

  const [receipts] = useState<ExportReceipt[]>([
    { stt: 1, dot: "DXC-001", khachHang: "Nguyễn Văn A", tongTien: 50000000, ngayXuat: "18/11/2025", tinhTrangThanhToan: "Chưa TT & Chưa giao hàng" },
    { stt: 2, dot: "DXC-002", khachHang: "Công ty ABC", tongTien: 120000000, ngayXuat: "19/11/2025", tinhTrangThanhToan: "Đã TT & Chưa giao hàng" },
  ]);

  const formatter = new Intl.NumberFormat("vi-VN");

  const renderStatus = (status: string) => {
    const isPaid = status.includes("Đã TT");
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {status}
      </span>
    );
  };

  if (viewMode === "add") {
    return <AddExportReceipt
              onBack={() => setViewMode("list")}
              onSave={() => {}}
            />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-2xl font-semibold mb-8 text-[#53A88B]">
        Xuất chuồng
      </h1>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4 text-gray-700">
          Đề xuất xuất chuồng
        </h2>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center">STT</th>
                <th className="px-4 py-3 text-center">Chuồng</th>
                <th className="px-4 py-3 text-center">Số lượng</th>
                <th className="px-4 py-3 text-center">Tổng trọng lượng</th>
                <th className="px-4 py-3 text-center">Đơn giá</th>
                <th className="px-4 py-3 text-center">Thành tiền</th>
                <th className="px-4 py-3 text-center">Ngày xuất</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((item, index) => (
                <tr
                  key={item.stt}
                  className={`border-t hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 text-center">{item.stt}</td>
                  <td className="px-4 py-3 text-center">{item.chuong}</td>
                  <td className="px-4 py-3 text-center">{item.soLuong}</td>
                  <td className="px-4 py-3 text-center">{item.tongTrongLuong}</td>
                  <td className="px-4 py-3 text-center">
                    {formatter.format(item.donGia)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {formatter.format(item.thanhTienDuKien)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.ngayXuatDuKien}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-700">
            Phiếu xuất chuồng
          </h2>

          <button
            onClick={() => setViewMode("add")}
            className="bg-[#53A88B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            + Thêm
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 border-b">
              <tr>
                <th className="px-4 py-3 text-center">STT</th>
                <th className="px-4 py-3 text-center">Đợt</th>
                <th className="px-4 py-3 text-center">Khách hàng</th>
                <th className="px-4 py-3 text-center">Tổng tiền</th>
                <th className="px-4 py-3 text-center">Ngày xuất</th>
                <th className="px-4 py-3 text-center">Thanh toán</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((item, index) => (
                <tr
                  key={item.stt}
                  className={`border-t hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 text-center">{item.stt}</td>
                  <td className="px-4 py-3 text-center">{item.dot}</td>
                  <td className="px-4 py-3 text-center">{item.khachHang}</td>
                  <td className="px-4 py-3 text-center font-medium">
                    {formatter.format(item.tongTien)}
                  </td>
                  <td className="px-4 py-3 text-center">{item.ngayXuat}</td>
                  <td className="px-4 py-3 text-center">
                    {renderStatus(item.tinhTrangThanhToan)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[#53A88B] text-sm font-medium hover:underline cursor-pointer">
                      Xem chi tiết
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ExportManagement;
