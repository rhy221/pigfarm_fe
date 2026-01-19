"use client";

import React, { useState } from "react";
import { Vaccine } from "./VaccineContent";

interface VaccineTableProps {
  vaccines: Vaccine[];
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, data: Partial<Vaccine>) => Promise<void>;
}

type EditableField = "vaccine_name" | "dosage" | "description" | "stage" | "days_old";

const VaccineTable: React.FC<VaccineTableProps> = ({
  vaccines,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<{ row: number; field: EditableField } | null>(null);

  const handleFinishEditing = (index: number, row: Vaccine, field: EditableField, value: string) => {
    const trimmedValue = value.trim();
    const oldValue = String(row[field as keyof Vaccine]);

    if (trimmedValue === "" || trimmedValue === oldValue) {
      setEditingCell(null);
      return;
    }

    let finalValue: string | number = trimmedValue;
    if (field === "stage" || field === "days_old") {
      finalValue = Number(trimmedValue);
      if (finalValue < 1) {
        setEditingCell(null);
        return;
      }
    }

    onUpdate(row.id!, { [field]: finalValue });
    setEditingCell(null);
  };

  const renderCell = (index: number, field: EditableField, value: any) => {
    const isEditing = editingCell?.row === index && editingCell.field === field;
    if (isEditing) {
      return (
        <input
          autoFocus
          type={field === "stage" || field === "days_old" ? "number" : "text"}
          min={field === "days_old" ? "1" : undefined}
          className="w-full border border-emerald-200 rounded px-2 py-1 text-center focus:ring-2 focus:ring-emerald-500 outline-none"
          defaultValue={value}
          onBlur={(e) => handleFinishEditing(index, vaccines[index], field, e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleFinishEditing(index, vaccines[index], field, e.currentTarget.value);
            if (e.key === "Escape") setEditingCell(null);
          }}
        />
      );
    }
    return (
      <span 
        onClick={() => setEditingCell({ row: index, field })} 
        className="block cursor-pointer hover:bg-emerald-50 rounded px-2 py-1"
      >
        {value ?? "---"}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-5xl mx-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[60px] py-3 text-center uppercase font-semibold">STT</th>
            <th className="w-[180px] py-3 text-center font-semibold">Tên vắc-xin</th>
            <th className="w-[80px] py-3 text-center font-semibold">Giai đoạn</th>
            <th className="w-[80px] py-3 text-center font-semibold">Ngày tuổi</th>
            <th className="w-[120px] py-3 text-center font-semibold">Liều lượng</th>
            <th className="w-[200px] py-3 text-center font-semibold">Mô tả</th>
            <th className="w-[60px] text-center">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-5 w-5 cursor-pointer" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {vaccines.map((row, index) => (
            <tr key={row.id || index} className={index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"}>
              <td className="py-2 text-center text-gray-500">{index + 1}</td>
              <td className="py-2 text-center font-medium">{renderCell(index, "vaccine_name", row.vaccine_name)}</td>
              <td className="py-2 text-center">{renderCell(index, "stage", row.stage)}</td>
              <td className="py-2 text-center">{renderCell(index, "days_old", row.days_old)}</td>
              <td className="py-2 text-center">{renderCell(index, "dosage", row.dosage)}</td>
              <td className="py-2 text-center">{renderCell(index, "description", row.description)}</td>
              <td className="py-2 text-center">
                <input type="checkbox" checked={checkedRows[index] ?? false} onChange={() => toggleRow(index)} className="h-5 w-5 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaccineTable;