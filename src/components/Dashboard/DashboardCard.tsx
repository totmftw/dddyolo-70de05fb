import React from 'react';
import './DashboardCard.css'; // Add styles for the card

const DashboardCard = ({ title, children }) => {
    return (
        <div className="dashboard-card">
            <h3>{title}</h3>
            {children}
        </div>
    );
};

export default DashboardCard;
