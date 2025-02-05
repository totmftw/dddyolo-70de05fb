import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductManagement from '../pages/ProductManagement';

const SalesOpportunityManagement = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [leadName, setLeadName] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        const { data, error } = await supabase
            .from('Opportunities')
            .select('*');
        if (error) console.error('Error fetching opportunities:', error);
        else setOpportunities(data);
    };

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
