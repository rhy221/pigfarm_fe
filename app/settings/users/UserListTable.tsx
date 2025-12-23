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
  <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
    <table className="min-w-full divide-y divide-gray-200 table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="w-16 px-4 py-2 text-center text-sm font-semibold text-gray-600 uppercase">STT</th>
          <th className="w-48 px-4 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Tên người dùng</th>
          <th className="w-48 px-4 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Nhóm người dùng</th>
          <th className="w-64 px-4 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Email</th>
          <th className="w-48 px-4 py-2 text-center text-sm font-semibold text-gray-600 uppercase">Mật khẩu</th>
          <th className="w-16 px-4 py-2 text-center">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="form-checkbox h-5 w-5 text-green-600"
            />
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((row, index) => (
          <tr key={row.stt} className="hover:bg-gray-50 transition">
            <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{row.stt}</td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <input
                type="text"
                value={editedUsers[index]?.username || row.username}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].username = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center"
              />
            </td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <select
                value={editedUsers[index]?.group || row.group}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].group = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center"
              >
                {userGroups.map((g, idx) => (
                  <option key={idx} value={g}>{g}</option>
                ))}
              </select>
            </td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <input
                type="email"
                value={editedUsers[index]?.email || row.email}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].email = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center"
              />
            </td>
            <td className="px-4 py-2 text-center text-sm text-gray-700">
              <input
                type="text"
                value={editedUsers[index]?.password || row.password}
                onChange={(e) => {
                  const newEdited = [...editedUsers];
                  if (!newEdited[index]) newEdited[index] = { ...row };
                  newEdited[index].password = e.target.value;
                  setEditedUsers(newEdited);
                }}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <input
                type="checkbox"
                checked={checkedRows[index] ?? false}
                onChange={() => toggleRow(index)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserListTable;
