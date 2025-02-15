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
import { Plus, Trash2, Edit2 } from 'lucide-react';

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

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
}

interface RoomType {
  id: string;
  collection_id: string;
  name: string;
  description: string;
}

interface Material {
  id: string;
  collection_id: string;
  name: string;
  description: string;
}

interface ColorOption {
  id: string;
  collection_id: string;
  name: string;
  hex_code: string;
}

const AdminProductConfig = () => {
  const { userProfile } = useAuth();

  // Remove the unnecessary permission check
  if (!userProfile || userProfile.role !== 'it_admin') {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">Only IT administrators can access this page.</p>
      </div>
    );
  }

  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchCategories(selectedCollection);
      fetchRoomTypes(selectedCollection);
      fetchMaterials(selectedCollection);
      fetchColors(selectedCollection);
    }
  }, [selectedCollection]);

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

  const fetchRoomTypes = async (collectionId: string) => {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('collection_id', collectionId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching room types');
    } else {
      setRoomTypes(data || []);
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

  const fetchColors = async (collectionId: string) => {
    const { data, error } = await supabase
      .from('color_options')
      .select('*')
      .eq('collection_id', collectionId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching colors');
    } else {
      setColors(data || []);
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

  const addColor = async () => {
    if (!selectedCollection || !newItemName) {
      toast.error('Please select a collection and enter a color name');
      return;
    }

    const { error } = await supabase
      .from('color_options')
      .insert([{
        collection_id: selectedCollection,
        name: newItemName,
        hex_code: newColorHex
      }]);

    if (error) {
      toast.error('Error adding color');
    } else {
      toast.success('Color added successfully');
      setNewItemName('');
      setNewColorHex('#000000');
      fetchColors(selectedCollection);
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

      <Tabs defaultValue="collections" className="w-full">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="roomTypes">Room Types</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
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

        <TabsContent value="roomTypes">
          <Card>
            <CardHeader>
              <CardTitle>Room Types</CardTitle>
              <p>Manage room types for the selected collection</p>
            </CardHeader>
            <CardContent>
              {selectedCollection ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Room Type Name"
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
                      Add Room Type
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {roomTypes.map((roomType) => (
                      <div key={roomType.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{roomType.name}</h3>
                          <p className="text-sm text-gray-600">{roomType.description}</p>
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
                    <Button onClick={addCategory}>
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

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <p>Manage color options for the selected collection</p>
            </CardHeader>
            <CardContent>
              {selectedCollection ? (
                <>
                  <div className="flex gap-4 mb-4">
                    <Input
                      placeholder="Color Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-20"
                    />
                    <Button onClick={addColor}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Color
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <div key={color.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color.hex_code }}
                          />
                          <h3 className="font-medium">{color.name}</h3>
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
