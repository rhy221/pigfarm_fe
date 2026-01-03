"use client";

import React, { useState } from "react";
import type { User } from "./UserListContent";

interface UserListTableProps {
  users: User[];
  editedUsers: User[];
  setEditedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
  userGroups: string[];
}

type EditableField = "username" | "group" | "email" | "password";

type EditingCell =
  | { row: number; field: EditableField }
  | null;

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  editedUsers,
  setEditedUsers,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  userGroups,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const updateValue = (
    index: number,
    field: EditableField,
    value: string
  ) => {
    const newEdited = [...editedUsers];
    if (!newEdited[index]) newEdited[index] = { ...users[index] };
    newEdited[index][field] = value as any;
    setEditedUsers(newEdited);
  };

  const renderCell = (
    index: number,
    field: EditableField,
    value: string,
    type: "text" | "email" | "password" = "text"
  ) => {
    const isEditing =
      editingCell?.row === index && editingCell.field === field;

    if (isEditing) {
      return (
        <input
          autoFocus
          type={type}
          value={value}
          onChange={(e) => updateValue(index, field, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingCell(null)}
          className="w-full border border-[var(--color-border)] rounded-md px-2 py-1 text-sm text-center
                     bg-[var(--color-card)] focus:outline-none focus:ring-2
                     focus:ring-[var(--color-primary)]"
        />
      );
    }

    return (
      <span
        onClick={() => setEditingCell({ row: index, field })}
        className="block cursor-pointer rounded-md px-2 py-1 hover:bg-[var(--color-muted)]"
      >
        {value}
      </span>
    );
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
              Tên người dùng
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Nhóm người dùng
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Email
            </th>
            <th className="w-[150px] px-4 py-3 text-center text-sm font-semibold">
              Mật khẩu
            </th>
            <th className="w-[80px] text-center">
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
            const current = editedUsers[index] || row;

            return (
              <tr
                key={row.stt}
                className={`transition-colors hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-emerald-50/10"
                }`}
              >
                <td className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                  {row.stt}
                </td>

                <td className="px-4 py-2 text-center text-sm text-emerald-900">
                  {renderCell(index, "username", current.username)}
                </td>

                <td className="px-4 py-2 text-center text-sm">
                  {editingCell?.row === index &&
                  editingCell.field === "group" ? (
                    <select
                      autoFocus
                      value={current.group}
                      onChange={(e) =>
                        updateValue(index, "group", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      className="w-full border border-emerald-200 rounded-md px-2 py-1 text-sm text-center
                                 bg-white focus:outline-none focus:ring-2
                                 focus:ring-emerald-500"
                    >
                      {userGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "group" })
                      }
                      className="block cursor-pointer rounded-md px-2 py-1 hover:bg-emerald-50 text-emerald-900 font-medium"
                    >
                      {current.group}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center text-sm text-emerald-900">
                  {renderCell(index, "email", current.email, "email")}
                </td>

                <td className="px-4 py-2 text-center text-sm text-emerald-900">
                  {renderCell(index, "password", current.password, "password")}
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
