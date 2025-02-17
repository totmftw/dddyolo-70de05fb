import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AttributeSchema {
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
}

interface ProductType {
  id: string;
  name: string;
  description: string;
  category_id: string;
  attributes_schema: AttributeSchema;
  created_at: string;
  updated_at: string;
}

interface Material {
  id: string;
  name: string;
  description: string;
  collection_id: string;
  created_at: string;
  updated_at: string;
}

const AdminProductConfig = () => {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchProductTypes();
    fetchMaterials();
  }, []);

  const fetchProductTypes = async () => {
    const { data, error } = await supabase
      .from('product_types')
      .select('*');
    
    if (error) {
      toast.error('Error fetching product types');
      return;
    }
    
    // Transform the data to match the ProductType interface
    const transformedData: ProductType[] = data.map(item => ({
      ...item,
      attributes_schema: typeof item.attributes_schema === 'string' 
        ? JSON.parse(item.attributes_schema)
        : item.attributes_schema
    }));
    
    setProductTypes(transformedData);
  };

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*');
    
    if (error) {
      toast.error('Error fetching materials');
      return;
    }
    
    // Transform the data to match the Material interface
    const transformedData: Material[] = data.map(item => ({
      ...item,
      description: item.description || '' // Provide default empty string if description is null
    }));
    
    setMaterials(transformedData);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Product Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            Product Types:
            {productTypes.map((productType) => (
              <div key={productType.id}>
                {productType.name} - {productType.description}
              </div>
            ))}
          </div>
          <div>
            Materials:
            {materials.map((material) => (
              <div key={material.id}>
                {material.name} - {material.description}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductConfig;
