import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import DashboardCard from '../components/dash/DashboardCard';
import ThemeToggle from '../components/reused/ThemeToggle';
import { useTheme } from '../theme/ThemeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/reused/table";
import { Input } from "@/components/ui/input";
import { Package, Search, AlertTriangle } from 'lucide-react';

interface InventoryChange {
  id: string;
  product_id: string;
  quantity: number;
  added_date: string;
  productManagement: {
    prodName: string;
    prodSku: string;
  } | null;
}

interface LowStockItem {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodPiecestock: number;
}

const Dashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: recentChanges = [] } = useQuery({
    queryKey: ['recent-inventory-changes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          id,
          product_id,
          quantity,
          added_date,
          productManagement (
            prodName,
            prodSku
          )
        `)
        .order('added_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as InventoryChange[];
    }
  });

  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['low-stock-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productManagement')
        .select('prodId, prodName, prodSku, prodPiecestock')
        .lte('prodPiecestock', 5)
        .order('prodPiecestock');

      if (error) throw error;
      return data as LowStockItem[];
    }
  });

  const filteredLowStock = lowStockItems.filter(item => 
    item.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prodSku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col p-4 bg-background dark:bg-gray-800`}>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-navy-700 dark:text-white">Dashboard</h1>
        <ThemeToggle />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard title="Net Revenue" value="$500,000" footer="24% increase" />
        <DashboardCard title="Total Users" value="1,200" footer="10% increase" />
        <DashboardCard title="Active Sessions" value="300" footer="5% increase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Inventory Changes */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Recent Inventory Changes</h2>
            </div>
            <button 
              onClick={() => navigate('/app/inventory')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              View All
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity Changed</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{change.productManagement?.prodSku || 'N/A'}</TableCell>
                  <TableCell>{change.productManagement?.prodName || 'N/A'}</TableCell>
                  <TableCell>{change.quantity}</TableCell>
                  <TableCell>
                    {new Date(change.added_date).toLocaleDateString('en-IN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Low Stock Alert</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by SKU or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
              <button 
                onClick={() => navigate('/app/inventory/low-stock')}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                View All
              </button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLowStock.map((item) => (
                <TableRow key={item.prodId}>
                  <TableCell>{item.prodSku}</TableCell>
                  <TableCell>{item.prodName}</TableCell>
                  <TableCell className="text-red-600">
                    {item.prodPiecestock} pieces
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <LineChart
        width={500}
        height={300}
        data={[
          { name: 'Apr', uv: 400 },
          { name: 'May', uv: 600 },
          { name: 'Jun', uv: 800 },
          { name: 'Jul', uv: 500 },
          { name: 'Aug', uv: 700 },
        ]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default Dashboard;
