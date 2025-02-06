import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; 

const Sidebar = () => {
  const { theme } = useTheme(); 

  return (
    <div className={`sidebar w-64 h-screen ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} text-${theme === 'dark' ? 'white' : 'black'} shadow-lg`}> 
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}> 
        <h1 className="text-2xl font-bold">YourLogo</h1>
      </div>
      <nav className="mt-4">
        <ul>
          <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
            <Link to="/customer-management">Customer Management</Link>
          </li>
          <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
            <Link to="/product-bulk-upload">Product Bulk Upload</Link>
          </li>
          <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
            <Link to="/product-display">Product Display</Link>
          </li>
          {/* Add other navigation items */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
