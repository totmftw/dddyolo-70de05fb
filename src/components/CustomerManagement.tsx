import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Filter, Plus, Upload, Download } from 'lucide-react';

interface Customer {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  type: string;
  status: 'active' | 'inactive';
  phone: string;
  whatsapp: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  ownerEmail: string;
  address: string;
  province: string;
  city: string;
  pincode: string;
  gst: string;
  remarks: string;
  creditPeriod: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('CustomerMaster').select('*');
    if (error) toast.error('Failed to load customers');
    else {
      setCustomers(data);
      setFilteredCustomers(data);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterCustomers();
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    filterCustomers();
  };

  const filterCustomers = () => {
    let filtered = customers.filter(customer => 
      customer.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = async () => {
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
    if (error) toast.error('Failed to add customer');
    else {
      toast.success('Customer added successfully');
      setShowAddForm(false);
      fetchCustomers();
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
    }
  };

  const handleUpdateCustomer = async () => {
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
      .eq('id', selectedCustomer?.id);
    if (error) toast.error('Failed to update customer');
    else {
      toast.success('Customer updated successfully');
      setSelectedCustomer(null);
      setShowAddForm(false);
      fetchCustomers();
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    
    if (type === 'number') {
        parsedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
        ...prev,
        [name]: parsedValue
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: checked
    }));
  };

  return (
    <div className="customer-management-container">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="header-actions flex items-center gap-4">
          <button 
            onClick={() => setShowAddForm(true)} 
            className="btn-primary"
          >
            <Plus className="mr-2" /> Add Customer
          </button>
          <button 
            onClick={() => console.log('Implement export logic')}
            className="btn-secondary"
          >
            <Download className="mr-2" /> Export
          </button>
        </div>
      </header>

      {/* Search & Filter Section */}
      <section className="search-filter-section mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border rounded-lg flex-1"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-40 p-3 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            onClick={() => console.log('Implement advanced filter')}
            className="btn-tertiary p-3 rounded-lg"
          >
            <Filter className="text-lg" />
          </button>
        </div>
      </section>

      {/* Customer List Table */}
      <section className="customer-table-section mt-8">
        <div className="table-container">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4">{customer.businessName}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">{customer.type}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full ${
                        customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setFormData({
                          businessName: customer.businessName,
                          ownerName: customer.ownerName,
                          phone: customer.phone,
                          whatsapp: customer.whatsapp,
                          ownerPhone: customer.ownerPhone,
                          ownerWhatsapp: customer.ownerWhatsapp,
                          email: customer.email,
                          ownerEmail: customer.ownerEmail,
                          type: customer.type,
                          address: customer.address,
                          province: customer.province,
                          city: customer.city,
                          pincode: customer.pincode,
                          gst: customer.gst,
                          remarks: customer.remarks,
                          status: customer.status,
                          creditPeriod: customer.creditPeriod,
                        });
                        setShowAddForm(true);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => console.log('Implement delete')}
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Marketing Automation Section */}
      <section className="marketing-section mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Marketing Automation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="campaign-card bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Campaigns</h3>
            <button className="w-full btn-primary mb-4">Create Campaign</button>
            <div className="campaign-list">
              {/* Campaign items */}
            </div>
          </div>
          <div className="ab-test-card bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">A/B Testing</h3>
            <button className="w-full btn-primary mb-4">Run A/B Test</button>
            <div className="test-config">
              {/* Test configuration */}
            </div>
          </div>
        </div>
      </section>

      {/* Add/Edit Customer Modal */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6">
              {selectedCustomer ? 'Edit Customer' : 'Add Customer'}
            </h2>
            <form onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}>
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
              <div className="flex items-center gap-4 mt-6">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                >
                  {selectedCustomer ? 'Update' : 'Add'}
                </button>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
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
                  }} 
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerManagement;
