import React from 'react';
import './Sidebar.css'; // Add styles for the sidebar

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
                <li>Dashboard</li>
                <li>Reports</li>
                <li>Settings</li>
            </ul>
        </div>
    );
};

export default Sidebar;
