"use client";

import React, { useState, useEffect } from "react";
import VaccineTable from "./VaccineTable";
import AddNewVaccineModal from "./AddNewVaccineModal";

export interface Vaccine {
  id?: string;
  stt: number;
  vaccine_name: string;
  stage: number;
  days_old: number;
  dosage: string;
  description: string;
}

interface VaccineContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const VaccineContent: React.FC<VaccineContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  const fetchVaccines = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccines`);
      const data = await res.json();
      const rawData = Array.isArray(data) ? data : (data.data || []);
      const mappedData = rawData.map((v: any, index: number) => ({
        id: v.id,
        stt: index + 1,
        vaccine_name: v.vaccine_name,
        stage: v.stage,
        days_old: v.days_old,
        dosage: v.dosage,
        description: v.description,
      }));
      setVaccines(mappedData);
      setCheckedRows(mappedData.map(() => false));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, updateData: Partial<Vaccine>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (res.ok) await fetchVaccines();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const allChecked = vaccines.length > 0 && 
                     checkedRows.length > 0 && 
                     checkedRows.every(Boolean);

  const toggleAll = () => {
    if (vaccines.length === 0) return;
    const nextValue = !allChecked;
    setCheckedRows(vaccines.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addVaccine = async (data: Partial<Vaccine>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) fetchVaccines();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelected = async () => {
    try {
      const idsToDelete = vaccines.filter((_, index) => checkedRows[index]).map((v) => v.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaccines`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (res.ok) {
        fetchVaccines();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <VaccineTable
          vaccines={vaccines}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
          onUpdate={handleUpdate}
        />
      </div>
      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewVaccineModal onClose={() => setIsAdding(false)} onSave={addVaccine} />
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">Xác nhận xoá</h3>
            <p className="mb-6 text-center text-gray-600">Xoá các vắc xin đã chọn?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
              <button onClick={deleteSelected} className="px-4 py-2 bg-red-600 text-white rounded-lg">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineContent;