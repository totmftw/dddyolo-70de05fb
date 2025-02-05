import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardCard from '../DashboardCard';

const RevenueChart = () => {
    const data = [
        { month: 'Jan', revenue: 1200 },
        { month: 'Feb', revenue: 1500 },
        { month: 'Mar', revenue: 1700 },
        // Add more data points
    ];

    return (
        <DashboardCard title="Annual Revenue">
            <LineChart width={400} height={200} data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
        </DashboardCard>
    );
};

export default RevenueChart;
