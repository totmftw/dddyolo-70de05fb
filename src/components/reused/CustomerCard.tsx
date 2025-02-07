import React from 'react';

const CustomerCard = ({ customer }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">{customer.businessName}</h2>
            <p className="text-sm">{customer.email}</p>
            <p className="text-sm">{customer.type}</p>
            <p className="text-sm">{customer.status}</p>
        </div>
    );
};

export default CustomerCard;
