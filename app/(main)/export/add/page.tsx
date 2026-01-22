"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExportDetailItem } from "../type";
import AddExportModal, { SelectedItem } from "./AddExportModal";
import CageDetailModal from "./CageDetailModal";
import { api } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";
import { useCashAccounts } from "@/hooks/use-finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type cho response từ POST /sales
interface SaleReceipt {
  id: string;
  receipt_code: string | null;
  export_date: string | null;
  customer_name: string | null;
  total_amount: number | null;
}

const AddExportReceipt: React.FC = () => {
  const router = useRouter();
  const formatter = new Intl.NumberFormat("vi-VN");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    dotXuat: "Đang tải...",
    ngayXuat: new Date().toISOString().split('T')[0],
    tenKhachHang: "",
    sdt: "",
    soNha: "",
    tinhThanh: "Tp. Hồ Chí Minh",
    phuongXa: "Phường Thủ Đức",
  });

  useEffect(() => {
    const fetchNextCode = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/next-code`);
        if (response.ok) {
          const nextCode = await response.text();  
          setFormData(prev => ({ ...prev, dotXuat: nextCode }));
        } else {
          setFormData(prev => ({ ...prev, dotXuat: "DXC-0001" }));
        }
      } catch (error) {
        setFormData(prev => ({ ...prev, dotXuat: "DXC-0001" }));
      }
    };
    fetchNextCode();
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [items, setItems] = useState<ExportDetailItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCageDetailOpen, setIsCageDetailOpen] = useState(false);
  const [selectedCage, setSelectedCage] = useState<any>(null);

  // State cho loading và dialog phiếu thu
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [savedSaleData, setSavedSaleData] = useState<{
    id: string;
    totalAmount: number;
  } | null>(null);
  const [collectionForm, setCollectionForm] = useState({
    cashAccountId: "",
    collectionDate: new Date().toISOString().split("T")[0],
    amount: 0,
    description: "",
    notes: "",
  });
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  // Fetch danh sách tài khoản tiền mặt
  const { data: cashAccounts = [] } = useCashAccounts();

  const allChecked = items.length > 0 && items.every((item) => item.checked);
  const hasSelectedItems = items.some((item) => item.checked);
  const isTableEmpty = items.length === 0;

  const handleDeleteSelected = () => {
    const remainingItems = items.filter((item) => !item.checked);
    setItems(remainingItems.map((item, index) => ({ ...item, stt: index + 1 })));
    setShowDeleteModal(false);
  };

  const handleConfirmPigSelection = (selectedPigIds: string[]) => {
    if (selectedCage) {
      setItems(items.map((item) => 
        (item as any).chuong_id === selectedCage.id ? { ...item, pig_ids: selectedPigIds } : item
      ));
    }
  };

  const handleSave = async () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.tenKhachHang.trim()) newErrors.tenKhachHang = "Bắt buộc nhập tên khách hàng";
    if (!formData.sdt.trim()) newErrors.sdt = "Bắt buộc nhập số điện thoại";
    if (!formData.soNha.trim()) newErrors.soNha = "Bắt buộc nhập địa chỉ";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isTableEmpty) {
      alert("Vui lòng thêm ít nhất một chuồng xuất!");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        receipt_code: formData.dotXuat,
        export_date: new Date(formData.ngayXuat),
        customer_name: formData.tenKhachHang,
        phone_number: formData.sdt,
        full_address: `${formData.soNha}, ${formData.phuongXa}, ${formData.tinhThanh}`,
        details: items.map(item => ({
          pen_id: (item as any).chuong_id,
          total_weight: Number(item.tongTrongLuong),
          unit_price: Number(item.donGia),
          pig_ids: (item as any).pig_ids || []
        }))
      };

      const savedData = await api.post<SaleReceipt>("/sales", payload);

      // Tính tổng tiền
      // const totalAmount = items.reduce(
      //   (sum, item) => sum + Number(item.tongTrongLuong) * Number(item.donGia),
      //   0
      // );

      // // Lưu data và hiện dialog
      // setSavedSaleData({ id: savedData.id, totalAmount });
      // setCollectionForm(prev => ({
      //   ...prev,
      //   amount: totalAmount,
      //   description: `Thu tiền phiếu xuất ${formData.dotXuat}`,
      //   collectionDate: formData.ngayXuat,
      // }));
      // setShowCollectionDialog(true);
      router.push("/export");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      alert(`Lỗi: ${Array.isArray(message) ? message.join(", ") : message || "Không thể kết nối"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!collectionForm.cashAccountId) {
      alert("Vui lòng chọn tài khoản thu");
      return;
    }

    try {
      setIsCreatingCollection(true);

      await api.post("/api/finance/pig-sale-collections", {
        customerName: formData.tenKhachHang,
        pigShippingId: savedSaleData?.id,
        cashAccountId: collectionForm.cashAccountId,
        collectionDate: collectionForm.collectionDate,
        amount: collectionForm.amount,
        description: collectionForm.description,
        notes: collectionForm.notes || undefined,
      });

      setShowCollectionDialog(false);
      router.push("/export");
    } catch (error: any) {
      alert(
        "Lỗi tạo phiếu thu: " +
          (error?.response?.data?.message || "Không thể kết nối")
      );
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleSkipCollection = () => {
    setShowCollectionDialog(false);
    router.push("/export");
  };

  const handleAddCagesFromModal = (selectedItems: SelectedItem[]) => {
    const existingIds = items.map((i: any) => i.chuong_id);
    const uniqueNewItems = selectedItems.filter(newItem => !existingIds.includes(newItem.chuong_id));

    if (uniqueNewItems.length === 0 && selectedItems.length > 0) {
      alert("Các chuồng được chọn đã tồn tại trong danh sách!");
      return;
    }

    const lastStt = items.length > 0 ? Math.max(...items.map((i) => i.stt)) : 0;

    const newFormattedItems = selectedItems.map((item, index) => ({
      stt: lastStt + index + 1,
      chuong_id: item.chuong_id,
      chuong: item.chuong,
      tongTrongLuong: 0,
      donGia: item.donGia,
      checked: false,
      pig_ids: []
    }));

    setItems([...items, ...newFormattedItems]);
  };

  const handleViewDetail = (item: any) => {
    setSelectedCage({ 
      id: item.chuong_id, 
      chuong: item.chuong,
      giong: "Đang tải...", 
      soLuong: item.pig_ids?.length || 0 
    });
    setIsCageDetailOpen(true);
  };

  return (
    <div className="p-8 min-h-screen animate-in fade-in duration-500 bg-[var(--color-background)] text-[var(--color-muted-foreground)]">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/export">
          <button className="p-2 rounded-full transition hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--color-secondary-foreground)]">Phiếu xuất chuồng</h1>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b pb-1 border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Thông tin</h2>
          <button
            onClick={handleSave}
            disabled={isTableEmpty || isSaving}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md mb-1 flex items-center gap-2 ${
              isTableEmpty || isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isSaving && <Spinner className="h-4 w-4" />}
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-5">
            <div className="flex items-center">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Đợt xuất</label>
              <input type="text" disabled readOnly value={formData.dotXuat} onChange={(e) => setFormData({ ...formData, dotXuat: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center">
                <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Tên khách hàng</label>
                <input type="text" placeholder="Nhập tên khách hàng..." 
                  value={formData.tenKhachHang} 
                  onChange={(e) => { 
                    const val = e.target.value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, ""); 
                    setFormData({ ...formData, tenKhachHang: val }); 
                    setErrors({ ...errors, tenKhachHang: "" }); 
                  }}
                  className={`flex-1 border ${errors.tenKhachHang ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`} />
              </div>
              {errors.tenKhachHang && <p className="text-red-500 text-[11px] ml-40 mt-1">{errors.tenKhachHang}</p>}
            </div>
            <div className="flex items-start">
              <label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)] pt-2">Địa chỉ</label>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col"><div className="flex items-center gap-3"><span className="text-[11px] italic w-44 text-gray-500">Số nhà, đường...</span><input type="text" value={formData.soNha} onChange={(e) => { setFormData({ ...formData, soNha: e.target.value }); setErrors({ ...errors, soNha: "" }); }} className={`flex-1 border ${errors.soNha ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500`} /></div>{errors.soNha && <p className="text-red-500 text-[11px] ml-44 mt-1">{errors.soNha}</p>}</div>
                <div className="flex items-center gap-3"><span className="text-[11px] italic w-44 text-gray-500">Tỉnh/Thành phố</span><select className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none bg-white" value={formData.tinhThanh} onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}><option>Tp. Hồ Chí Minh</option><option>Hà Nội</option></select></div>
                <div className="flex items-center gap-3"><span className="text-[11px] italic w-44 text-gray-500">Xã/Phường</span><select className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none bg-white" value={formData.phuongXa} onChange={(e) => setFormData({ ...formData, phuongXa: e.target.value })}><option>Phường Thủ Đức</option></select></div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center"><label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Ngày xuất</label><input type="date" value={formData.ngayXuat} onChange={(e) => setFormData({ ...formData, ngayXuat: e.target.value })} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            <div className="flex flex-col"><div className="flex items-center"><label className="w-40 text-sm font-semibold text-[var(--color-secondary-foreground)]">Số điện thoại</label><input type="text" placeholder="Nhập số điện thoại..." value={formData.sdt} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); setFormData({ ...formData, sdt: val }); setErrors({ ...errors, sdt: "" }); }} className={`flex-1 border ${errors.sdt ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none`} /></div>{errors.sdt && <p className="text-red-500 text-[11px] ml-40 mt-1">{errors.sdt}</p>}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Chi tiết chuồng xuất</h2>
          <div className="flex gap-3">
            <button onClick={() => setIsModalOpen(true)} className="border border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">Thêm</button>
            <button onClick={() => setShowDeleteModal(true)} disabled={isTableEmpty} className={`px-6 py-2 rounded-lg text-sm font-medium transition shadow-md ${isTableEmpty ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-red-600 text-white hover:bg-red-700"}`}>Xoá</button>
          </div>
        </div>

        <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="w-[50px] px-6 py-4 text-center font-bold"><input type="checkbox" checked={allChecked} onChange={(e) => setItems(items.map((item) => ({ ...item, checked: e.target.checked })))} className="h-5 w-5 rounded border-gray-300 text-emerald-600" /></th>
                <th className="px-6 py-3 text-center font-semibold">STT</th>
                <th className="px-6 py-3 text-center font-semibold">Chuồng</th>
                <th className="px-6 py-3 text-center font-semibold">Trọng lượng (kg)</th> 
                <th className="px-6 py-3 text-center font-semibold">Đơn giá (VNĐ/kg)</th>
                <th className="px-6 py-3 text-center font-semibold tracking-wider"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={item.stt} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-3 text-center">
                    <input type="checkbox" checked={item.checked || false} onChange={(e) => { const newItems = [...items]; newItems[index].checked = e.target.checked; setItems(newItems); }} className="h-5 w-5 rounded border-gray-300 text-emerald-600" />
                  </td>
                  <td className="px-6 py-3 text-center text-gray-500">{item.stt}</td>
                  <td className="px-6 py-3 text-center text-emerald-900 font-medium">{item.chuong}</td>
                  <td className="px-6 py-3 text-center">
                    <input
                        type="number"
                        value={item.tongTrongLuong}
                        onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].tongTrongLuong = Number(e.target.value);
                            setItems(newItems);
                        }}
                        className="w-24 text-center border border-gray-300 rounded px-2 py-1 outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-6 py-3 text-center">
                    {editingIndex === index ? (
                      <input type="number" value={item.donGia} autoFocus onChange={(e) => { const newItems = [...items]; newItems[index].donGia = Number(e.target.value); setItems(newItems); }} onBlur={() => setEditingIndex(null)} onKeyDown={(e) => { if (e.key === "Enter") setEditingIndex(null); }} className="w-32 text-center border border-emerald-500 rounded px-2 py-1 outline-none" />
                    ) : (
                      <span onClick={() => setEditingIndex(index)} className="cursor-pointer font-bold text-gray-800 hover:text-emerald-600">{formatter.format(item.donGia)}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => handleViewDetail(item)} className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                      <Eye className="h-5 w-5 mx-auto" />
                      <span className="text-[10px] block">{item.pig_ids?.length || 0} heo</span>
                    </button>
                  </td>
                </tr>
              ))}
              {isTableEmpty && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">Danh sách chi tiết đang trống. Vui lòng thêm chuồng để tiếp tục.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-3 text-gray-900">{hasSelectedItems ? "Xác nhận xóa" : "Thông báo"}</h3>
            <p className="text-gray-600 mb-8">{hasSelectedItems ? "Các chuồng đã chọn sẽ bị loại khỏi phiếu xuất này. Bạn có chắc không?" : "Vui lòng chọn ít nhất một chuồng để thực hiện xóa."}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700">{hasSelectedItems ? "Hủy" : "Đã hiểu"}</button>
              {hasSelectedItems && (
                <button onClick={handleDeleteSelected} className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 shadow-lg">Xác nhận</button>
              )}
            </div>
          </div>
        </div>
      )}

      <AddExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddCagesFromModal} />
      <CageDetailModal isOpen={isCageDetailOpen} onClose={() => setIsCageDetailOpen(false)} cageData={selectedCage || {}} onConfirmSelection={handleConfirmPigSelection} />

      {/* Dialog tạo phiếu thu */}
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu</DialogTitle>
            <DialogDescription>
              Phiếu xuất đã được lưu thành công. Bạn có muốn tạo phiếu thu ngay không?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tài khoản thu */}
            <div className="space-y-2">
              <Label>Tài khoản thu *</Label>
              <Select
                value={collectionForm.cashAccountId}
                onValueChange={(value) =>
                  setCollectionForm((prev) => ({ ...prev, cashAccountId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  {cashAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ngày thu */}
            <div className="space-y-2">
              <Label>Ngày thu *</Label>
              <input
                type="date"
                value={collectionForm.collectionDate}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, collectionDate: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Số tiền */}
            <div className="space-y-2">
              <Label>Số tiền *</Label>
              <input
                type="number"
                value={collectionForm.amount}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, amount: Number(e.target.value) }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                min="0"
              />
              <p className="text-xs text-gray-500">
                Tổng tiền phiếu xuất: {formatter.format(savedSaleData?.totalAmount || 0)} VNĐ
              </p>
            </div>

            {/* Diễn giải */}
            <div className="space-y-2">
              <Label>Diễn giải</Label>
              <input
                type="text"
                value={collectionForm.description}
                onChange={(e) =>
                  setCollectionForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkipCollection}
              disabled={isCreatingCollection}
            >
              Bỏ qua
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={isCreatingCollection || !collectionForm.cashAccountId}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isCreatingCollection && <Spinner className="mr-2 h-4 w-4" />}
              {isCreatingCollection ? "Đang tạo..." : "Tạo phiếu thu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddExportReceipt;