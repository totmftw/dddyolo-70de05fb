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
    const [abTestContent, setAbTestContent] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [followUps, setFollowUps] = useState([]);

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
        else setCustomers(data || []);
    };

    const fetchUserRole = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data, error } = await supabase
            .from('UserProfiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
        if (error) console.error('Error fetching user role:', error);
        else setUserRole(data?.role || '');
    };

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('Campaigns')
            .select('*');
        if (error) console.error('Error fetching campaigns:', error);
        else setCampaigns(data || []);
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

    const runABTest = async () => {
        // Implement A/B testing logic
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*');
        if (error) console.error('Error fetching customers for A/B test:', error);
        else {
            const testGroup = data.filter(customer => customer.id % 2 === 0);
            const controlGroup = data.filter(customer => customer.id % 2 !== 0);
            // Send campaign to test group
            await sendCampaign(testGroup, newCampaignName, newCampaignContent);
            // Send A/B test content to control group
            await sendCampaign(controlGroup, 'A/B Test', abTestContent);
        }
    };

    const filterCustomers = async () => {
        // Implement customer filtering logic
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*')
            .ilike('name', `%${filterCriteria}%`);
        if (error) console.error('Error filtering customers:', error);
        else setFilteredCustomers(data);
    };

    const setupFollowUps = async () => {
        // Implement automated follow-ups logic
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*');
        if (error) console.error('Error fetching customers for follow-ups:', error);
        else {
            const followUpCustomers = data.filter(customer => customer.id % 2 === 0);
            // Send follow-up campaign to customers
            await sendCampaign(followUpCustomers, 'Follow-up', 'This is a follow-up campaign.');
            setFollowUps(followUpCustomers);
        }
    };

    const sendCampaign = async (customers, campaignName, campaignContent) => {
        // Implement campaign sending logic
        customers.forEach(customer => {
            // Send campaign to customer
            console.log(`Sending campaign to ${customer.name}: ${campaignName} - ${campaignContent}`);
        });
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
                <h3>Marketing Automation</h3>
                <h4>Campaign Management</h4>
                <input type="text" value={newCampaignName} onChange={(e) => setNewCampaignName(e.target.value)} placeholder="Campaign Name" />
                <textarea value={newCampaignContent} onChange={(e) => setNewCampaignContent(e.target.value)} placeholder="Campaign Content" />
                <button onClick={addCampaign}>Schedule Campaign</button>
                <h4>A/B Testing</h4>
                <input type="text" value={abTestContent} onChange={(e) => setAbTestContent(e.target.value)} placeholder="A/B Test Content" />
                <button onClick={runABTest}>Run A/B Test</button>
            </div>
            <div>
                <h3>Segmentation & Targeting</h3>
                <input type="text" value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value)} placeholder="Filter by behavior, demographics, etc." />
                <button onClick={filterCustomers}>Filter Customers</button>
                <ul>
                    {filteredCustomers.map((customer) => (
                        <li key={customer.id}>{customer.name} - {customer.email}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Lead Nurturing</h3>
                <button onClick={setupFollowUps}>Setup Automated Follow-Ups</button>
                <ul>
                    {followUps.map((customer) => (
                        <li key={customer.id}>{customer.name} - {customer.email}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Campaign Management</h3>
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
