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
  const [checkedRows, setCheckedRows] = useState<boolean[]>(users.map(() => false));

  const hasSelected = checkedRows.some((val) => val === true);
  const allChecked = users.length > 0 && checkedRows.every(Boolean);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setCheckedRows(users.map(() => nextValue));
  };

  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addUser = (username: string, group: string, email: string, password: string) => {
    const newUser = { stt: users.length + 1, username, group, email, password };
    setUsers([...users, newUser]);
    setCheckedRows([...checkedRows, false]);
  };

  const deleteSelected = () => {
    const newUsers = users.filter((_, index) => !checkedRows[index]);
    setUsers(newUsers.map((u, idx) => ({ ...u, stt: idx + 1 })));
    setCheckedRows(newUsers.map(() => false));
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-in zoom-in duration-200 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
              {hasSelected ? "Xác nhận xoá" : "Thông báo"}
            </h3>
            
            <p className="mb-6 text-center text-gray-600">
              {hasSelected 
                ? "Bạn có chắc muốn xoá các người dùng được chọn không?" 
                : "Vui lòng chọn người dùng từ danh sách để thực hiện thao tác xoá."}
            </p>

            <div className="flex justify-center gap-3">
              {hasSelected ? (
                <>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Xác nhận
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-8 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium shadow-sm"
                >
                  Đã hiểu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListContent;