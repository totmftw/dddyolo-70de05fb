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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Plus, Filter, ArrowUpDown, Save, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  batch_number: string | null;
  unit_cost: number | null;
  added_date: string | null;
  notes: string | null;
  status: string | null;
  shipment_id: string | null;
  added_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  productManagement?: {
    prodName: string;
    prodId: string;
  } | null;
}

const InventoryManagement = () => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof InventoryItem>('added_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    product_id: '',
    quantity: 0,
    batch_number: '',
    unit_cost: 0,
    notes: '',
    status: 'active'
  });

  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          productManagement:product_id (prodName, prodId)
        `)
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      return data as unknown as InventoryItem[];
    }
  });

  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.product_id || !newItem.quantity) {
      toast.error('Product ID and quantity are required');
      return;
    }

    const { error } = await supabase
      .from('inventory_stock')
      .insert([{
        product_id: newItem.product_id,
        quantity: newItem.quantity,
        batch_number: newItem.batch_number,
        unit_cost: newItem.unit_cost,
        notes: newItem.notes,
        status: 'active'
      }]);

    if (error) {
      toast.error('Error adding inventory item');
      return;
    }

    toast.success('Inventory item added successfully');
    setNewItem({
      product_id: '',
      quantity: 0,
      batch_number: '',
      unit_cost: 0,
      notes: '',
      status: 'active'
    });
    refetch();
  };

  const handleDownloadTemplate = () => {
    console.log('Download template');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload', e.target.files);
  };

  const filteredInventory = inventory?.filter(item =>
    item.productManagement?.prodName.toLowerCase().includes(search.toLowerCase()) ||
    item.batch_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <CardTitle>Inventory Management</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="single">
            <TabsList>
              <TabsTrigger value="single">Single Entry</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-6">
              <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
                <Input
                  placeholder="Product ID"
                  value={newItem.product_id}
                  onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                />
                <Input
                  placeholder="Batch Number"
                  value={newItem.batch_number}
                  onChange={(e) => setNewItem({ ...newItem, batch_number: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Unit Cost"
                  value={newItem.unit_cost}
                  onChange={(e) => setNewItem({ ...newItem, unit_cost: parseFloat(e.target.value) })}
                />
                <Button onClick={handleAddItem} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('product_id')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Product
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Quantity
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead onClick={() => handleSort('unit_cost')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Unit Cost
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('added_date')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Added Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredInventory?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productManagement?.prodName || item.product_id}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.batch_number}</TableCell>
                      <TableCell>${item.unit_cost}</TableCell>
                      <TableCell>{format(new Date(item.added_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{item.notes}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <Button onClick={handleDownloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <label htmlFor="file-upload">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Inventory
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
