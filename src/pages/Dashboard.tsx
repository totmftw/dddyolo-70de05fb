import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardCard from '../components/dash/DashboardCard';
import ThemeToggle from '../components/reused/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext'; 

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`flex flex-col gap-4 p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}> 
      <ThemeToggle />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KPI Metrics */}
        <DashboardCard
          title="Net Revenue"
          value="$503,450"
          footer="24% this month"
        />
        <DashboardCard
          title="Total Users"
          value="1,200"
          footer="10% increase"
        />
        <DashboardCard
          title="Sales"
          value="$50,000"
          footer="15% this month"
        />
        <DashboardCard
          title="New Signups"
          value="300"
          footer="5% increase"
        />
        <DashboardCard
          title="Active Subscriptions"
          value="800"
          footer="20% increase"
        />
        <DashboardCard
          title="Average Order Value"
          value="$120"
          footer="5% increase"
        />
      </div>

      <LineChart
        width={500}
        height={300}
        data={[
          { name: 'Apr', uv: 400 },
          { name: 'May', uv: 600 },
          { name: 'Jun', uv: 800 },
          // Add more data
        ]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default Dashboard;
