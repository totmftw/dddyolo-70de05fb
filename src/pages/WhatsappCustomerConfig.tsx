
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, MessageSquare, Settings } from 'lucide-react';

interface CustomerConfig {
  id: number;
  custBusinessname: string;
  pv_category: string;
  ptr_category: string;
  product_tags: string[];
}

const pvCategories = ['High', 'Medium', 'Low'];
const ptrCategories = ['Good', 'Average', 'Poor'];
const productTags = ['Regular', 'Seasonal', 'Premium', 'Basic'];

const WhatsappCustomerConfig = () => {
  const [search, setSearch] = useState('');
  const [filterPV, setFilterPV] = useState<string>('');
  const [filterPTR, setFilterPTR] = useState<string>('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customer-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customerMaster')
        .select('id, custBusinessname, whatsapp_config:customer_config(pv_category, ptr_category, product_tags)');
      
      if (error) throw error;
      return data;
    }
  });

  const handleUpdateConfig = async (customerId: number, field: string, value: string | string[]) => {
    try {
      const { error } = await supabase
        .from('customer_config')
        .upsert({
          customer_id: customerId,
          [field]: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Customer configuration updated');
    } catch (err) {
      console.error('Error updating config:', err);
      toast.error('Failed to update configuration');
    }
  };

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.custBusinessname.toLowerCase().includes(search.toLowerCase());
    const matchesPV = !filterPV || customer.whatsapp_config?.pv_category === filterPV;
    const matchesPTR = !filterPTR || customer.whatsapp_config?.ptr_category === filterPTR;
    return matchesSearch && matchesPV && matchesPTR;
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <CardTitle>Customer WhatsApp Configuration</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterPV} onValueChange={setFilterPV}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by PV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All PV Categories</SelectItem>
                  {pvCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPTR} onValueChange={setFilterPTR}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by PTR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All PTR Categories</SelectItem>
                  {ptrCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure Rules
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>PV Category</TableHead>
                <TableHead>PTR Category</TableHead>
                <TableHead>Product Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredCustomers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.custBusinessname}</TableCell>
                  <TableCell>
                    <Select
                      value={customer.whatsapp_config?.pv_category || ''}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'pv_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PV Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {pvCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.whatsapp_config?.ptr_category || ''}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'ptr_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PTR Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ptrCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.whatsapp_config?.product_tags?.[0] || ''}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'product_tags', [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTags.map(tag => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsappCustomerConfig;
