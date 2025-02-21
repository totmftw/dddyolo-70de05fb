
import React, { useState } from 'react';
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
} from "../components/reused/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/reused/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Settings } from 'lucide-react';

interface CustomerConfig {
  id: number;
  custBusinessname: string;
  customer_config: {
    pv_category: string | null;
    ptr_category: string | null;
    product_tags: string[];
  } | null;
}

const pvCategories = ['High', 'Medium', 'Low'];
const ptrCategories = ['Good', 'Average', 'Poor'];
const productTags = ['Regular', 'Seasonal', 'Premium', 'Basic'];

const WhatsappCustomerConfig = () => {
  const [search, setSearch] = useState('');
  const [filterPV, setFilterPV] = useState<string>('all');  // Changed from empty string to 'all'
  const [filterPTR, setFilterPTR] = useState<string>('all'); // Changed from empty string to 'all'

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customer-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customerMaster')
        .select(`
          id,
          custBusinessname,
          customer_config (
            pv_category,
            ptr_category,
            product_tags
          )
        `);
      
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      return data as CustomerConfig[];
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
    const matchesPV = filterPV === 'all' || customer.customer_config?.pv_category === filterPV; // Updated condition
    const matchesPTR = filterPTR === 'all' || customer.customer_config?.ptr_category === filterPTR; // Updated condition
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
                  <SelectItem value="all">All PV Categories</SelectItem>  {/* Changed from empty string to 'all' */}
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
                  <SelectItem value="all">All PTR Categories</SelectItem>  {/* Changed from empty string to 'all' */}
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
                      value={customer.customer_config?.pv_category || "none"}  {/* Changed from empty string to 'none' */}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'pv_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PV Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Category</SelectItem>  {/* Added a non-empty default value */}
                        {pvCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.customer_config?.ptr_category || "none"}  {/* Changed from empty string to 'none' */}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'ptr_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PTR Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Category</SelectItem>  {/* Added a non-empty default value */}
                        {ptrCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.customer_config?.product_tags?.[0] || "none"}  {/* Changed from empty string to 'none' */}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'product_tags', [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Tag</SelectItem>  {/* Added a non-empty default value */}
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
