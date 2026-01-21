// settings/SettingsList.tsx
"use client";

import React from 'react';
import SettingItem from './SettingItem';
import {
  Home,
  Sprout,
  Syringe,
  ShieldAlert,
  Box,
  FlaskConical,
  SprayCan,
  Clock,
  Users,
  UserCog,
  LucideIcon,
  Layers,
  LockKeyhole
} from 'lucide-react';

interface SystemItem {
  title: string;
  icon: LucideIcon;
  isExpandable?: boolean;
  contentTypeKey: string;
}

const systemItems: SystemItem[] = [
  { title: 'Chuồng trại', icon: Home, isExpandable: true, contentTypeKey: 'CHUONG_TRAI' },
  { title: 'Loại chuồng', icon: Layers, isExpandable: true, contentTypeKey: 'LOAI_CHUONG' },
  { title: 'Giống heo', icon: Sprout, isExpandable: true, contentTypeKey: 'GIONG_HEO' },
  { title: 'Vắc xin', icon: Syringe, isExpandable: true, contentTypeKey: 'VAC_XIN' },
  { title: 'Loại bệnh', icon: ShieldAlert, isExpandable: true, contentTypeKey: 'LOAI_BENH' },
  { title: 'Vật tư', icon: Box, isExpandable: true, contentTypeKey: 'VAT_TU' },
  { title: 'Loại hóa chất', icon: FlaskConical, isExpandable: true, contentTypeKey: 'LOAI_HOA_CHAT' },
  { title: 'Hình thức vệ sinh', icon: SprayCan, isExpandable: true, contentTypeKey: 'HINH_THUC_VE_SINH' },
  { title: 'Ca làm', icon: Clock, isExpandable: true, contentTypeKey: 'CA_LAM' },
  { title: 'Nhóm người dùng', icon: UserCog, isExpandable: true, contentTypeKey: 'NHOM_NGUOI_DUNG' },
  { title: 'Người dùng', icon: Users, isExpandable: true, contentTypeKey: 'NGUOI_DUNG' },
  { title: 'Phân quyền truy cập', icon: LockKeyhole, isExpandable: true, contentTypeKey: 'PHAN_QUYEN' },
];

const SettingsList: React.FC = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: '#53A88B' }}>Hệ thống trang trại</h1>
      <div className="space-y-4">
        {systemItems.map((item, index) => (
          <SettingItem
            key={index}
            IconComponent={item.icon}
            title={item.title}
            isExpandable={item.isExpandable || false}
            contentTypeKey={item.contentTypeKey}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsList;
