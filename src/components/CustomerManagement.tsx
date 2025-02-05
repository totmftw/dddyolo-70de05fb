import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [custBusinessname, setCustBusinessname] = useState('');
    const [custOwnername, setCustOwnername] = useState('');
    const [custPhone, setCustPhone] = useState('');
    const [custWhatsapp, setCustWhatsapp] = useState('');
    const [custOwnerphone, setCustOwnerphone] = useState('');
    const [custOwnerwhatsapp, setCustOwnerwhatsapp] = useState('');
    const [custEmail, setCustEmail] = useState('');
    const [custOwneremail, setCustOwneremail] = useState('');
    const [custType, setCustType] = useState('');
    const [custAddress, setCustAddress] = useState('');
    const [custProvince, setCustProvince] = useState('');
    const [custCity, setCustCity] = useState('');
    const [custPincode, setCustPincode] = useState('');
    const [custGST, setCustGST] = useState('');
    const [custRemarks, setCustRemarks] = useState('');
    const [custStatus, setCustStatus] = useState('');
    const [custCreditperiod, setCustCreditperiod] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [newCampaignContent, setNewCampaignContent] = useState('');
    const [abTestContent, setAbTestContent] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

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
            .insert([
                {
                    businessname: custBusinessname,
                    ownername: custOwnername,
                    phone: custPhone,
                    whatsapp: custWhatsapp,
                    ownerphone: custOwnerphone,
                    ownerwhatsapp: custOwnerwhatsapp,
                    email: custEmail,
                    owneremail: custOwneremail,
                    type: custType,
                    address: custAddress,
                    province: custProvince,
                    city: custCity,
                    pincode: custPincode,
                    gst: custGST,
                    remarks: custRemarks,
                    status: custStatus,
                    creditperiod: custCreditperiod,
                },
            ]);
        if (error) console.error('Error adding customer:', error);
        else {
            fetchCustomers();
            clearFields();
            setShowAddCustomerForm(false);
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
            setCustBusinessname(data.businessname);
            setCustOwnername(data.ownername);
            setCustPhone(data.phone);
            setCustWhatsapp(data.whatsapp);
            setCustOwnerphone(data.ownerphone);
            setCustOwnerwhatsapp(data.ownerwhatsapp);
            setCustEmail(data.email);
            setCustOwneremail(data.owneremail);
            setCustType(data.type);
            setCustAddress(data.address);
            setCustProvince(data.province);
            setCustCity(data.city);
            setCustPincode(data.pincode);
            setCustGST(data.gst);
            setCustRemarks(data.remarks);
            setCustStatus(data.status);
            setCustCreditperiod(data.creditperiod);
        }
    };

    const updateCustomer = async () => {
        const { error } = await supabase
            .from('CustomerMaster')
            .update({
                businessname: custBusinessname,
                ownername: custOwnername,
                phone: custPhone,
                whatsapp: custWhatsapp,
                ownerphone: custOwnerphone,
                ownerwhatsapp: custOwnerwhatsapp,
                email: custEmail,
                owneremail: custOwneremail,
                type: custType,
                address: custAddress,
                province: custProvince,
                city: custCity,
                pincode: custPincode,
                gst: custGST,
                remarks: custRemarks,
                status: custStatus,
                creditperiod: custCreditperiod,
            })
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
        setCustBusinessname('');
        setCustOwnername('');
        setCustPhone('');
        setCustWhatsapp('');
        setCustOwnerphone('');
        setCustOwnerwhatsapp('');
        setCustEmail('');
        setCustOwneremail('');
        setCustType('');
        setCustAddress('');
        setCustProvince('');
        setCustCity('');
        setCustPincode('');
        setCustGST('');
        setCustRemarks('');
        setCustStatus('');
        setCustCreditperiod('');
    };

    const clearCampaignFields = () => {
        setNewCampaignName('');
        setNewCampaignContent('');
    };

    const downloadTemplate = () => {
        const templateData = [
            ["Business Name", "Owner Name", "Phone", "WhatsApp", "Owner Phone", "Owner WhatsApp", "Email", "Owner Email", "Customer Type", "Address", "Province", "City", "Pincode", "GST", "Remarks", "Status", "Credit Period"],
            // Add empty rows for user to fill in
        ];
        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customer Template");
        XLSX.writeFile(wb, "customer_template.xlsx");
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Fetch existing customers from the database
        const { data: existingCustomers, error: fetchError } = await supabase
            .from('CustomerMaster')
            .select('*');
        if (fetchError) {
            console.error('Error fetching existing customers:', fetchError);
            return;
        }

        const existingCustomerEmails = new Set(existingCustomers.map(customer => customer.email));
        const existingCustomerNames = new Set(existingCustomers.map(customer => customer.name));

        const duplicates = jsonData.filter(customer => 
            existingCustomerEmails.has(customer.Email) || existingCustomerNames.has(customer.OwnerName)
        );

        if (duplicates.length > 0) {
            alert(`The following customers already exist in the database:\n${duplicates.map(c => c.OwnerName).join(', ')}`);
        }

        // Insert new customers into the database
        const newCustomers = jsonData.filter(customer => 
            !existingCustomerEmails.has(customer.Email) && !existingCustomerNames.has(customer.OwnerName)
        );

        for (const customer of newCustomers) {
            const { error: insertError } = await supabase
                .from('CustomerMaster')
                .insert([{ 
                    businessname: customer.BusinessName,
                    ownername: customer.OwnerName,
                    phone: customer.Phone,
                    whatsapp: customer.WhatsApp,
                    ownerphone: customer.OwnerPhone,
                    ownerwhatsapp: customer.OwnerWhatsApp,
                    email: customer.Email,
                    owneremail: customer.OwnerEmail,
                    type: customer.CustomerType,
                    address: customer.Address,
                    province: customer.Province,
                    city: customer.City,
                    pincode: customer.Pincode,
                    gst: customer.GST,
                    remarks: customer.Remarks,
                    status: customer.Status,
                    creditperiod: customer.CreditPeriod,
                }]);
            if (insertError) {
                console.error('Error inserting new customer:', insertError);
            }
        }
    };

    return (
        <div>
            <h2>Customer Management</h2>
            {userRole === 'Admin' ? (
                <button onClick={() => setShowAddCustomerForm(true)}>Add Customer</button>
            ) : null}
            {showAddCustomerForm && (
                <div className="customer-form">
                    <h3>Add Customer</h3>
                    <input type="text" value={custBusinessname} onChange={(e) => setCustBusinessname(e.target.value)} placeholder="Business Name" required />
                    <input type="text" value={custOwnername} onChange={(e) => setCustOwnername(e.target.value)} placeholder="Owner Name" required />
                    <input type="tel" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} placeholder="Phone" required />
                    <input type="tel" value={custWhatsapp} onChange={(e) => setCustWhatsapp(e.target.value)} placeholder="WhatsApp" required />
                    <input type="tel" value={custOwnerphone} onChange={(e) => setCustOwnerphone(e.target.value)} placeholder="Owner Phone" required />
                    <input type="tel" value={custOwnerwhatsapp} onChange={(e) => setCustOwnerwhatsapp(e.target.value)} placeholder="Owner WhatsApp" required />
                    <input type="email" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} placeholder="Email" required />
                    <input type="text" value={custOwneremail} onChange={(e) => setCustOwneremail(e.target.value)} placeholder="Owner Email" required />
                    <input type="text" value={custType} onChange={(e) => setCustType(e.target.value)} placeholder="Customer Type" required />
                    <input type="text" value={custAddress} onChange={(e) => setCustAddress(e.target.value)} placeholder="Address" required />
                    <input type="text" value={custProvince} onChange={(e) => setCustProvince(e.target.value)} placeholder="Province" required />
                    <input type="text" value={custCity} onChange={(e) => setCustCity(e.target.value)} placeholder="City" required />
                    <input type="tel" value={custPincode} onChange={(e) => setCustPincode(e.target.value)} placeholder="Pincode" required />
                    <input type="text" value={custGST} onChange={(e) => setCustGST(e.target.value)} placeholder="GST" />
                    <textarea value={custRemarks} onChange={(e) => setCustRemarks(e.target.value)} placeholder="Remarks"></textarea>
                    <select value={custStatus} onChange={(e) => setCustStatus(e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <input type="number" value={custCreditperiod} onChange={(e) => setCustCreditperiod(e.target.value)} placeholder="Credit Period" />
                    <button onClick={addCustomer}>Submit</button>
                    <button onClick={() => setShowAddCustomerForm(false)}>Cancel</button>
                </div>
            )}
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
                            {customer.businessname} - {customer.email} 
                            {userRole === 'Admin' ? (
                                <button onClick={() => editCustomer(customer.id)}>Edit</button>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Import Customers</h3>
                <button onClick={downloadTemplate}>Download Excel Template</button>
                <input type="file" accept=".xlsx" onChange={handleFileUpload} />
            </div>
        </div>
    );
};

export default CustomerManagement;
