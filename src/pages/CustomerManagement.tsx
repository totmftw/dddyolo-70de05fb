import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Filter, Plus, Upload, Download } from 'lucide-react';
import CustomerForm from '../components/CustomerForm';

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
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['businessName', 'ownerName', 'email', 'phone']);

  const verifyConnection = async () => {
    const { data, error } = await supabase.from('CustomerMaster').select('*').limit(1);
    if (error) {
      console.error('Error fetching sample customer:', error);
      toast.error('Failed to connect to Supabase');
    } else {
      console.log('Sample customer data:', data);
      toast.success('Successfully connected to Supabase!');
    }
  };

  useEffect(() => {
    verifyConnection();
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

  const customerTemplate = [
    {
        id: '',
        businessName: '',
        ownerName: '',
        email: '',
        type: '',
        status: 'active',
        phone: '',
        whatsapp: '',
        ownerPhone: '',
        ownerWhatsapp: '',
        ownerEmail: '',
        address: '',
        province: '',
        city: '',
        pincode: '',
        gst: '',
        remarks: '',
        creditPeriod: '',
    }
  ];

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + customerTemplate.map(e => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customerMasterTemplate.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        await checkForDuplicates(rows);
      };
      reader.readAsText(file);
    }
  };

  const checkForDuplicates = async (rows: string[][]) => {
    const existingCustomers = new Set(customers.map(customer => customer.email)); // Assuming email is unique
    const duplicates = rows.filter(row => existingCustomers.has(row[3])); // Assuming email is in the 4th column

    if (duplicates.length > 0) {
      toast.error('Duplicate entries found!');
    } else {
      await uploadCustomers(rows);
    }
  };

  const uploadCustomers = async (rows: string[][]) => {
    const newCustomers = rows.map(row => ({
      businessname: row[0],
      ownername: row[1],
      phone: row[2],
      email: row[3],
      type: row[4],
      status: row[5],
      whatsapp: row[6],
      ownerphone: row[7],
      ownerwhatsapp: row[8],
      owneremail: row[9],
      address: row[10],
      province: row[11],
      city: row[12],
      pincode: row[13],
      gst: row[14],
      remarks: row[15],
      creditperiod: row[16],
    }));

    const { error } = await supabase.from('CustomerMaster').insert(newCustomers);
    if (error) {
      toast.error('Failed to upload customers');
    } else {
      toast.success('Customers uploaded successfully');
      fetchCustomers(); // Refresh the customer list
    }
  };

  const handleColumnSelection = (column: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddForm(true); // Show the form to edit customer
  };

  return (
    <div>
      <h1>Customer Management</h1>
      <input
        type="text"
        placeholder="Search by invoice ID, name, or phone"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={() => setShowAddForm(true)}>Add Customer</button>
      <div>
        <h2>Select Columns to Display</h2>
        <label>
          <input
            type="checkbox"
            checked={selectedColumns.includes('businessName')}
            onChange={() => handleColumnSelection('businessName')}
          />
          Business Name
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedColumns.includes('ownerName')}
            onChange={() => handleColumnSelection('ownerName')}
          />
          Owner Name
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedColumns.includes('email')}
            onChange={() => handleColumnSelection('email')}
          />
          Email
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedColumns.includes('phone')}
            onChange={() => handleColumnSelection('phone')}
          />
          Phone
        </label>
      </div>
      <table>
        <thead>
          <tr>
            {selectedColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              {selectedColumns.includes('businessName') && <td>{customer.businessName}</td>}
              {selectedColumns.includes('ownerName') && <td>{customer.ownerName}</td>}
              {selectedColumns.includes('email') && <td>{customer.email}</td>}
              {selectedColumns.includes('phone') && <td>{customer.phone}</td>}
              <td>
                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddForm && <CustomerForm customer={selectedCustomer} onClose={() => setShowAddForm(false)} />}
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
              <input 
                type="file" 
                accept="text/csv" 
                onChange={handleFileChange} 
                className="btn btn-upload" 
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
