import React from 'react';
import SettingsList from './SettingsList';

export const metadata = {
  title: "Quản lý Hệ thống và phân quyền | Hệ thống trang trại",
};

const SettingsPage: React.FC = () => {
  return (
    <div className="flex-1 p-8 min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <SettingsList />
    </div>
  );
};

export default SettingsPage;
