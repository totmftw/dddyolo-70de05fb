import React from 'react';

export const Card = ({ children }) => {
    return <div className="bg-white shadow-md rounded-lg p-4">{children}</div>;
};

export const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
};

export const CardHeader = ({ children }) => {
    return <div className="border-b pb-2 mb-2">{children}</div>;
};

export const CardTitle = ({ children }) => {
    return <h2 className="text-lg font-bold">{children}</h2>;
};
