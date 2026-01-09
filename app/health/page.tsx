"use client";

import React, { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import Link from "next/link";
import TreatmentDetail from "./treatment/TreatmentDetail"; 
import HistoryDetailModal from "./HistoryDetailModal"; 

const SickPigManagement: React.FC = () => {
  const [activeRecords] = useState([
    { stt: 1, chuong: "C001", soLuong: 20, loaiBenh: "Dịch tả heo Châu Phi", ngayPhatHien: "11/11/2025" },
    { stt: 2, chuong: "C001", soLuong: 20, loaiBenh: "Lở mồm long móng", ngayPhatHien: "12/11/2025" },
    { stt: 3, chuong: "C002", soLuong: 15, loaiBenh: "Dịch tả heo Châu Phi", ngayPhatHien: "13/11/2025" },
  ]);

  const [historyRecords] = useState([
    { stt: 1, chuong: "A001", soLuong: 20, loaiBenh: "Dịch tả heo Châu Phi", ngayPhatHien: "10/11/2025" },
    { stt: 2, chuong: "A001", soLuong: 15, loaiBenh: "Tụ huyết trùng", ngayPhatHien: "09/11/2025" },
  ]);

  const [filterActive, setFilterActive] = useState("");
  const [filterHistory, setFilterHistory] = useState("");

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleOpenDetail = (record: any) => {
    setSelectedRecord({
      ...record,
      soLuong: record.soLuong || 20,
    });
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  const activeDiseaseTypes = useMemo(() => 
    Array.from(new Set(activeRecords.map(r => r.loaiBenh))), [activeRecords]
  );
  const historyDiseaseTypes = useMemo(() => 
    Array.from(new Set(historyRecords.map(r => r.loaiBenh))), [historyRecords]
  );

  const filteredActive = activeRecords.filter(item => 
    filterActive === "" ? true : item.loaiBenh === filterActive
  );

  const filteredHistory = historyRecords.filter(item => 
    filterHistory === "" ? true : item.loaiBenh === filterHistory
  );

  if (showDetail && selectedRecord) {
    return <TreatmentDetail data={selectedRecord} onBack={handleBackToList} />;
  }

  return (
    <div className="p-8 min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Thêm Modal vào đây */}
      <HistoryDetailModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        data={selectedHistoryRecord} 
      />

      <h1 className="text-3xl font-extrabold mb-8" style={{ color: '#53A88B' }}>Heo bệnh</h1>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4 text-[var(--color-secondary-foreground)] border-b pb-2 border-gray-200">
          Theo dõi và điều trị
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-emerald-100">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700 border-b border-emerald-100">
              <tr>
                <th className="px-4 py-4 text-center font-semibold uppercase">STT</th>
                <th className="px-4 py-4 text-center font-semibold">Chuồng</th>
                <th className="px-4 py-4 text-center font-semibold">Số lượng</th>
                <th className="px-4 py-4 text-center font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <span>Loại bệnh</span>
                    <div className="relative group">
                      <Filter size={14} className="cursor-pointer hover:text-emerald-500" />
                      <select 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full text-gray-500"
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                      >
                        <option value="" className="text-gray-500">Tất cả</option>
                        {activeDiseaseTypes.map((type, i) => (
                          <option key={i} value={type} className="text-gray-500">{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-4 text-center font-semibold">Ngày phát hiện</th>
                <th className="px-4 py-4 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200">
              {filteredActive.map((item, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"}`}
                >
                  <td className="px-4 py-6 text-center text-gray-500">{index + 1}</td>
                  <td className="px-4 py-6 text-center font-medium text-emerald-900">{item.chuong}</td>
                  <td className="px-4 py-6 text-center">{item.soLuong}</td>
                  <td className="px-4 py-6 text-center text-gray-600">{item.loaiBenh}</td>
                  <td className="px-4 py-6 text-center">{item.ngayPhatHien}</td>
                  <td className="px-4 py-6 text-center">
                    <Link 
                        href={{
                          pathname: "/health/treatment",
                          query: { 
                            chuong: item.chuong,
                            soLuong: item.soLuong,
                            loaiBenh: item.loaiBenh,
                            ngayPhatHien: item.ngayPhatHien
                          }
                        }}
                      className="text-emerald-600 font-medium hover:underline cursor-pointer"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredActive.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 italic">Không tìm thấy dữ liệu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-4 text-[var(--color-secondary-foreground)] border-b pb-2 border-gray-200">
          Lịch sử điều trị
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-emerald-100">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700 border-b border-emerald-100">
              <tr>
                <th className="px-4 py-4 text-center font-semibold uppercase">STT</th>
                <th className="px-4 py-4 text-center font-semibold">Chuồng</th>
                <th className="px-4 py-4 text-center font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <span>Loại bệnh</span>
                    <div className="relative group">
                      <Filter size={14} className="cursor-pointer hover:text-emerald-500" />
                      <select 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full text-gray-500"
                        value={filterHistory}
                        onChange={(e) => setFilterHistory(e.target.value)}
                      >
                        <option value="" className="text-gray-500">Tất cả</option>
                        {historyDiseaseTypes.map((type, i) => (
                          <option key={i} value={type} className="text-gray-500">{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-4 text-center font-semibold">Ngày phát hiện</th>
                <th className="px-4 py-4 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-gray-200">
              {filteredHistory.map((item, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"}`}
                >
                  <td className="px-4 py-6 text-center text-gray-500">{index + 1}</td>
                  <td className="px-4 py-6 text-center font-medium text-emerald-900">{item.chuong}</td>
                  <td className="px-4 py-6 text-center text-gray-600">{item.loaiBenh}</td>
                  <td className="px-4 py-6 text-center">{item.ngayPhatHien}</td>
                  <td className="px-4 py-6 text-center">
                    <span 
                      onClick={() => {
                        setSelectedHistoryRecord({ ...item, soLuong: item.soLuong || 0 });
                        setIsHistoryModalOpen(true);
                      }}
                      className="text-emerald-600 font-medium hover:underline cursor-pointer"
                    >
                      Chi tiết
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">Không tìm thấy dữ liệu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SickPigManagement;