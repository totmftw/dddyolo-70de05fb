import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

interface CustomerExcelData {
    BusinessName: string;
    OwnerName: string;
    Phone: string;
    WhatsApp: string;
    OwnerPhone: string;
    OwnerWhatsApp: string;
    Email: string;
    OwnerEmail: string;
    CustomerType: string;
    Address: string;
    Province: string;
    City: string;
    Pincode: string;
    GST: string;
    Remarks: string;
    Status: string;
    CreditPeriod: string;
}

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        phone: '',
        whatsapp: '',
        ownerPhone: '',
        ownerWhatsapp: '',
        email: '',
        ownerEmail: '',
        type: '',
        address: '',
        province: '',
        city: '',
        pincode: '',
        gst: '',
        remarks: '',
        status: '',
        creditPeriod: '',
    });
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState({ name: '', content: '' });
    const [abTest, setAbTest] = useState({ content: '' });
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
            .insert([
                {
                    businessname: formData.businessName,
                    ownername: formData.ownerName,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    ownerphone: formData.ownerPhone,
                    ownerwhatsapp: formData.ownerWhatsapp,
                    email: formData.email,
                    owneremail: formData.ownerEmail,
                    type: formData.type,
                    address: formData.address,
                    province: formData.province,
                    city: formData.city,
                    pincode: formData.pincode,
                    gst: formData.gst,
                    remarks: formData.remarks,
                    status: formData.status,
                    creditperiod: formData.creditPeriod,
                },
            ]);
        if (error) console.error('Error adding customer:', error);
        else {
            fetchCustomers();
            resetFormData();
            setShowAddForm(false);
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
            setFormData({
                businessName: data.businessname,
                ownerName: data.ownername,
                phone: data.phone,
                whatsapp: data.whatsapp,
                ownerPhone: data.ownerphone,
                ownerWhatsapp: data.ownerwhatsapp,
                email: data.email,
                ownerEmail: data.owneremail,
                type: data.type,
                address: data.address,
                province: data.province,
                city: data.city,
                pincode: data.pincode,
                gst: data.gst,
                remarks: data.remarks,
                status: data.status,
                creditPeriod: data.creditperiod,
            });
            setShowEditForm(true);
        }
    };

    const updateCustomer = async () => {
        const { error } = await supabase
            .from('CustomerMaster')
            .update({
                businessname: formData.businessName,
                ownername: formData.ownerName,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                ownerphone: formData.ownerPhone,
                ownerwhatsapp: formData.ownerWhatsapp,
                email: formData.email,
                owneremail: formData.ownerEmail,
                type: formData.type,
                address: formData.address,
                province: formData.province,
                city: formData.city,
                pincode: formData.pincode,
                gst: formData.gst,
                remarks: formData.remarks,
                status: formData.status,
                creditperiod: formData.creditPeriod,
            })
            .eq('id', selectedCustomerId);
        if (error) console.error('Error updating customer:', error);
        else {
            fetchCustomers();
            resetFormData();
            setShowEditForm(false);
        }
    };

    const addCampaign = async () => {
        const { error } = await supabase
            .from('Campaigns')
            .insert([{ campaign_name: newCampaign.name, content: newCampaign.content }]);
        if (error) console.error('Error adding campaign:', error);
        else {
            fetchCampaigns();
            setNewCampaign({ name: '', content: '' });
        }
    };

    const runABTest = async () => {
        const { data, error } = await supabase
            .from('CustomerMaster')
            .select('*');
        if (error) console.error('Error fetching customers for A/B test:', error);
        else {
            const testGroup = data.filter(customer => customer.id % 2 === 0);
            const controlGroup = data.filter(customer => customer.id % 2 !== 0);
            await sendCampaign(testGroup, newCampaign.name, newCampaign.content);
            await sendCampaign(controlGroup, 'A/B Test', abTest.content);
        }
    };

    const sendCampaign = async (customers, campaignName, campaignContent) => {
        customers.forEach(customer => {
            console.log(`Sending campaign to ${customer.name}: ${campaignName} - ${campaignContent}`);
        });
    };

    const handleFilter = (filterCriteria) => {
        const filteredCustomers = customers.filter(customer =>
            customer.businessname.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            customer.ownername.toLowerCase().includes(filterCriteria.toLowerCase()) ||
            customer.email.toLowerCase().includes(filterCriteria.toLowerCase())
        );
        setFilteredCustomers(filteredCustomers);
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const resetFormData = () => {
        setFormData({
            businessName: '',
            ownerName: '',
            phone: '',
            whatsapp: '',
            ownerPhone: '',
            ownerWhatsapp: '',
            email: '',
            ownerEmail: '',
            type: '',
            address: '',
            province: '',
            city: '',
            pincode: '',
            gst: '',
            remarks: '',
            status: '',
            creditPeriod: '',
        });
    };

    const downloadTemplate = () => {
        const templateData = [
            ["Business Name", "Owner Name", "Phone", "WhatsApp", "Owner Phone", "Owner WhatsApp", "Email", "Owner Email", "Customer Type", "Address", "Province", "City", "Pincode", "GST", "Remarks", "Status", "Credit Period"],
        ];
        const ws = XLSX.utils.aoa_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customer Template");
        XLSX.writeFile(wb, "customer_template.xlsx");
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as CustomerExcelData[];

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
        <div className="customer-management">
            <h2>Customer Management</h2>

            {/* SECTION: CUSTOMER LIST */}
            <section>
                <h3>Customer Directory</h3>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filter customers..."
                        onChange={(e) => handleFilter(e.target.value)}
                    />
                    <button onClick={() => setShowAddForm(true)}>Add Customer</button>
                </div>

                {/* Customer Table */}
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.businessname}</td>
                                <td>{customer.email}</td>
                                <td>{customer.type}</td>
                                <td>{customer.status}</td>
                                <td>
                                    <button onClick={() => editCustomer(customer.id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* SECTION: ADD/EDIT FORM (Modal or Collapsible Section) */}
            {(showAddForm || showEditForm) && (
                <div className="form-container">
                    <form onSubmit={showEditForm ? updateCustomer : addCustomer}>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="Business Name"
                            required
                        />
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            placeholder="Owner Name"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            required
                        />
                        <input
                            type="tel"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            placeholder="WhatsApp"
                            required
                        />
                        <input
                            type="tel"
                            name="ownerPhone"
                            value={formData.ownerPhone}
                            onChange={handleInputChange}
                            placeholder="Owner Phone"
                            required
                        />
                        <input
                            type="tel"
                            name="ownerWhatsapp"
                            value={formData.ownerWhatsapp}
                            onChange={handleInputChange}
                            placeholder="Owner WhatsApp"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="ownerEmail"
                            value={formData.ownerEmail}
                            onChange={handleInputChange}
                            placeholder="Owner Email"
                            required
                        />
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            placeholder="Customer Type"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                            required
                        />
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            placeholder="Province"
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            required
                        />
                        <input
                            type="tel"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Pincode"
                            required
                        />
                        <input
                            type="text"
                            name="gst"
                            value={formData.gst}
                            onChange={handleInputChange}
                            placeholder="GST"
                        />
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            placeholder="Remarks"
                        />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <input
                            type="number"
                            name="creditPeriod"
                            value={formData.creditPeriod}
                            onChange={handleInputChange}
                            placeholder="Credit Period"
                        />
                        <button type="submit">
                            {showEditForm ? 'Update Customer' : 'Add Customer'}
                        </button>
                        <button onClick={() => {
                            setShowAddForm(false);
                            setShowEditForm(false);
                            resetFormData();
                        }}>Cancel</button>
                    </form>
                </div>
            )}

            {/* SECTION: MARKETING AUTOMATION */}
            <section>
                <h3>Marketing Automation</h3>
                {/* CAMPAIGN CREATION */}
                <div>
                    <input
                        type="text"
                        placeholder="Campaign Name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    />
                    <textarea
                        placeholder="Campaign Content"
                        value={newCampaign.content}
                        onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                    />
                    <button onClick={addCampaign}>Create Campaign</button>
                </div>

                {/* A/B TEST SECTION */}
                <div>
                    <input
                        type="text"
                        placeholder="A/B Test Content"
                        value={abTest.content}
                        onChange={(e) => setAbTest({ ...abTest, content: e.target.value })}
                    />
                    <button onClick={runABTest}>Run A/B Test</button>
                </div>
            </section>

            {/* SECTION: SEGMENTATION */}
            <section>
                <h3>Customer Segmentation</h3>
                <div>
                    <button onClick={() => handleFilter('')}>Segment Customers</button>
                </div>
            </section>

            {/* SECTION: BULK MANAGEMENT */}
            <section>
                <h3>Import/Export</h3>
                <div>
                    <button onClick={downloadTemplate}>Download Template</button>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileUpload}
                    />
                </div>
            </section>
        </div>
    );
};

export default CustomerManagement;
