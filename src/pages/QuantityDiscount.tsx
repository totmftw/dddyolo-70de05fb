
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Search } from 'lucide-react';
import { toast } from "../components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuantityDiscount {
  id: string;
  prodId: string;
  tierOneQuantity: number | null;
  tierOneDiscount: number | null;
  tierTwoQuantity: number | null;
  tierTwoDiscount: number | null;
  tierThreeQuantity: number | null;
  tierThreeDiscount: number | null;
  tierFourQuantity: number | null;
  tierFourDiscount: number | null;
  tierFiveQuantity: number | null;
  tierFiveDiscount: number | null;
}

interface Product {
  prodId: string;
  prodName: string;
  prodCollection: string;
  prodCategory: string;
  prodSubcategory: string;
}

const QuantityDiscount = () => {
  const [discounts, setDiscounts] = useState<QuantityDiscount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    collection: '',
    category: '',
    subcategory: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('productManagement')
      .select('prodId, prodName, prodCollection, prodCategory, prodSubcategory');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: error.message
      });
      console.error('Error fetching products:', error);
      return;
    }
    setProducts(data || []);
  };

  const fetchDiscounts = async () => {
    const { data, error } = await supabase
      .from('productquantitydiscounts')
      .select('*');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching discounts",
        description: error.message
      });
      console.error('Error fetching discounts:', error);
      return;
    }

    // Map database column names to interface properties
    const mappedDiscounts: QuantityDiscount[] = (data || []).map(d => ({
      id: d.id,
      prodId: d.prodId,
      tierOneQuantity: d.tieronequantity,
      tierOneDiscount: d.tieronediscount,
      tierTwoQuantity: d.tiertwoquantity,
      tierTwoDiscount: d.tiertwodiscount,
      tierThreeQuantity: d.tierthreequantity,
      tierThreeDiscount: d.tierthreediscount,
      tierFourQuantity: d.tierfourquantity,
      tierFourDiscount: d.tierfourdiscount,
      tierFiveQuantity: d.tierfivequantity,
      tierFiveDiscount: d.tierfivediscount
    }));
    
    setDiscounts(mappedDiscounts);
  };

  const handleDiscountChange = async (prodId: string, field: keyof QuantityDiscount, value: number) => {
    // Map interface property names back to database column names
    const dbFieldMap: Record<string, string> = {
      tierOneQuantity: 'tieronequantity',
      tierOneDiscount: 'tieronediscount',
      tierTwoQuantity: 'tiertwoquantity',
      tierTwoDiscount: 'tiertwodiscount',
      tierThreeQuantity: 'tierthreequantity',
      tierThreeDiscount: 'tierthreediscount',
      tierFourQuantity: 'tierfourquantity',
      tierFourDiscount: 'tierfourdiscount',
      tierFiveQuantity: 'tierfivequantity',
      tierFiveDiscount: 'tierfivediscount'
    };

    const dbField = dbFieldMap[field];
    if (!dbField) return;

    const { error } = await supabase
      .from('productquantitydiscounts')
      .upsert({
        prodId,
        [dbField]: value,
      }, {
        onConflict: 'prodId'
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating discount",
        description: error.message
      });
      console.error('Error updating discount:', error);
    } else {
      toast({
        title: "Success",
        description: "Discount updated successfully"
      });
      fetchDiscounts();
    }
  };

  const getUniqueValues = (field: keyof Product) => {
    return [...new Set(products.map(p => p[field]).filter(Boolean))];
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.prodName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = !filters.collection || product.prodCollection === filters.collection;
    const matchesCategory = !filters.category || product.prodCategory === filters.category;
    const matchesSubcategory = !filters.subcategory || product.prodSubcategory === filters.subcategory;
    
    return matchesSearch && matchesCollection && matchesCategory && matchesSubcategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quantity Discounts</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {['collection', 'category', 'subcategory'].map((filterType) => (
          <select
            key={filterType}
            className="px-4 py-2 border rounded-lg min-w-[150px]"
            value={filters[filterType as keyof typeof filters]}
            onChange={(e) => setFilters(prev => ({ ...prev, [filterType]: e.target.value }))}
          >
            <option value="">All {filterType}s</option>
            {getUniqueValues(`prod${filterType.charAt(0).toUpperCase() + filterType.slice(1)}` as keyof Product).map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              {[1, 2, 3, 4, 5].map(tier => (
                <TableHead key={tier}>Tier {tier} (Qty/Disc%)</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const discount = discounts.find(d => d.prodId === product.prodId);
              return (
                <TableRow key={product.prodId}>
                  <TableCell>{product.prodName}</TableCell>
                  <TableCell>{product.prodCollection}</TableCell>
                  <TableCell>{product.prodCategory}</TableCell>
                  <TableCell>{product.prodSubcategory}</TableCell>
                  {[
                    ['tierOneQuantity', 'tierOneDiscount'],
                    ['tierTwoQuantity', 'tierTwoDiscount'],
                    ['tierThreeQuantity', 'tierThreeDiscount'],
                    ['tierFourQuantity', 'tierFourDiscount'],
                    ['tierFiveQuantity', 'tierFiveDiscount']
                  ].map(([qtyField, discField], index) => (
                    <TableCell key={index}>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded"
                          value={discount?.[qtyField as keyof QuantityDiscount] || ''}
                          onChange={(e) => handleDiscountChange(product.prodId, qtyField as keyof QuantityDiscount, Number(e.target.value))}
                          placeholder="Qty"
                        />
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded"
                          value={discount?.[discField as keyof QuantityDiscount] || ''}
                          onChange={(e) => handleDiscountChange(product.prodId, discField as keyof QuantityDiscount, Number(e.target.value))}
                          placeholder="%"
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuantityDiscount;
