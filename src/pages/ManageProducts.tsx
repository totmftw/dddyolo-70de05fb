
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Package, Search, Filter, Download, Trash, Edit, Plus, CheckSquare, Square } from 'lucide-react';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/reused/table";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Product {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodPiecestock: number;
  prodBasePrice: number;
  prodStatus: string;
  prodImages: string[];
  prodBrand: string;
  prodCategory: string;
  prodCollection: string;
}

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    collection: '',
    status: ''
  });

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productManagement')
        .select('*');
      if (error) {
        toast.error('Failed to fetch products');
        throw error;
      }
      return data as Product[];
    },
  });

  const handleDelete = async (prodId: string) => {
    const { error } = await supabase
      .from('productManagement')
      .delete()
      .eq('prodId', prodId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted successfully');
      refetch();
    }
  };

  const handleBulkDelete = async () => {
    const { error } = await supabase
      .from('productManagement')
      .delete()
      .in('prodId', selectedProducts);

    if (error) {
      toast.error('Failed to delete products');
    } else {
      toast.success('Products deleted successfully');
      setSelectedProducts([]);
      refetch();
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.prodId));
    }
  };

  const toggleProductSelection = (prodId: string) => {
    if (selectedProducts.includes(prodId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== prodId));
    } else {
      setSelectedProducts([...selectedProducts, prodId]);
    }
  };

  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = 
      product.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.prodSku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || product.prodCategory === filters.category;
    const matchesCollection = !filters.collection || product.prodCollection === filters.collection;
    const matchesStatus = !filters.status || product.prodStatus === filters.status;
    
    return matchesSearch && matchesCategory && matchesCollection && matchesStatus;
  });

  const getUniqueValues = (field: keyof Product) => {
    return [...new Set((products || []).map(p => p[field]).filter(Boolean))];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Manage Products
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {getUniqueValues('prodCategory').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="w-full p-2 mb-2 border rounded"
                  value={filters.collection}
                  onChange={(e) => setFilters(prev => ({ ...prev, collection: e.target.value }))}
                >
                  <option value="">All Collections</option>
                  {getUniqueValues('prodCollection').map(collection => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>
                <select
                  className="w-full p-2 border rounded"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All Statuses</option>
                  {getUniqueValues('prodStatus').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
              className="flex items-center gap-2"
            >
              {selectedProducts.length === filteredProducts.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Select All
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.prodId}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProductSelection(product.prodId)}
                    >
                      {selectedProducts.includes(product.prodId) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.prodImages?.[0] && (
                        <img
                          className="h-10 w-10 rounded-full object-cover mr-3"
                          src={product.prodImages[0]}
                          alt={product.prodName}
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.prodName}</div>
                        <div className="text-sm text-gray-500">{product.prodBrand}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.prodSku}</TableCell>
                  <TableCell>{product.prodPiecestock || 0}</TableCell>
                  <TableCell>${product.prodBasePrice || 0}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.prodStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.prodStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/products/edit/${product.prodId}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.prodId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
