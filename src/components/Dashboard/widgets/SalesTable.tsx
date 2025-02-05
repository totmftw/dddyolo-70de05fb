import React from 'react';
import DashboardCard from '../DashboardCard';

const SalesTable = () => {
    const salesData = [
        { item: 'Sony 320GB CFexpress', date: 'Jul 24, 2023', price: '$598.00' },
        { item: 'Sony a7R V Mirrorless', date: 'Jul 24, 2023', price: '$3,898.00' },
        // Add more sales data
    ];

    return (
        <DashboardCard title="Recent Transactions">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Date</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.item}</td>
                            <td>{sale.date}</td>
                            <td>{sale.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DashboardCard>
    );
};

export default SalesTable;
