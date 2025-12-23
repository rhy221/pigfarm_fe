"use client";

import React, { useState } from "react";
import UserListTable from "./UserListTable";
import AddNewUserModal from "./AddNewUserModal";

export interface User {
  stt: number;
  username: string;
  group: string;
  email: string;
  password: string;
}

interface UserListContentProps {
  userGroups: string[]; 
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserListContent: React.FC<UserListContentProps> = ({
  userGroups,
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [users, setUsers] = useState<User[]>([
    { stt: 1, username: "admin", group: userGroups[0] || "Admin", email: "admin@example.com", password: "123456" },
  ]);

  const [editedUsers, setEditedUsers] = useState<User[]>([...users]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(users.map(() => true));

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addUser = (username: string, group: string, email: string, password: string) => {
    setUsers([...users, { stt: users.length + 1, username, group, email, password }]);
  };

  const deleteSelected = () => {
    const newUsers = users.filter((_, index) => !checkedRows[index]);
    setUsers(newUsers.map((u, idx) => ({ ...u, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <UserListTable
          users={users}
          editedUsers={editedUsers}
          setEditedUsers={setEditedUsers}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
          userGroups={userGroups}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-96 flex-shrink-0">
          <AddNewUserModal userGroups={userGroups} onClose={() => setIsAdding(false)} onSave={addUser} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">Xác nhận xoá</h3>
            <p className="mb-6 text-center">Bạn có chắc muốn xoá các người dùng được chọn không?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={deleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListContent;
