import React from 'react';
import DashboardCard from '../DashboardCard';

const KPIWidget = () => {
    return (
        <DashboardCard title="Key Performance Indicators">
            <div>Net Revenue: $503,450</div>
            <div>Day Sales: $3,090</div>
            <div>Weekly Sales: $43,740</div>
            <div>Monthly Purchases: $15,230</div>
        </DashboardCard>
    );
};

export default KPIWidget;
