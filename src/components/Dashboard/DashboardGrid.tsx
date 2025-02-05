import React from 'react';
import { GridLayout } from 'react-grid-layout';
import KPIWidget from './widgets/KPIWidget';
import RevenueChart from './widgets/RevenueChart';
import TrafficWidget from './widgets/TrafficWidget';
import SalesTable from './widgets/SalesTable';
import './DashboardGrid.css'; // Add styles for the grid

const DashboardGrid = () => {
    const layout = [
        { i: 'kpi', x: 0, y: 0, w: 2, h: 1 },
        { i: 'revenue', x: 2, y: 0, w: 4, h: 2 },
        { i: 'traffic', x: 0, y: 1, w: 2, h: 2 },
        { i: 'sales', x: 2, y: 2, w: 4, h: 2 },
    ];

    return (
        <GridLayout className="layout" layout={layout} cols={6} rowHeight={30} width={1200}>
            <div key="kpi"><KPIWidget /></div>
            <div key="revenue"><RevenueChart /></div>
            <div key="traffic"><TrafficWidget /></div>
            <div key="sales"><SalesTable /></div>
        </GridLayout>
    );
};

export default DashboardGrid;
