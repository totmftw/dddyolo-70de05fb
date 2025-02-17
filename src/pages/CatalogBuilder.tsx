import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Grid, Filter, Save } from 'lucide-react';

interface CatalogType {
  id: string;
  name: string;
  filters: {
    collections?: string[];
    categories?: string[];
    subcategories?: string[];
    type?: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal';
  };
  created_at: Date;
}

const CatalogBuilder = () => {
  const { userProfile } = useAuth();
  const [catalogName, setCatalogName] = useState('');
  const [selectedType, setSelectedType] = useState<'standard' | 'aged_stock' | 'dead_stock' | 'seasonal'>('standard');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('id, name');
    
    if (error) {
      toast.error('Error fetching collections');
      return;
    }
    
    setCollections(data || []);
  };

  const saveCatalog = async () => {
    if (!catalogName) {
      toast.error('Please enter a catalog name');
      return;
    }

    const newCatalog = {
      name: catalogName,
      filters: {
        collections: selectedCollections,
        type: selectedType
      },
      created_by: userProfile?.id
    };

    const { error } = await supabase
      .from('catalogs')
      .insert([newCatalog]);

    if (error) {
      toast.error('Error saving catalog');
      return;
    }

    toast.success('Catalog saved successfully');
    setCatalogName('');
    setSelectedCollections([]);
    setSelectedType('standard');
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Grid className="h-6 w-6" />
            <CardTitle>Catalog Builder</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Catalog Name</label>
              <Input
                placeholder="Enter catalog name"
                value={catalogName}
                onChange={(e) => setCatalogName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catalog Type</label>
              <Select value={selectedType} onValueChange={(value: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal') => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select catalog type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aged_stock">Aged Stock</SelectItem>
                  <SelectItem value="dead_stock">Dead Stock</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Collections</label>
              <Select value={selectedCollections[0]} onValueChange={(value) => setSelectedCollections([value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                setCatalogName('');
                setSelectedCollections([]);
                setSelectedType('standard');
              }}>
                Reset
              </Button>
              <Button onClick={saveCatalog} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Catalog
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CatalogBuilder;
