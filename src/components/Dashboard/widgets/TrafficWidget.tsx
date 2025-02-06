import React, { useState, useEffect } from 'react';
import DashboardCard from '../DashboardCard';

// TrafficWidget component displays traffic-related data on the dashboard.
const TrafficWidget = () => {
    // State to hold traffic data and loading status.
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect hook to fetch traffic data when the component mounts.
    useEffect(() => {
        fetchTrafficData();
    }, []);

    // Function to fetch traffic data from an API or database.
    const fetchTrafficData = async () => {
        // Fetch data logic here
        setLoading(false); // Set loading to false after fetching.
    };

    return (
        <DashboardCard title="Traffic Channels">
            {/* Render traffic data here */}
            <div>Website: 23,564 (98%)</div>
            <div>Amazon: 23,212 (45%)</div>
            <div>Instagram: 23,564 (56%)</div>
            <div>TikTok: 23,564 (43%)</div>
        </DashboardCard>
    );
};

export default TrafficWidget;
