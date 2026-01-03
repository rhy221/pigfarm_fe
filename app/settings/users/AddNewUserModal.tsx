"use client";

import React, { useState } from "react";

interface AddNewUserModalProps {
  userGroups: string[];
  onClose: () => void;
  onSave: (username: string, group: string, email: string, password: string) => void;
}

const AddNewUserModal: React.FC<AddNewUserModalProps> = ({ userGroups, onClose, onSave }) => {
  const [username, setUsername] = useState("");
  const [group, setGroup] = useState(userGroups[0] || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (!username.trim() || !group.trim() || !email.trim()) return;
    onSave(username.trim(), group, email.trim(), password);
    setUsername("");
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 w-96">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm người dùng mới</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tên người dùng</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nhóm người dùng</label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {userGroups.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition text-gray-700"
        >
          Hủy
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg text-sm font-medium transition shadow-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default AddNewUserModal;
