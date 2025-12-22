import React from 'react';
import SettingsList from './SettingsList';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-white min-h-screen text-gray-900"> 
        <SettingsList />
    </div>
  );
};

export default SettingsPage;