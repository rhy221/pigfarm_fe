"use client";

import React, { useState } from "react";
import type { User } from "./UserListContent";

interface UserGroup {
  id: string;
  name: string;
}

interface UserListTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  userGroups: UserGroup[];
}

type EditableField = "full_name" | "role_id" | "email" | "password_hash" | "phone";
type EditingCell = { row: number; field: EditableField } | null;

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  setUsers,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  userGroups = [],
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const updateValue = async (index: number, field: EditableField, value: string) => {
    const originalUsers = [...users];
    const updatedUsers = [...users];
    const currentUser = { ...updatedUsers[index] };

    (currentUser as any)[field] = value;
    updatedUsers[index] = currentUser;
    setUsers(updatedUsers);

    try {
      const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          [field]: value 
        }),
      });

      if (!response.ok) throw new Error("Update failed");
    } catch (error) {
      console.error("Failed to update user:", error);
      setUsers(originalUsers);
    }
  };

  const renderCell = (
    index: number,
    field: EditableField,
    value: any,
    type: "text" | "email" | "password" | "tel" = "text"
  ) => {
    const isEditing = editingCell?.row === index && editingCell.field === field;

    if (isEditing) {
      return (
        <input
          autoFocus
          type={type}
          value={value?.toString() || ""}
          onChange={(e) => {
            const newUsers = [...users];
            (newUsers[index] as any)[field] = e.target.value;
            setUsers(newUsers);
          }}
          onBlur={() => {
            updateValue(index, field, users[index][field]?.toString() || "");
            setEditingCell(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateValue(index, field, users[index][field]?.toString() || "");
              setEditingCell(null);
            }
          }}
          className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({ row: index, field })}
        className="block cursor-pointer rounded-md px-2 py-1 hover:bg-emerald-50 w-full min-h-[1.5rem]"
      >
        {value?.toString() || "---"}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-6xl mx-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[50px] px-2 py-3 text-center font-semibold uppercase">STT</th>
            <th className="w-[180px] px-4 py-3 text-center font-semibold">Họ và tên</th>
            <th className="w-[150px] px-4 py-3 text-center font-semibold">Nhóm người dùng</th>
            <th className="w-[180px] px-4 py-3 text-center font-semibold">Email</th>
            <th className="w-[130px] px-4 py-3 text-center font-semibold">Số điện thoại</th>
            <th className="w-[130px] px-4 py-3 text-center font-semibold">Mật khẩu</th>
            <th className="w-[50px] text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="h-5 w-5 text-emerald-600 cursor-pointer"
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {users.map((row, index) => {
            const currentGroup = row.user_group || userGroups?.find(
              (g) => g?.id === row.role_id
            );

            return (
              <tr
                key={row.id}
                className={`transition-colors hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
                }`}
              >
                <td className="px-2 py-2 text-center text-gray-500">{index + 1}</td>
                <td className="px-4 py-2 text-center text-emerald-900 font-medium">
                  {renderCell(index, "full_name", row.full_name)}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingCell?.row === index && editingCell.field === "role_id" ? (
                    <select
                      autoFocus
                      value={row.role_id || ""}
                      onChange={(e) => updateValue(index, "role_id", e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                    >
                      {userGroups.map((g) => (
                        <option key={g?.id} value={g?.id}>
                          {g?.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingCell({ row: index, field: "role_id" })}
                      className="block cursor-pointer rounded-md px-2 py-1 hover:bg-emerald-50 text-emerald-900 font-medium w-full"
                    >
                      {currentGroup?.name || "N/A"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center text-emerald-900">
                  {renderCell(index, "email", row.email, "email")}
                </td>
                <td className="px-4 py-2 text-center text-emerald-900">
                  {renderCell(index, "phone", row.phone, "tel")}
                </td>
                <td className="px-4 py-2 text-center text-emerald-900">
                  {renderCell(index, "password_hash", row.password_hash, "password")}
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="h-5 w-5 text-emerald-600 cursor-pointer"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserListTable;