// SalesOpportunityTracking component tracks sales opportunities over time.
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../../context/ThemeContext';

/**
 * SalesOpportunityTracking component is responsible for managing sales opportunities.
 * It fetches opportunities from the database, allows users to add new opportunities,
 * and displays the list of opportunities.
 */
const SalesOpportunityTracking = () => {
    const { theme } = useTheme();
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
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Sales Opportunity Tracking</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Track your sales opportunities and their progress.</p>
            <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Lead Name" className={`p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} />
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" className={`p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} />
            <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assigned To" className={`p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`} />
            <button onClick={addOpportunity} className={`p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>Add Opportunity</button>
            <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Opportunity List</h3>
                <ul>
                    {opportunities.map((opportunity) => (
                        <li key={opportunity.id} className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{opportunity.lead_name} - {opportunity.status}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SalesOpportunityTracking;
