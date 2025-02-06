import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';

interface CustomerFormProps {
  customer: any;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onClose }) => {
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
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('CustomerMaster')
      .upsert([formData]);
    if (error) {
      toast.error('Failed to save customer data');
    } else {
      toast.success('Customer data saved successfully');
      onClose();
    }
  };

  return (
    <div className="modal">
      <h2>{customer ? 'Edit Customer' : 'Add Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Business Name" required />
        <input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default CustomerForm;
