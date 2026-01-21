"use client";

import React, { useState } from "react";
import type { UserGroup } from "./UserGroupContent";

interface UserGroupTableProps {
  groups: UserGroup[];
  editedGroups: UserGroup[];
  setEditedGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  onUpdate: (id: string, updateData: any) => Promise<void>;
}

type EditingCell = { row: number; field: "name" } | null;

const UserGroupTable: React.FC<UserGroupTableProps> = ({
  groups,
  editedGroups,
  setEditedGroups,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  onUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const handleFinishEditing = async (index: number) => {
    const originalRow = groups[index];
    const editedRow = editedGroups[index];

    if (!originalRow || !editedRow) {
      setEditingCell(null);
      return;
    }

    const trimmedValue = editedRow.name.trim();

    if (trimmedValue && trimmedValue !== originalRow.name) {
      try {
        await onUpdate(originalRow.id!, { name: trimmedValue });
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
      }
    }
    setEditingCell(null);
  };

  const updateValue = (index: number, value: string) => {
    const newEdited = [...editedGroups];
    newEdited[index] = { ...newEdited[index], name: value };
    setEditedGroups(newEdited);
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-4xl mx-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[80px] px-4 py-3 text-center text-sm font-semibold uppercase">
              STT
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Nhóm người dùng
            </th>
            <th className="w-[80px] text-center">
              {groups.some(g => !g.hasUsers) && (
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="h-5 w-5 text-emerald-600 cursor-pointer"
                />
              )}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-emerald-50">
          {groups.map((row, index) => {
            const current = editedGroups[index] || row;

            return (
              <tr
                key={row.id || index}
                className={`transition-colors hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
                }`}
              >
                <td className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                  {row.stt}
                </td>

                <td className="px-4 py-2 text-center text-sm text-emerald-900 font-medium">
                  {editingCell?.row === index ? (
                    <input
                      autoFocus
                      type="text"
                      value={current.name}
                      onChange={(e) => updateValue(index, e.target.value)}
                      onBlur={() => handleFinishEditing(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFinishEditing(index);
                        }
                        if (e.key === "Escape") {
                          setEditingCell(null);
                        }
                      }}
                      className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm text-center
                                 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "name" })
                      }
                      className="block cursor-pointer rounded-md px-2 py-1
                                    hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {current.name}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center">
                  {!row.hasUsers && (
                    <input
                      type="checkbox"
                      checked={checkedRows[index] ?? false}
                      onChange={() => toggleRow(index)}
                      className="h-5 w-5 text-emerald-600 cursor-pointer"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserGroupTable;