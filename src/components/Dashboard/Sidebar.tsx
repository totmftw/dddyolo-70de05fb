import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/products">Product Management</Link></li>
                <li><Link to="/customers">Customer Management</Link></li>
                <li><Link to="/inventory">Inventory Management</Link></li>
                <li><Link to="/payments">Payment Tracking</Link></li>
                <li><Link to="/roles">User Role Management</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
