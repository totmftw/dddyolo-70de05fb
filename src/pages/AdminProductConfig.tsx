
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
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
} from "@/components/reused/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Settings } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  collection_id: string;
  name: string;
  description: string;
}

interface ProductType {
  id: string;
  category_id: string;
  name: string;
  description: string;
  attributes_schema: {
    dimensions?: {
      required: boolean;
      fields: string[];
    };
    thread_count?: {
      required: boolean;
      type: string;
      min: number;
      max: number;
    };
    materials?: {
      required: boolean;
      multiple: boolean;
    };
  };
}

interface Material {
  id: string;
  collection_id: string;
  name: string;
  description: string;
}

const AdminProductConfig = () => {
  const { userProfile } = useAuth();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchCategories(selectedCollection);
      fetchMaterials(selectedCollection);
    }
  }, [selectedCollection]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductTypes(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Error fetching collections');
    } else {
      setCollections(data || []);
    }
  };

  const fetchCategories = async (collectionId: string) => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('collection_id', collectionId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching categories');
    } else {
      setCategories(data || []);
    }
  };

  const fetchProductTypes = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching product types');
    } else {
      setProductTypes(data || []);
    }
  };

  const fetchMaterials = async (collectionId: string) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('collection_id', collectionId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching materials');
    } else {
      setMaterials(data || []);
    }
  };

  const addCollection = async () => {
    if (!newItemName) {
      toast.error('Please enter a collection name');
      return;
    }

    const { error } = await supabase
      .from('collections')
      .insert([{
        name: newItemName,
        description: newItemDescription
      }]);

    if (error) {
      toast.error('Error adding collection');
    } else {
      toast.success('Collection added successfully');
      setNewItemName('');
      setNewItemDescription('');
      fetchCollections();
    }
  };

  const addCategory = async () => {
    if (!selectedCollection || !newItemName) {
      toast.error('Please select a collection and enter a category name');
      return;
    }

    const { error } = await supabase
      .from('product_categories')
      .insert([{
        collection_id: selectedCollection,
        name: newItemName,
        description: newItemDescription
      }]);

    if (error) {
      toast.error('Error adding category');
    } else {
      toast.success('Category added successfully');
      setNewItemName('');
      setNewItemDescription('');
      fetchCategories(selectedCollection);
    }
  };

  const addProductType = async () => {
    if (!selectedCategory || !newItemName) {
      toast.error('Please select a category and enter a product type name');
      return;
    }

    const defaultSchema = {
      dimensions: {
        required: true,
        fields: ["length", "width", "height", "unit"]
      },
      thread_count: {
        required: false,
        type: "number",
        min: 100,
        max: 1500
      },
      materials: {
        required: true,
        multiple: true
      }
    };

    const { error } = await supabase
      .from('product_types')
      .insert([{
        category_id: selectedCategory,
        name: newItemName,
        description: newItemDescription,
        attributes_schema: defaultSchema
      }]);

    if (error) {
      toast.error('Error adding product type');
    } else {
      toast.success('Product type added successfully');
      setNewItemName('');
      setNewItemDescription('');
      fetchProductTypes(selectedCategory);
    }
  };

  const addMaterial = async () => {
    if (!selectedCollection || !newItemName) {
      toast.error('Please select a collection and enter a material name');
      return;
    }

    const { error } = await supabase
      .from('materials')
      .insert([{
        collection_id: selectedCollection,
        name: newItemName,
        description: newItemDescription
      }]);

    if (error) {
      toast.error('Error adding material');
    } else {
      toast.success('Material added successfully');
      setNewItemName('');
      setNewItemDescription('');
      fetchMaterials(selectedCollection);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Configuration</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Collection Selection</h2>
        <select
          className="w-full max-w-xs p-2 border rounded"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select a Collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCollection && (
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
      )}

      <Tabs defaultValue="collections" className="w-full">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="productTypes">Product Types</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <p>Manage product collections</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Collection Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
                <Button onClick={addCollection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collection
                </Button>
              </div>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <div key={collection.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <h3 className="font-medium">{collection.name}</h3>
                      <p className="text-sm text-gray-600">{collection.description}</p>
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

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <p>Manage product categories for the selected collection</p>
            </CardHeader>
            <CardContent>
              {selectedCollection ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Category Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                      placeholder="Description"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
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
                          <p className="text-sm text-gray-600">{category.description}</p>
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
                <p className="text-yellow-600">Please select a collection first</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productTypes">
          <Card>
            <CardHeader>
              <CardTitle>Product Types</CardTitle>
              <p>Manage product types for the selected category</p>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Product Type Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                      placeholder="Description"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                    />
                    <Button onClick={addProductType}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product Type
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {productTypes.map((productType) => (
                      <div key={productType.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{productType.name}</h3>
                          <p className="text-sm text-gray-600">{productType.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
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

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
              <p>Manage materials for the selected collection</p>
            </CardHeader>
            <CardContent>
              {selectedCollection ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Material Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                      placeholder="Description"
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                    />
                    <Button onClick={addMaterial}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{material.name}</h3>
                          <p className="text-sm text-gray-600">{material.description}</p>
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
                <p className="text-yellow-600">Please select a collection first</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductConfig;
