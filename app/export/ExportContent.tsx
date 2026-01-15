"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ExportProposal, ExportReceipt, ExportDetailItem } from "./type";
import ExportDetailModal from "./ExportDetailModal";

const ExportManagement: React.FC = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<ExportReceipt | null>(null);
  const [detailItems, setDetailItems] = useState<ExportDetailItem[]>([]);
  const [proposals, setProposals] = useState<ExportProposal[]>([]);
  const [receipts, setReceipts] = useState<ExportReceipt[]>([]);

  const formatter = new Intl.NumberFormat("vi-VN");

  const parseDate = (dateStr: string) => {
    return new Date(dateStr).getTime();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resProposal, resReceipts] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/pig/proposals`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales`)
      ]);

      const proposalsData = await resProposal.json();
      const receiptsData = await resReceipts.json();

      setProposals(
        proposalsData.map((p: any, index: number) => ({
          stt: index + 1,
          chuong: p.pen_name,
          soLuong: p.quantity, 
          giong: p.breed,
          tongTrongLuong: p.total_weight,
          donGia: p.current_price || 0,
          thanhTienDuKien: p.total_weight * (p.current_price || 0),
          ngayXuatDuKien: p.expected_date ?? null,
          arrival_date: p.arrival_date ?? null
        }))
      );

      setReceipts(
        receiptsData.map((r: any, index: number) => ({
          stt: index + 1,
          id: r.id,
          dot: r.receipt_code,
          khachHang: r.customer_name,
          tongTien: Number(r.total_amount),
          ngayXuat: r.export_date,
          tinhTrangThanhToan: r.payment_status
        }))
      );
    } catch (error) {
      console.error("Lỗi fetch data:", error);
    }
  };

  const handleOpenDetail = async (receipt: ExportReceipt) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/${receipt.id}`);
      const data = await res.json();

      setSelectedReceipt(receipt);
      setDetailItems(
        data.pig_shipping_details.map((d: any, index: number) => ({
          stt: index + 1,
          id: d.id,
          chuong: d.pens.pen_name,
          tongTrongLuong: d.total_weight,
          donGia: Number(d.price_unit),
          pig_ids: d.shipped_pig_items.map((i: any) => i.pig_id)
        }))
      );
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    }
  };

  const handleWeightChange = (index: number, weight: number) => {
    const newItems = [...detailItems];
    newItems[index].tongTrongLuong = weight;
    setDetailItems(newItems);
  };

  const handleUpdateReceipt = async (newStatus: string, newTotal: number) => {
    if (selectedReceipt) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/${selectedReceipt.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_status: newStatus,
            details: detailItems.map(item => ({
              id: (item as any).id,
              total_weight: item.tongTrongLuong
            }))
          })
        });
        fetchData();
        setSelectedReceipt(null);
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
      }
    }
  };

  const renderStatus = (status: string) => {
    let colorClass = "";
    switch (status) {
      case "Đã thanh toán":
        colorClass = "bg-green-100 text-green-700";
        break;
      case "Chưa thanh toán":
        colorClass = "bg-yellow-100 text-yellow-700";
        break;
      case "Chuẩn bị xuất chuồng":
        colorClass = "bg-blue-100 text-blue-700";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-700";
    }
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: "#53A88B" }}>
        Xuất chuồng
      </h1>

      {/* ===== ĐỀ XUẤT XUẤT CHUỒNG ===== */}
      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4 text-[var(--color-secondary-foreground)]">
          Đề xuất xuất chuồng
        </h2>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-emerald-100">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700 border-b border-emerald-100">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">STT</th>
                <th className="px-4 py-3 text-center font-semibold">Chuồng</th>
                <th className="px-4 py-3 text-center font-semibold">Giống</th> 
                <th className="px-4 py-3 text-center font-semibold">Số lượng</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Tổng trọng lượng dự kiến
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Ngày xuất dự kiến
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    Chưa có chuồng nào đến giai đoạn đề xuất xuất chuồng
                  </td>
                </tr>
              ) : (
                proposals.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-emerald-50 hover:bg-gray-100 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-emerald-50/20"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">{item.stt}</td>
                    <td className="px-4 py-3 text-center">{item.chuong}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.giong}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.soLuong} con</td> 
                    <td className="px-4 py-3 text-center">
                      {Number(item.tongTrongLuong).toFixed(1)} kg
                    </td>
                    <td className="px-4 py-3 text-center text-emerald-700 font-bold">
                      {item.ngayXuatDuKien ? new Date(item.ngayXuatDuKien).toLocaleDateString("vi-VN") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== PHIẾU XUẤT CHUỒNG ===== */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-[var(--color-secondary-foreground)]">
            Phiếu xuất chuồng
          </h2>
          <Link href="/export/add">
            <button className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">
              Tạo phiếu mới
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-emerald-100">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700 border-b border-emerald-100">
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
              {receipts
                .sort((a, b) => parseDate(b.ngayXuat) - parseDate(a.ngayXuat))
                .map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-t border-emerald-50 hover:bg-gray-100 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-emerald-50/20"
                    }`}
                  >
                    <td className="px-4 py-3 text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{item.dot}</td>
                    <td className="px-4 py-3 text-center">{item.khachHang}</td>
                    <td className="px-4 py-3 text-center font-medium">
                      {item.tinhTrangThanhToan === "Chuẩn bị xuất chuồng" &&
                      item.tongTien === 0
                        ? "—"
                        : formatter.format(item.tongTien)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(item.ngayXuat).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderStatus(item.tinhTrangThanhToan)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        onClick={() => handleOpenDetail(item)}
                        className="text-emerald-600 text-sm font-medium hover:underline cursor-pointer"
                      >
                        Chi tiết
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReceipt && (
        <ExportDetailModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
          detailItems={detailItems}
          onWeightChange={handleWeightChange}
          onSave={handleUpdateReceipt}
        />
      )}
    </div>
  );
};

export default ExportManagement;
