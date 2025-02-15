import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2, Save, Tags } from 'lucide-react';

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

interface Material {
  id: string;
  name: string;
}

interface MaterialSubcategoryMapping {
  id: string;
  sub_category_id: string;
  material_id: string;
}

interface ProductConfig {
  id: string;
  category_id: string;
  sub_category_id: string;
  material_id: string;
  size_id: string;
  gsm?: number;
  thread_count?: number;
  created_at: string;
}

const ProductConfig = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [productConfigs, setProductConfigs] = useState<ProductConfig[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newItemName, setNewItemName] = useState('');
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [gsm, setGsm] = useState<string>('');
  const [threadCount, setThreadCount] = useState<string>('');
  const [materialMappings, setMaterialMappings] = useState<MaterialSubcategoryMapping[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
      fetchSizes(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      fetchAvailableMaterials(selectedSubCategory);
      fetchAvailableSizes(selectedCategory);
      fetchMaterialMappings(selectedSubCategory);
    }
  }, [selectedSubCategory]);

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

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Error fetching materials');
    } else {
      setMaterials(data || []);
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

  const fetchMaterialMappings = async (subCategoryId: string) => {
    const { data, error } = await supabase
      .from('material_subcategory_mapping')
      .select('*')
      .eq('sub_category_id', subCategoryId);
    
    if (error) {
      toast.error('Error fetching material mappings');
    } else {
      setMaterialMappings(data || []);
    }
  };

  const fetchAvailableMaterials = async (subCategoryId: string) => {
    const { data, error } = await supabase
      .from('material_subcategory_mapping')
      .select(`
        material_id,
        materials:materials!inner(
          id,
          name
        )
      `)
      .eq('sub_category_id', subCategoryId);
    
    if (error) {
      toast.error('Error fetching available materials');
    } else {
      const materials = data.map(item => item.materials);
      setAvailableMaterials(materials);
    }
  };

  const fetchAvailableSizes = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      toast.error('Error fetching available sizes');
    } else {
      setAvailableSizes(data || []);
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

  const addMaterial = async () => {
    if (!newItemName) {
      toast.error('Please enter a material name');
      return;
    }

    const { error } = await supabase
      .from('materials')
      .insert([{ name: newItemName }]);

    if (error) {
      toast.error('Error adding material');
    } else {
      toast.success('Material added successfully');
      setNewItemName('');
      fetchMaterials();
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

  const addMaterialMapping = async () => {
    if (!selectedSubCategory || !selectedMaterial) {
      toast.error('Please select both sub-category and material');
      return;
    }

    const { error } = await supabase
      .from('material_subcategory_mapping')
      .insert([{
        sub_category_id: selectedSubCategory,
        material_id: selectedMaterial
      }]);

    if (error) {
      if (error.code === '23505') {
        toast.error('This material is already mapped to this sub-category');
      } else {
        toast.error('Error adding material mapping');
      }
    } else {
      toast.success('Material mapping added successfully');
      fetchMaterialMappings(selectedSubCategory);
    }
  };

  const saveProductConfig = async () => {
    if (!selectedCategory || !selectedSubCategory || !selectedMaterial || !selectedSize) {
      toast.error('Please select all required fields');
      return;
    }

    const newConfig = {
      category_id: selectedCategory,
      sub_category_id: selectedSubCategory,
      material_id: selectedMaterial,
      size_id: selectedSize,
      gsm: gsm ? parseInt(gsm) : null,
      thread_count: threadCount ? parseInt(threadCount) : null
    };

    const { error } = await supabase
      .from('product_config')
      .insert([newConfig]);

    if (error) {
      toast.error('Error saving product configuration');
    } else {
      toast.success('Product configuration saved successfully');
      // Reset form
      setSelectedSubCategory('');
      setSelectedMaterial('');
      setSelectedSize('');
      setGsm('');
      setThreadCount('');
    }
  };

  const renderProductConfigTab = () => (
    <TabsContent value="productConfig">
      <Card>
        <CardHeader>
          <CardTitle>Category Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCategory ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sub-Category</label>
                  <Select
                    value={selectedSubCategory}
                    onValueChange={setSelectedSubCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <Select
                    value={selectedMaterial}
                    onValueChange={setSelectedMaterial}
                    disabled={!selectedSubCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaterials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <Select
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    disabled={!selectedSubCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GSM</label>
                  <Input
                    type="number"
                    placeholder="Enter GSM"
                    value={gsm}
                    onChange={(e) => setGsm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thread Count</label>
                  <Input
                    type="number"
                    placeholder="Enter Thread Count"
                    value={threadCount}
                    onChange={(e) => setThreadCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={saveProductConfig} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Configuration
                </Button>
              </div>

              {selectedSubCategory && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Material Mappings</h3>
                  <div className="flex gap-4 mb-4">
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addMaterialMapping}>
                      <Plus className="w-4 h-4 mr-2" />
                      Map Material
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {materialMappings.map((mapping) => (
                      <div key={mapping.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">
                            {materials.find(m => m.id === mapping.material_id)?.name}
                          </h3>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-yellow-600">Please select a category first</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Configuration</h1>
        <Link to="/dashboard/products/collections">
          <Button variant="outline" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            Manage Collections
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Selection</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="productConfig">Category Configurations</TabsTrigger>
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

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Material Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
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

        {renderProductConfigTab()}
      </Tabs>
    </div>
  );
};

export default ProductConfig;
