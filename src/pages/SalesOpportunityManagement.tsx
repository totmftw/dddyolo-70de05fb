import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductManagement from '../pages/ProductManagement';

// SalesOpportunityManagement component manages the sales opportunities for the application.
const SalesOpportunityManagement = () => {
    // State to hold the list of opportunities and form inputs.
    const [opportunities, setOpportunities] = useState([]);
    const [leadName, setLeadName] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    // useEffect hook to fetch opportunities when the component mounts.
    useEffect(() => {
        fetchOpportunities();
    }, []);

    // Function to fetch opportunities from Supabase.
    const fetchOpportunities = async () => {
        const { data, error } = await supabase
            .from('Opportunities')
            .select('*');
        if (error) console.error('Error fetching opportunities:', error);
        else setOpportunities(data);
    };

    // Function to add a new opportunity to Supabase.
    const addOpportunity = async () => {
        const { error } = await supabase
            .from('Opportunities')
            .insert([{ lead_name: leadName, status, assigned_to: assignedTo }]);
        if (error) console.error('Error adding opportunity:', error);
        else {
            fetchOpportunities(); // Refresh the list after adding.
            clearFields(); // Clear form fields after adding.
        }
    };

    // Function to clear form fields.
    const clearFields = () => {
        setLeadName('');
        setStatus('');
        setAssignedTo('');
    };

    return (
        <div>
            <h2>Sales Opportunity Management</h2>
            <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Lead Name" />
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
            <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assigned To" />
            <button onClick={addOpportunity}>Add Opportunity</button>
            <div>
                <h3>Opportunity List</h3>
                <ul>
                    {opportunities.map((opportunity) => (
                        <li key={opportunity.id}>{opportunity.lead_name} - {opportunity.status}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SalesOpportunityManagement;
