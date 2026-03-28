import React from 'react';

const Dashboard = () => {
    const currentDate = new Date().toUTCString();

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Daily Stats</h2>
            <p>Date and Time: {currentDate}</p>
            {/* Additional stats can be added here */}
        </div>
    );
};

export default Dashboard;