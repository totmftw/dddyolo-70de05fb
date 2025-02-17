
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
  sku: string;
  quantity: number;
  batch_number: string;
  unit_cost: number;
  added_date: string;
  notes: string;
  status: string;
  shipment_id: string;
}

const InventoryManagement = () => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof InventoryItem>('added_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    sku: '',
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
        .select('*, shipments(shipment_number)')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      return data;
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
    if (!newItem.sku || !newItem.quantity) {
      toast.error('SKU and quantity are required');
      return;
    }

    const { error } = await supabase
      .from('inventory_stock')
      .insert([newItem]);

    if (error) {
      toast.error('Error adding inventory item');
      return;
    }

    toast.success('Inventory item added successfully');
    setNewItem({
      sku: '',
      quantity: 0,
      batch_number: '',
      unit_cost: 0,
      notes: '',
      status: 'active'
    });
    refetch();
  };

  const handleDownloadTemplate = () => {
    // Template download logic here
    toast.success('Template downloaded successfully');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // File upload logic here
      toast.success('File uploaded successfully');
    }
  };

  const filteredInventory = inventory?.filter(item =>
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
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
              {/* Add New Item Form */}
              <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
                <Input
                  placeholder="SKU"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
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

            {/* Inventory Table */}
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('shipment_id')} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Shipment ID
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('sku')} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      SKU
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
                    <TableCell>{item.shipments?.shipment_number || '-'}</TableCell>
                    <TableCell>{item.sku}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
