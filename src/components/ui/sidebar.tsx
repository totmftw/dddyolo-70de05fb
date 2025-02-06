import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar w-64 h-screen bg-gray-800 text-white shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">YourLogo</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <Link to="/customer-management">Customer Management</Link>
          </li>
          {/* Add other navigation items */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
