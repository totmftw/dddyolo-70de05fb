import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DashboardCard from '../components/dash/DashboardCard';
import ThemeToggle from '../components/reused/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext'; 
import AdminOneLayout from '../layouts/AdminOneLayout'; // Import the AdminOne layout

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <AdminOneLayout>
      <div className={`flex flex-col p-4 bg-background dark:bg-gray-800`}>
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Dashboard</h1>
          <ThemeToggle />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard title="Net Revenue" />
          <DashboardCard title="Total Users" />
          <DashboardCard title="Active Sessions" />
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
    </AdminOneLayout>
  );
};

export default Dashboard;
