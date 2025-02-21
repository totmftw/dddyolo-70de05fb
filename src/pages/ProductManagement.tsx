
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Package, Plus } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/reused/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Product {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodBasePrice: number;
  prodStatus: string;
  prodCategory: string;
  prodCollection: string;
  maxColors: number;
}

const ProductManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    maxColors: 1
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

  const handleAddProduct = async () => {
    if (!newProduct.prodName || !newProduct.prodSku) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = await supabase
      .from('productManagement')
      .insert([{
        ...newProduct,
        prodStatus: newProduct.prodStatus || 'active',
      }]);

    if (error) {
      toast.error('Failed to add product');
    } else {
      toast.success('Product added successfully');
      setIsAddDialogOpen(false);
      setNewProduct({ maxColors: 1 });
      refetch();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.prodId}>
                  <TableCell>{product.prodSku}</TableCell>
                  <TableCell>{product.prodName}</TableCell>
                  <TableCell>{product.prodCategory}</TableCell>
                  <TableCell>{product.prodCollection}</TableCell>
                  <TableCell>₹{product.prodBasePrice}</TableCell>
                  <TableCell>{product.maxColors}</TableCell>
                  <TableCell>{product.prodStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">SKU</Label>
              <Input
                id="sku"
                value={newProduct.prodSku || ''}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  prodSku: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newProduct.prodName || ''}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  prodName: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Base Price</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.prodBasePrice || ''}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  prodBasePrice: parseFloat(e.target.value)
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxColors" className="text-right">
                Number of Colors
              </Label>
              <Select
                value={String(newProduct.maxColors || 1)}
                onValueChange={(value) => setNewProduct(prev => ({
                  ...prev,
                  maxColors: parseInt(value)
                }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select number of colors" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={String(num)}>
                      {num} color{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                value={newProduct.prodCategory || ''}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  prodCategory: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collection" className="text-right">Collection</Label>
              <Input
                id="collection"
                value={newProduct.prodCollection || ''}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  prodCollection: e.target.value
                }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
