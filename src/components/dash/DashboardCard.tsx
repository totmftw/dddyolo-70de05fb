import React from 'react';

const DashboardCard = ({ title, value, footer }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{footer}</p>
    </div>
  );
};

export default DashboardCard;
