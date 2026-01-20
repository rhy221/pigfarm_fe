// app/export/page.tsx
import ExportContent from "./ExportContent";

export const metadata = {
  title: "Quản lý Xuất chuồng | Hệ thống trang trại",
  description: "Trang quản lý các đề xuất và phiếu xuất chuồng",
};

export default function ExportPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">   
      <ExportContent />
    </main>
  );
}