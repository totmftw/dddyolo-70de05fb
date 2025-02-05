import React from 'react';
import DashboardCard from '../DashboardCard';

const TrafficWidget = () => {
    return (
        <DashboardCard title="Traffic Channels">
            <div>Website: 23,564 (98%)</div>
            <div>Amazon: 23,212 (45%)</div>
            <div>Instagram: 23,564 (56%)</div>
            <div>TikTok: 23,564 (43%)</div>
        </DashboardCard>
    );
};

export default TrafficWidget;
