import React, { useContext } from 'react';
import { useTheme } from '../../theme/ThemeContext';

const DashboardCard = ({ title, value, footer }) => {
  const { theme } = useTheme(); // Access the theme context

  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}> 
      <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{footer}</p>
    </div>
  );
};

export default DashboardCard;
