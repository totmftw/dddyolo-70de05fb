// SalesOpportunityTracking component tracks sales opportunities over time.
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * SalesOpportunityTracking component is responsible for managing sales opportunities.
 * It fetches opportunities from the database, allows users to add new opportunities,
 * and displays the list of opportunities.
 */
const SalesOpportunityTracking = () => {
    // State variables to store opportunities, lead name, status, and assigned to
    const [opportunities, setOpportunities] = useState([]);
    const [leadName, setLeadName] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    /**
     * useEffect hook is used to fetch opportunities when the component mounts.
     */
    useEffect(() => {
        fetchOpportunities();
    }, []);

    /**
     * fetchOpportunities function fetches opportunities from the database.
     * It uses the supabase client to query the Opportunities table.
     */
    const fetchOpportunities = async () => {
        const { data, error } = await supabase
            .from('Opportunities')
            .select('*');
        if (error) console.error('Error fetching opportunities:', error);
        else setOpportunities(data);
    };

    /**
     * addOpportunity function adds a new opportunity to the database.
     * It uses the supabase client to insert a new record into the Opportunities table.
     */
    const addOpportunity = async () => {
        const { error } = await supabase
            .from('Opportunities')
            .insert([{ lead_name: leadName, status, assigned_to: assignedTo }]);
        if (error) console.error('Error adding opportunity:', error);
        else {
            fetchOpportunities();
            clearFields();
        }
    };

    /**
     * clearFields function clears the input fields after adding a new opportunity.
     */
    const clearFields = () => {
        setLeadName('');
        setStatus('');
        setAssignedTo('');
    };

    return (
        <div>
            <h2>Sales Opportunity Tracking</h2>
            <p>Track your sales opportunities and their progress.</p>
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

export default SalesOpportunityTracking;
