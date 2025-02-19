
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Package, AlertTriangle, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/reused/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LowStockItem {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodPiecestock: number;
  prodCategory?: string;
  prodBrand?: string;
  prodRestockDate?: string;
}

const LowStockInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'oos'>('all');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['low-and-oos-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productManagement')
        .select('prodId, prodName, prodSku, prodPiecestock, prodCategory, prodBrand, prodRestockDate')
        .lte('prodPiecestock', 5)
        .order('prodPiecestock');

      if (error) throw error;
      return data as LowStockItem[];
    }
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prodSku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStockFilter = 
      stockFilter === 'all' ? true :
      stockFilter === 'oos' ? item.prodPiecestock === 0 :
      stockFilter === 'low' ? item.prodPiecestock > 0 && item.prodPiecestock <= 5 : true;

    return matchesSearch && matchesStockFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">Low Stock & Out of Stock Items</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Select value={stockFilter} onValueChange={(value: 'all' | 'low' | 'oos') => setStockFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="oos">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Restock Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.prodId}>
                <TableCell>{item.prodSku}</TableCell>
                <TableCell>{item.prodName}</TableCell>
                <TableCell>{item.prodCategory || 'N/A'}</TableCell>
                <TableCell>{item.prodBrand || 'N/A'}</TableCell>
                <TableCell className="text-red-600">
                  {item.prodPiecestock} pieces
                </TableCell>
                <TableCell>
                  {item.prodRestockDate 
                    ? new Date(item.prodRestockDate).toLocaleDateString('en-IN')
                    : 'Not scheduled'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.prodPiecestock === 0 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.prodPiecestock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LowStockInventory;
