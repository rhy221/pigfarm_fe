"use client";

import React from "react";

export interface Permission {
  id: string;
  roleName: string;
  modules: {
    name: string;
    key: string;
    accessible: boolean;
  }[];
}

interface AccessControlTableProps {
  permissions: Permission[];
  onUpdate: (roleId: string, moduleKey: string, value: boolean) => Promise<void>;
}

const AccessControlTable: React.FC<AccessControlTableProps> = ({ permissions, onUpdate }) => {
  return (
    <div className="overflow-x-auto border border-emerald-100 rounded-lg bg-white shadow-sm max-w-5xl mx-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr className="divide-x divide-emerald-100">
            <th className="w-[60px] px-4 py-3 text-center font-semibold uppercase">STT</th>
            <th className="w-[200px] px-4 py-3 text-center font-semibold">Nhóm người dùng</th>
            <th className="px-4 py-3 text-center font-semibold">Mục Menu (Sidebar)</th>
            <th className="w-[120px] px-4 py-3 text-center font-semibold">Quyền được truy cập</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          {permissions.map((role, rIdx) => (
            <React.Fragment key={role.id}>
              {role.modules.map((module, mIdx) => (
                <tr key={`${role.id}-${module.key}`} className="hover:bg-gray-100 divide-x divide-emerald-50 transition-colors">
                  {mIdx === 0 && (
                    <>
                      <td rowSpan={role.modules.length} className="px-4 py-4 text-center font-medium text-gray-600 bg-emerald-50/10 align-top border-b border-emerald-100">
                        {rIdx + 1}
                      </td>
                      <td rowSpan={role.modules.length} className="px-4 py-4 font-bold text-emerald-800 bg-emerald-50/20 align-top border-b border-emerald-100">
                        {role.roleName}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {module.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={module.accessible}
                      onChange={(e) => onUpdate(role.id, module.key, e.target.checked)}
                      className="h-5 w-5 text-emerald-600 cursor-pointer rounded border-gray-300 focus:ring-emerald-500"
                    />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessControlTable;