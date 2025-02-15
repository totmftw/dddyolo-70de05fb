
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedSidebar from '../components/UnifiedSidebar';

const AdminOneLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <UnifiedSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminOneLayout;
