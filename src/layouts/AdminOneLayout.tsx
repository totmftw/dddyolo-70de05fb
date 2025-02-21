
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedSidebar from '../components/UnifiedSidebar';

const AdminOneLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <UnifiedSidebar />
      <div className="flex-1 h-full overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminOneLayout;
