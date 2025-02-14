
import React from 'react';
import UnifiedSidebar from '../components/UnifiedSidebar';

interface AdminOneLayoutProps {
  children: React.ReactNode;
}

const AdminOneLayout = ({ children }: AdminOneLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <UnifiedSidebar />
      <div className="flex-1 p-8 ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminOneLayout;
