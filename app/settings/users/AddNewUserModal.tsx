"use client";

import React, { useState, useEffect } from "react";

interface UserGroup {
  id: string;
  name: string;
}

interface AddNewUserModalProps {
  userGroups: UserGroup[];
  onClose: () => void;
  onSave: (fullName: string, roleId: string, email: string, password_hash: string, phone: string) => void;
}

const AddNewUserModal: React.FC<AddNewUserModalProps> = ({ userGroups = [], onClose, onSave }) => {
  const [fullName, setFullName] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (userGroups.length > 0 && !roleId && userGroups[0]?.id !== undefined) {
      setRoleId(userGroups[0].id);
    }
  }, [userGroups, roleId]);

  const handleSave = () => {
    if (!fullName.trim() || !roleId || !email.trim() || !password.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      alert("Email phải có đuôi là @gmail.com");
      return;
    }
    
    onSave(fullName.trim(), roleId, email.trim(), password, phone.trim());
    
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;   
    const onlyNums = value.replace(/\D/g, "");
    setPhone(onlyNums);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyChars = value.replace(/[0-9]/g, "");
    setFullName(onlyChars);
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg p-6 w-96">
      <h3 className="text-lg py-4 font-bold text-emerald-700">Thêm người dùng mới</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Họ và tên</label>
        <input
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nhóm người dùng</label>
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
        >         
          {userGroups && userGroups.length > 0 ? (
            userGroups.map((group) => {
              if (!group || group.id === undefined) return null;
              return (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              );
            })
          ) : (
            <option value="">Không có nhóm</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
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