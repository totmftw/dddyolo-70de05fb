import React, { createContext } from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import './Sidebar.css';

// Theme Context: provides a way to manage the application's theme (light or dark)
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

// Authentication Context: provides a way to manage the user's authentication status
const AuthContext = createContext({
  isAuthenticated: true,
  logout: () => {}
});

// Sidebar component provides navigation and theme management for the dashboard.
const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>  
            <div className="sidebar-header">
                <h2>YourLogo</h2>
                <button onClick={toggleSidebar} className="close-btn">Toggle</button>
            </div>
            <nav>
                <ul>
                    <li><Link to="/sales-opportunities">Sales Opportunities</Link></li>
                    <li><Link to="/account-management">Account Management</Link></li>
                    <li><Link to="/customers">Customer Management</Link></li>
                    <li><Link to="/inventory">Inventory Management</Link></li>
                    <li><Link to="/payments">Payment Tracking</Link></li>
                    <li><Link to="/roles">User Role Management</Link></li>
                    <li><Link to="/products">Product Management</Link></li>
                    <li><Link to="/products">Product Display</Link></li>
                    <li><Link to="/product-bulk-manage">Product Bulk Manage</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
