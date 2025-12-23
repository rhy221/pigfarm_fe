"use client";

import React, { useState } from "react";
import UserGroupTable from "./UserGroupTable";
import AddNewUserGroupModal from "./AddNewUserGroupModal";

export interface UserGroup {
  stt: number;
  name: string;
}

interface UserGroupContentProps {
  isAdding?: boolean;
  setIsAdding?: (status: boolean) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserGroupContent: React.FC<UserGroupContentProps> = ({
  isAdding = false,
  setIsAdding,
  showDeleteConfirm,
  setShowDeleteConfirm,
}) => {
  const [groups, setGroups] = useState<UserGroup[]>([
    { stt: 1, name: "Admin" },
    { stt: 2, name: "User" },
    { stt: 3, name: "Guest" },
  ]);

  const [editedGroups, setEditedGroups] = useState<UserGroup[]>([...groups]);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(groups.map(() => true));

  const allChecked = checkedRows.every(Boolean);

  const toggleAll = () => setCheckedRows(checkedRows.map(() => !allChecked));
  const toggleRow = (index: number) => {
    const newChecked = [...checkedRows];
    newChecked[index] = !newChecked[index];
    setCheckedRows(newChecked);
  };

  const addGroup = (name: string) => {
    setGroups([...groups, { stt: groups.length + 1, name }]);
  };

  const deleteSelected = () => {
    const newGroups = groups.filter((_, index) => !checkedRows[index]);
    setGroups(newGroups.map((g, idx) => ({ ...g, stt: idx + 1 })));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex gap-6 items-start relative">
      <div className="flex-1 min-w-0">
        <UserGroupTable
          groups={groups}
          editedGroups={editedGroups}
          setEditedGroups={setEditedGroups}
          checkedRows={checkedRows}
          toggleRow={toggleRow}
          toggleAll={toggleAll}
          allChecked={allChecked}
        />
      </div>

      {isAdding && setIsAdding && (
        <div className="w-80 flex-shrink-0">
          <AddNewUserGroupModal onClose={() => setIsAdding(false)} onSave={addGroup} />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Xác nhận xoá</h3>
            <p className="mb-6 text-center">Bạn có chắc muốn xoá các nhóm người dùng được chọn không?</p>
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

export default UserGroupContent;
