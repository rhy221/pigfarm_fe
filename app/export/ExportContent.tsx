"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ExportProposal, ExportReceipt } from "./type";
import AddExportReceipt from "./add/page";

const ExportManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "add">("list");

  const [proposals] = useState<ExportProposal[]>([
    { stt: 1, chuong: "A001", tongTrongLuong: 5000, donGia: 120000, thanhTienDuKien: 600000000, ngayXuatDuKien: "18/11/2025" },
    { stt: 2, chuong: "A001", tongTrongLuong: 6000, donGia: 110000, thanhTienDuKien: 660000000, ngayXuatDuKien: "18/11/2025" },
  ]);

  const [receipts] = useState<ExportReceipt[]>([
    { stt: 1, dot: "DXC-001", khachHang: "Nguyễn Văn A", tongTien: 50000000, ngayXuat: "18/11/2025", tinhTrangThanhToan: "Chưa thanh toán" },
    { stt: 2, dot: "DXC-002", khachHang: "Công ty ABC", tongTien: 120000000, ngayXuat: "19/11/2025", tinhTrangThanhToan: "Đã thanh toán" },
  ]);

  const formatter = new Intl.NumberFormat("vi-VN");

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day).getTime();
  };

  const renderStatus = (status: string) => {
    const isPaid = status === "Đã thanh toán";
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
    return <AddExportReceipt />;
  }

  return (
    <div className="p-8 min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: '#53A88B' }}>Xuất chuồng</h1>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4 text-[var(--color-secondary-foreground)]">Đề xuất xuất chuồng</h2>
        <div className="bg-[var(--color-card)] rounded-xl shadow-sm overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">STT</th>
                <th className="px-4 py-3 text-center font-semibold">Chuồng</th>
                <th className="px-4 py-3 text-center font-semibold">Tổng trọng lượng dự kiến</th>
                <th className="px-4 py-3 text-center font-semibold">Đơn giá</th>
                <th className="px-4 py-3 text-center font-semibold">Thành tiền dự kiến</th>
                <th className="px-4 py-3 text-center font-semibold">Ngày xuất dự kiến</th>
              </tr>
            </thead>
            <tbody>
              {[...proposals]
                .sort((a, b) => parseDate(b.ngayXuatDuKien) - parseDate(a.ngayXuatDuKien))
                .map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-[var(--color-border)] hover:bg-[var(--color-muted)] transition ${
                      index % 2 === 0 ? "bg-[var(--color-card)]" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{item.chuong}</td>
                    <td className="px-4 py-3 text-center">{item.tongTrongLuong}</td>
                    <td className="px-4 py-3 text-center">{formatter.format(item.donGia)}</td>
                    <td className="px-4 py-3 text-center font-medium">{formatter.format(item.thanhTienDuKien)}</td>
                    <td className="px-4 py-3 text-center">{item.ngayXuatDuKien}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-[var(--color-secondary-foreground)]">Phiếu xuất chuồng</h2>
          <Link
            href="/export/add"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            + Thêm
          </Link>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl shadow-sm overflow-x-auto border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">STT</th>
                <th className="px-4 py-3 text-center font-semibold">Đợt</th>
                <th className="px-4 py-3 text-center font-semibold">Khách hàng</th>
                <th className="px-4 py-3 text-center font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-center font-semibold">Ngày xuất</th>
                <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {[...receipts]
                .sort((a, b) => parseDate(b.ngayXuat) - parseDate(a.ngayXuat))
                .map((item, index) => (
                  <tr
                    key={item.dot}
                    className={`border-t border-[var(--color-border)] hover:bg-[var(--color-muted)] transition ${
                      index % 2 === 0 ? "bg-[var(--color-card)]" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{item.dot}</td>
                    <td className="px-4 py-3 text-center">{item.khachHang}</td>
                    <td className="px-4 py-3 text-center font-medium">{formatter.format(item.tongTien)}</td>
                    <td className="px-4 py-3 text-center">{item.ngayXuat}</td>
                    <td className="px-4 py-3 text-center">{renderStatus(item.tinhTrangThanhToan)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-emerald-600 text-sm font-medium hover:underline cursor-pointer">
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