import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [newCampaignContent, setNewCampaignContent] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchUserRole();
        fetchCampaigns();
    }, []);

    const fetchCustomers = async () => {
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*');
        if (error) console.error('Error fetching customers:', error);
        else setCustomers(data);
    };

    const fetchUserRole = async () => {
        const session = supabase.auth.session();
        const { data, error } = await supabase
            .from('UserProfiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
        if (error) console.error('Error fetching user role:', error);
        else setUserRole(data.role);
    };

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('Campaigns')
            .select('*');
        if (error) console.error('Error fetching campaigns:', error);
        else setCampaigns(data);
    };

    const addCustomer = async () => {
        const { error } = await supabase
            .from('CustomerMaster')
            .insert([{ name, email, phone, address }]);
        if (error) console.error('Error adding customer:', error);
        else {
            fetchCustomers();
            clearFields();
        }
    };

    const editCustomer = async (id) => {
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error('Error fetching customer:', error);
        else {
            setSelectedCustomerId(id);
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setAddress(data.address);
        }
    };

    const updateCustomer = async () => {
        const { error } = await supabase
            .from('CustomerMaster')
            .update({ name, email, phone, address })
            .eq('id', selectedCustomerId);
        if (error) console.error('Error updating customer:', error);
        else {
            fetchCustomers();
            clearFields();
            setSelectedCustomerId(null);
        }
    };

    const addCampaign = async () => {
        const { error } = await supabase
            .from('Campaigns')
            .insert([{ campaign_name: newCampaignName, content: newCampaignContent }]);
        if (error) console.error('Error adding campaign:', error);
        else {
            fetchCampaigns();
            clearCampaignFields();
        }
    };

    const clearFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
    };

    const clearCampaignFields = () => {
        setNewCampaignName('');
        setNewCampaignContent('');
    };

    return (
        <div>
            <h2>Customer Management</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
            {userRole === 'Admin' ? (
                <button onClick={addCustomer}>Add Customer</button>
            ) : null}
            {selectedCustomerId && userRole === 'Admin' ? (
                <button onClick={updateCustomer}>Update Customer</button>
            ) : null}
            <div>
                <h3>Campaign Management</h3>
                <input type="text" value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} placeholder="Campaign Name" />
                <textarea value={newCampaignContent} onChange={(e) => setNewCampaignContent(e.target.value)} placeholder="Campaign Content" />
                <button onClick={addCampaign}>Add Campaign</button>
                <h4>Existing Campaigns</h4>
                <ul>
                    {campaigns.map((campaign) => (
                        <li key={campaign.id}>{campaign.campaign_name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Customer List</h3>
                <ul>
                    {customers.map((customer) => (
                        <li key={customer.id}>
                            {customer.name} - {customer.email} 
                            {userRole === 'Admin' ? (
                                <button onClick={() => editCustomer(customer.id)}>Edit</button>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomerManagement;
