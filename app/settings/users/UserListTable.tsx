"use client";

import React from "react";
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

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  editedUsers,
  setEditedUsers,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
  userGroups,
}) => (
  <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
    <table className="min-w-full divide-y divide-[var(--color-border)] table-auto">
      <thead className="bg-[var(--color-muted)]">
        <tr>
          <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            STT
          </th>
          <th className="w-48 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Tên người dùng
          </th>
          <th className="w-48 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Nhóm người dùng
          </th>
          <th className="w-64 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Email
          </th>
          <th className="w-48 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
            Mật khẩu
          </th>
          <th className="w-16 text-center">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--color-border)]">
        {users.map((row, index) => (
          <tr key={row.stt} className="hover:bg-[var(--color-muted)] transition-colors">
            <td className="px-4 py-2 text-center text-sm font-medium text-[var(--color-foreground)]">
              {row.stt}
            </td>
            <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="text"
                value={editedUsers[index]?.username || row.username}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].username = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-foreground)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
              <select
                value={editedUsers[index]?.group || row.group}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].group = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-foreground)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {userGroups.map((g, idx) => (
                  <option key={idx} value={g}>{g}</option>
                ))}
              </select>
            </td>
            <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="email"
                value={editedUsers[index]?.email || row.email}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].email = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-foreground)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
              <input
                type="text"
                value={editedUsers[index]?.password || row.password}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].password = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-[var(--color-border)] rounded-lg p-2 text-sm text-center text-[var(--color-foreground)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={checkedRows[index] ?? false}
                  onChange={() => toggleRow(index)}
                  className="form-checkbox h-5 w-5 text-[var(--color-primary)]"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserListTable;
