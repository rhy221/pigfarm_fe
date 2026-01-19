"use client";

import React, { useState, useEffect } from "react";
import UserListTable from "./UserListTable";
import AddNewUserModal from "./AddNewUserModal";

interface UserGroup {
  id: number | bigint;
  name: string;
}

export interface User {
  id: string;
  full_name: string;
  role_id: number | bigint;
  email: string;
  password_hash: string;
  phone: string;
  is_active: boolean;
  user_group?: {
    id: number | bigint;
    name: string;
  };
}

interface UserListContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserListContent: React.FC<UserListContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchData = async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/users/groups`)
      ]);
      const usersData = await usersRes.json();
      const groupsData = await groupsRes.json();
      setUsers(usersData);
      setUserGroups(groupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

  useEffect(() => {
    setCheckedRows(new Array(users.length).fill(false));
  }, [users]);

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

  const addUser = async (full_name: string, role_id: number | bigint, email: string, password_hash: string, phone: string) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name,
          role_id: Number(role_id),
          email,
          password_hash,
          phone,
        }),
      });

      if (response.ok) {
        fetchData();
        if (setIsAdding) setIsAdding(false);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteSelected = async () => {
    const idsToDelete = users
      .filter((_, index) => checkedRows[index])
      .map((u) => u.id);

    try {
      const response = await fetch(`${API_URL}/users/batch`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (response.ok) {
        fetchData();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <UserListTable
          users={users}
          setUsers={setUsers}
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