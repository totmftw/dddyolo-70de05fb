import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Search, Save, FileDown, FileUp } from 'lucide-react';
import { toast } from "../components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/reused/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/reused/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  prodBasePrice: number;
}

interface DiscountTemplate {
  id: string;
  template_name: string;
  template_data: QuantityDiscount;
  created_at?: string;
  updated_at?: string;
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
  const [templates, setTemplates] = useState<DiscountTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DiscountTemplate | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('discount_templates')
      .select('*');
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching templates",
        description: error.message
      });
      return;
    }

    const transformedTemplates: DiscountTemplate[] = (data || []).map(template => ({
      id: template.id,
      template_name: template.template_name,
      template_data: template.template_data as unknown as QuantityDiscount,
      created_at: template.created_at,
      updated_at: template.updated_at
    }));

    setTemplates(transformedTemplates);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('productManagement')
      .select('prodId, prodName, prodCollection, prodCategory, prodSubcategory, prodBasePrice');
    
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

  const handleDiscountChange = async (prodId: string, field: keyof QuantityDiscount, value: string | number) => {
    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
      return;
    }

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
        [dbField]: numericValue,
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

  const saveTemplate = async () => {
    if (!newTemplateName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a template name"
      });
      return;
    }

    const { error } = await supabase
      .from('discount_templates')
      .insert({
        template_name: newTemplateName,
        template_data: discounts[0] || {}
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving template",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Template saved successfully"
      });
      setNewTemplateName('');
      fetchTemplates();
    }
  };

  const applyTemplate = async (template: DiscountTemplate) => {
    const { error } = await supabase
      .from('productquantitydiscounts')
      .upsert({
        ...template.template_data,
        prodId: template.template_data.prodId
      }, {
        onConflict: 'prodId'
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error applying template",
        description: error.message
      });
    } else {
      toast({
        title: "Success",
        description: "Template applied successfully"
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

  const calculateDiscountedPrice = (basePrice: number, discountPercentage: number | null) => {
    if (!discountPercentage) return basePrice;
    return basePrice - (basePrice * (discountPercentage / 100));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quantity Discounts</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Discount Template</DialogTitle>
                <DialogDescription>
                  Enter a name for your template to save the current discount configuration.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Template name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
                <Button onClick={saveTemplate}>Save Template</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown className="w-4 h-4" />
                Load Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Discount Template</DialogTitle>
                <DialogDescription>
                  Select a template to apply its discount configuration.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    onClick={() => applyTemplate(template)}
                    className="justify-start"
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    {template.template_name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
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
              <TableHead>Base Price</TableHead>
              {[1, 2, 3, 4, 5].map(tier => (
                <TableHead key={tier}>
                  <div>Tier {tier}</div>
                  <div className="text-xs text-gray-500">(Qty/Disc%/Price)</div>
                </TableHead>
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
                  <TableCell>${product.prodBasePrice.toFixed(2)}</TableCell>
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
                          className="w-16 px-2 py-1 border rounded"
                          value={discount?.[qtyField as keyof QuantityDiscount] || ''}
                          onChange={(e) => handleDiscountChange(product.prodId, qtyField as keyof QuantityDiscount, e.target.value)}
                          placeholder="Qty"
                        />
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded"
                          value={discount?.[discField as keyof QuantityDiscount] || ''}
                          onChange={(e) => handleDiscountChange(product.prodId, discField as keyof QuantityDiscount, e.target.value)}
                          placeholder="%"
                        />
                        <div className="w-20 px-2 py-1 bg-gray-100 rounded text-sm">
                          ${calculateDiscountedPrice(
                            product.prodBasePrice,
                            discount?.[discField as keyof QuantityDiscount] || null
                          ).toFixed(2)}
                        </div>
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
