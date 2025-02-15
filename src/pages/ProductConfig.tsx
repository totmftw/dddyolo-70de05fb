
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  category_id: string;
  name: string;
}

interface Size {
  id: string;
  category_id: string;
  name: string;
}

interface ProductConfig {
  id: string;
  category_id: string;
  sub_category_id: string;
  material_id: string;
  size_id: string;
  thread_count?: number;
  collection_name?: string;
  sku: string;
}

const ProductConfig = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [productConfigs, setProductConfigs] = useState<ProductConfig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
      fetchSizes(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Error fetching categories');
    } else {
      setCategories(data || []);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching sub-categories');
    } else {
      setSubCategories(data || []);
    }
  };

  const fetchSizes = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching sizes');
    } else {
      setSizes(data || []);
    }
  };

  const addCategory = async () => {
    if (!newItemName) {
      toast.error('Please enter a category name');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .insert([{ name: newItemName }]);

    if (error) {
      toast.error('Error adding category');
    } else {
      toast.success('Category added successfully');
      setNewItemName('');
      fetchCategories();
    }
  };

  const addSubCategory = async () => {
    if (!selectedCategory || !newItemName) {
      toast.error('Please select a category and enter a sub-category name');
      return;
    }

    const { error } = await supabase
      .from('sub_categories')
      .insert([{
        category_id: selectedCategory,
        name: newItemName
      }]);

    if (error) {
      toast.error('Error adding sub-category');
    } else {
      toast.success('Sub-category added successfully');
      setNewItemName('');
      fetchSubCategories(selectedCategory);
    }
  };

  const addSize = async () => {
    if (!selectedCategory || !newItemName) {
      toast.error('Please select a category and enter a size');
      return;
    }

    const { error } = await supabase
      .from('sizes')
      .insert([{
        category_id: selectedCategory,
        name: newItemName
      }]);

    if (error) {
      toast.error('Error adding size');
    } else {
      toast.success('Size added successfully');
      setNewItemName('');
      fetchSizes(selectedCategory);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Configuration</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Category Selection</h2>
        <select
          className="w-full max-w-xs p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="productConfig">Product Config</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Category Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Button onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategories">
          <Card>
            <CardHeader>
              <CardTitle>Sub-Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Sub-Category Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Button onClick={addSubCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sub-Category
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {subCategories.map((subCategory) => (
                      <div key={subCategory.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{subCategory.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-yellow-600">Please select a category first</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Size Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Button onClick={addSize}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Size
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <div key={size.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{size.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-yellow-600">Please select a category first</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productConfig">
          <Card>
            <CardHeader>
              <CardTitle>Product Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <div>
                  <p>Product configuration interface coming soon...</p>
                </div>
              ) : (
                <p className="text-yellow-600">Please select a category first</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductConfig;
