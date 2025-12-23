// types/export.ts
export interface ExportProposal {
  stt: number;
  chuong: string;
  soLuong: number;
  tongTrongLuong: number;
  donGia: number;
  thanhTienDuKien: number;
  ngayXuatDuKien: string;
}

export interface ExportReceipt {
  stt: number;
  dot: string;
  khachHang: string;
  tongTien: number;
  ngayXuat: string;
  tinhTrangThanhToan: string;
}

export interface ExportDetailItem {
  stt: number;
  chuong: string;
  soLuong: number;
  tongTrongLuong: number;
  donGia: number;
  checked?: boolean;
}