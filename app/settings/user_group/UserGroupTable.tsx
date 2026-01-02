"use client";

import React, { useState } from "react";
import type { UserGroup } from "./UserGroupContent";

interface UserGroupTableProps {
  groups: UserGroup[];
  editedGroups: UserGroup[];
  setEditedGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
  checkedRows: boolean[];
  toggleRow: (index: number) => void;
  toggleAll: () => void;
  allChecked: boolean;
}

type EditingCell =
  | { row: number; field: "name" }
  | null;

const UserGroupTable: React.FC<UserGroupTableProps> = ({
  groups,
  editedGroups,
  setEditedGroups,
  checkedRows,
  toggleRow,
  toggleAll,
  allChecked,
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const updateValue = (index: number, value: string) => {
    const newEdited = [...editedGroups];
    if (!newEdited[index]) newEdited[index] = { ...groups[index] };
    newEdited[index].name = value;
    setEditedGroups(newEdited);
  };

  return (
    <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] shadow-sm">
      <table className="min-w-full divide-y divide-[var(--color-border)] table-auto">
        <thead className="bg-[var(--color-muted)]">
          <tr>
            <th className="w-16 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              STT
            </th>
            <th className="w-64 px-4 py-3 text-center text-xs font-semibold text-[var(--color-secondary-foreground)] uppercase">
              Nhóm người dùng
            </th>
            <th className="w-16 text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="h-5 w-5 text-[var(--color-primary)]"
              />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border)]">
          {groups.map((row, index) => {
            const current = editedGroups[index] || row;

            return (
              <tr
                key={row.stt}
                className="hover:bg-[var(--color-muted)] transition-colors"
              >
                {/* STT */}
                <td className="px-4 py-2 text-center text-sm font-medium text-[var(--color-foreground)]">
                  {row.stt}
                </td>

                {/* Nhóm người dùng */}
                <td className="px-4 py-2 text-center text-sm text-[var(--color-foreground)]">
                  {editingCell?.row === index ? (
                    <input
                      autoFocus
                      type="text"
                      value={current.name}
                      onChange={(e) =>
                        updateValue(index, e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingCell(null)
                      }
                      className="w-full border border-[var(--color-border)] rounded-md px-2 py-1 text-sm text-center
                                 bg-[var(--color-card)] focus:outline-none focus:ring-2
                                 focus:ring-[var(--color-primary)]"
                    />
                  ) : (
                    <span
                      onClick={() =>
                        setEditingCell({ row: index, field: "name" })
                      }
                      className="block cursor-pointer rounded-md px-2 py-1
                                 hover:bg-[var(--color-muted)]"
                    >
                      {current.name}
                    </span>
                  )}
                </td>

                {/* Checkbox */}
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={checkedRows[index] ?? false}
                    onChange={() => toggleRow(index)}
                    className="h-5 w-5 text-[var(--color-primary)]"
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

export default UserGroupTable;
