import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

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
                        <Link to="/product-bulk-manage">Product Bulk Upload</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/product-display">Product Display</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/account-management">Account Management</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/opportunities">Opportunities</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/quotation-order-processing">Quotation Order Processing</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/sales-opportunity-tracking">Sales Opportunity Tracking</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/user-role-management">User Role Management</Link>
                    </li>
                    <li className={`px-4 py-2 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}> 
                        <Link to="/marketing-automation">Marketing Automation</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
