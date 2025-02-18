
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Package, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";

interface Product {
  prodId: string;
  prodName: string;
  prodBrand?: string;
  prodCategory?: string;
  prodImages?: string[];
  prodPiecestock?: number;
  prodStatus: string;
  prodMrp: number;
  prodBasePrice?: number;
}

const LiveInventory = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // First get all inventory items with quantity > 0
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory_stock')
        .select(`
          quantity,
          product_id,
          productManagement!inventory_stock_product_id_fkey (
            prodId,
            prodName,
            prodBrand,
            prodCategory,
            prodImages,
            prodStatus,
            prodMrp,
            prodBasePrice
          )
        `)
        .gt('quantity', 0);

      if (inventoryError) {
        toast.error('Error fetching inventory');
        throw inventoryError;
      }

      // Transform the data to match our Product interface
      const transformedData = inventoryData?.map(item => ({
        ...item.productManagement,
        prodPiecestock: item.quantity
      })) || [];

      return transformedData;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Live Inventory</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <div key={product.prodId} className="bg-white p-4 rounded-lg shadow">
            {product.prodImages && product.prodImages[0] && (
              <img
                src={product.prodImages[0]}
                alt={product.prodName}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div className="flex justify-between items-start">
              <h4 className="font-semibold">{product.prodName}</h4>
              {product.prodPiecestock && product.prodPiecestock <= 5 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Low Stock!</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">Brand: {product.prodBrand || 'N/A'}</p>
            <p className="text-sm text-gray-600">Category: {product.prodCategory || 'N/A'}</p>
            <p className="text-sm text-gray-600">Stock: {String(product.prodPiecestock || 0)} pieces</p>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">MRP: ₹{product.prodMrp}</p>
                <p className="text-sm text-gray-600">Base: ₹{product.prodBasePrice || 0}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${product.prodStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.prodStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveInventory;
