
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { Package } from 'lucide-react';

interface Product {
  prodId: string;
  prodName: string;
  prodBrand?: string;
  prodCategory?: string;
  prodImages?: string[];
  prodPiecestock?: number;
  prodStatus?: boolean;
  prodMrp?: number;
  prodBasePrice?: number;
}

const ViewProducts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('productManagement')
        .select('*')
        .order('prodName', { ascending: true });

      if (error) {
        throw error;
      }
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Product List</h2>
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
            <h4 className="font-semibold">{product.prodName}</h4>
            <p className="text-sm text-gray-600">Brand: {product.prodBrand || 'N/A'}</p>
            <p className="text-sm text-gray-600">Category: {product.prodCategory || 'N/A'}</p>
            <p className="text-sm text-gray-600">Stock: {String(product.prodPiecestock || 0)} pieces</p>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">MRP: ₹{product.prodMrp || 0}</p>
                <p className="text-sm text-gray-600">Base: ₹{product.prodBasePrice || 0}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${product.prodStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.prodStatus ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
