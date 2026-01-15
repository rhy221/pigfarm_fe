// types/export.ts
export interface ExportProposal {
  stt: number;
  chuong: string;
  giong: string;          
  soLuong: number;
  tongTrongLuong: number;
  donGia: number;
  thanhTienDuKien: number;
  ngayXuatDuKien: string;
}

export interface ExportReceipt {
  stt: number;
  id: string;
  dot: string;
  khachHang: string;
  tongTien: number;
  ngayXuat: string;
  tinhTrangThanhToan: string;
  sdt?: string;     
  diaChi?: string;
}

export interface ExportDetailItem {
  stt: number;
  id?: string;
  chuong: string;
  tongTrongLuong: number;
  donGia: number;
  checked?: boolean;
  pig_ids?: string[];
}