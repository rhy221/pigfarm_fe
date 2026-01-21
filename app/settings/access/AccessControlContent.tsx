"use client";

import React, { useState, useEffect } from "react";
import AccessControlTable, { Permission } from "./AccessControlTable";

interface AccessControlContentProps {
  isAdding: boolean;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SIDEBAR_ITEMS = [
  { name: "Heo & Chuồng", key: "HEO_CHUONG" },
  { name: "Vắc-xin", key: "VAC_XIN" },
  { name: "Heo bệnh", key: "HEO_BENH" },
  { name: "Xuất chuồng", key: "XUAT_CHUONG" },
  { name: "Kho", key: "KHO" },
  { name: "Khẩu phần", key: "KHAU_PHAN" },
  { name: "Vệ sinh", key: "VE_SINH" },
  { name: "Chi phí", key: "CHI_PHI" },
  { name: "Phân công", key: "PHAN_CONG" },
  { name: "Báo cáo", key: "BAO_CAO" },
  { name: "Hệ thống và phân quyền", key: "SETTINGS" },
];

const AccessControlContent: React.FC<AccessControlContentProps> = ({
  isAdding,
  setIsAdding,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/access-control`);
      const data = await res.json();

      const mappedData: Permission[] = data.map((item: any) => ({
        id: item.role_id, 
        roleName: item.user_group?.name || "N/A",
        modules: SIDEBAR_ITEMS.map((sb) => ({
          ...sb,        
          accessible: item.permissions ? !!item.permissions[sb.key] : false,
        })),
      }));

      setPermissions(mappedData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phân quyền:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
    if (isAdding) setIsAdding(false);
  }, [isAdding, setIsAdding]);

  const handleUpdate = async (roleId: string, moduleKey: string, value: boolean) => {
    const originalPermissions = [...permissions];
    setPermissions((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            modules: role.modules.map((m) =>
              m.key === moduleKey ? { ...m, accessible: value } : m
            ),
          };
        }
        return role;
      })
    );

    try {
      const res = await fetch(`${API_URL}/access-control/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleKey,
          value,
        }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
    } catch (error) {
      console.error("Lỗi cập nhật Database:", error);
      alert("Không thể lưu thay đổi. Vui lòng thử lại.");
      setPermissions(originalPermissions); 
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Đang tải dữ liệu phân quyền...</div>;

  return (
    <div className="w-full">
      <AccessControlTable permissions={permissions} onUpdate={handleUpdate} />
    </div>
  );
};

export default AccessControlContent;