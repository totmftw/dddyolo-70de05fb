
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
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
import { Package, Plus, Filter, ArrowUpDown, Save } from 'lucide-react';
import { format } from 'date-fns';

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  batch_number: string;
  unit_cost: number;
  added_date: string;
  notes: string;
  status: string;
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
    notes: ''
  });

  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select('*')
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
    if (!newItem.product_id || !newItem.quantity) {
      toast.error('Product ID and quantity are required');
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
      product_id: '',
      quantity: 0,
      batch_number: '',
      unit_cost: 0,
      notes: ''
    });
    refetch();
  };

  const filteredInventory = inventory?.filter(item =>
    item.product_id.toLowerCase().includes(search.toLowerCase()) ||
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
          <div className="space-y-6">
            {/* Add New Item Form */}
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

            {/* Inventory Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('product_id')} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Product ID
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
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredInventory?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_id}</TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
