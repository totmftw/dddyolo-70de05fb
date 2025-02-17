import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Filter, Plus, Upload } from 'lucide-react';
import ThemeToggle from '../components/reused/ThemeToggle';
import CustomerCard from '../components/reused/CustomerCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/reused/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from 'xlsx';

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
    try {
      const { data, error } = await supabase.from('customerMaster').select('*');
      if (error) {
        toast.error('Failed to load customers');
        console.error('Error fetching customers:', error.message || error);
        throw error;
      }
      
      const mappedCustomers: Customer[] = data.map(customer => ({
        id: customer.id,
        businessName: customer.custBusinessname,
        ownerName: customer.custOwnername,
        email: customer.custEmail,
        type: customer.custType,
        status: customer.custStatus,
        phone: customer.custPhone?.toString() || '',
        whatsapp: customer.custWhatsapp?.toString() || '',
        ownerPhone: customer.custOwnerphone?.toString() || '',
        ownerWhatsapp: customer.custOwnerwhatsapp?.toString() || '',
        ownerEmail: customer.custOwneremail || '',
        address: customer.custAddress || '',
        province: customer.custProvince || '',
        city: customer.custCity || '',
        pincode: customer.custPincode?.toString() || '',
        gst: customer.custGST || '',
        remarks: customer.custRemarks || '',
        creditPeriod: customer.custCreditperiod?.toString() || '',
      }));

      setCustomers(mappedCustomers);
      setFilteredCustomers(mappedCustomers);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        toast.error('No file selected');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          for (const row of jsonData) {
            const customerData = {
              custBusinessname: row['Business Name'] || '',
              custOwnername: row['Owner Name'] || '',
              custPhone: row['Phone'] || '',
              custWhatsapp: row['WhatsApp'] || '',
              custOwnerphone: row['Owner Phone'] || '',
              custOwnerwhatsapp: row['Owner WhatsApp'] || '',
              custEmail: row['Email'] || '',
              custOwneremail: row['Owner Email'] || '',
              custType: row['Type'] || '',
              custAddress: row['Address'] || '',
              custProvince: row['Province'] || '',
              custCity: row['City'] || '',
              custPincode: row['Pincode'] || '',
              custGST: row['GST'] || '',
              custRemarks: row['Remarks'] || '',
              custStatus: row['Status'] || 'active',
              custCreditperiod: row['Credit Period'] || '',
            };

            const { error } = await supabase
              .from('customerMaster')
              .insert([customerData]);

            if (error) {
              console.error('Error uploading customer:', error);
              toast.error(`Failed to upload customer: ${row['Business Name']}`);
            }
          }

          toast.success('Customers uploaded successfully');
          fetchCustomers();
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error('Failed to process file');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to handle file');
    }
  };

  const handleFileUpload = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleAddCustomer = async () => {
    const customerData = {
      custBusinessname: formData.businessName,
      custOwnername: formData.ownerName,
      custPhone: parseInt(formData.phone, 10),
      custWhatsapp: parseInt(formData.whatsapp, 10),
      custOwnerphone: parseInt(formData.ownerPhone, 10),
      custOwnerwhatsapp: parseInt(formData.ownerWhatsapp, 10),
      custEmail: formData.email,
      custOwneremail: formData.ownerEmail,
      custType: formData.type,
      custAddress: formData.address,
      custProvince: formData.province,
      custCity: formData.city,
      custPincode: parseInt(formData.pincode, 10),
      custGST: formData.gst,
      custRemarks: formData.remarks,
      custStatus: formData.status || 'active',
      custCreditperiod: parseInt(formData.creditPeriod, 10)
    };

    const { error } = await supabase
      .from('customerMaster')
      .insert([customerData]);

    if (error) {
      toast.error('Failed to add customer');
      console.error('Error adding customer:', error);
    } else {
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
        status: 'active',
        creditPeriod: '',
      });
    }
  };

  const handleUpdateCustomer = async () => {
    const { error } = await supabase
      .from('customerMaster')
      .update({
        custBusinessname: formData.businessName,
        custOwnername: formData.ownerName,
        custPhone: formData.phone,
        custWhatsapp: formData.whatsapp,
        custOwnerphone: formData.ownerPhone,
        custOwnerwhatsapp: formData.ownerWhatsapp,
        custEmail: formData.email,
        custOwneremail: formData.ownerEmail,
        custType: formData.type,
        custAddress: formData.address,
        custProvince: formData.province,
        custCity: formData.city,
        custPincode: formData.pincode,
        custGST: formData.gst,
        custRemarks: formData.remarks,
        custStatus: formData.status,
        custCreditperiod: formData.creditPeriod,
      })
      .eq('id', selectedCustomer?.id);
    if (error) {
      toast.error('Failed to update customer');
      console.error('Error updating customer:', error);
    } else {
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
    <div className="flex flex-col p-4 bg-background dark:bg-gray-800">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Customer Management</h1>
        <ThemeToggle />
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
        <Button
          variant="outline"
          onClick={() => document.getElementById('fileInput')?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Customers
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
          />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {showAddForm && (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? 'Edit Customer' : 'Add Customer'}
              </DialogTitle>
              <DialogDescription>
                Enter customer details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
              className="space-y-4"
            >
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerManagement;
