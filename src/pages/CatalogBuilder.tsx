import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/reused/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Grid, Filter, Save, Eye, Trash2 } from 'lucide-react';

interface CatalogFilters {
  collections?: string[];
  categories?: string[];
  subcategories?: string[];
  type?: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal';
}

interface CatalogType {
  id: string;
  name: string;
  filters: CatalogFilters;
  created_at: Date;
}

interface Product {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodCategory: string;
  prodMrp: number;
}

const CatalogBuilder = () => {
  const { userProfile } = useAuth();
  const [catalogName, setCatalogName] = useState('');
  const [selectedType, setSelectedType] = useState<'standard' | 'aged_stock' | 'dead_stock' | 'seasonal'>('standard');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [savedCatalogs, setSavedCatalogs] = useState<CatalogType[]>([]);
  const [selectedCatalogProducts, setSelectedCatalogProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedCatalogName, setSelectedCatalogName] = useState('');

  useEffect(() => {
    fetchCollections();
    fetchSavedCatalogs();
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

  const fetchSavedCatalogs = async () => {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .eq('created_by', userProfile?.id);

    if (error) {
      toast.error('Error fetching saved catalogs');
      return;
    }

    const transformedData: CatalogType[] = (data || []).map(catalog => ({
      id: catalog.id,
      name: catalog.name,
      filters: catalog.filters as CatalogFilters,
      created_at: new Date(catalog.created_at)
    }));

    setSavedCatalogs(transformedData);
  };

  const fetchCatalogProducts = async (filters: CatalogType['filters']) => {
    let query = supabase.from('productManagement').select('prodId, prodName, prodSku, prodCategory, prodMrp');

    if (filters.collections?.length) {
      query = query.in('prodCollection', filters.collections);
    }
    if (filters.type) {
      // Add any type-specific filtering logic here
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Error fetching catalog products');
      return [];
    }

    return data;
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
    fetchSavedCatalogs();
  };

  const deleteCatalog = async (catalogId: string) => {
    const { error } = await supabase
      .from('catalogs')
      .delete()
      .eq('id', catalogId);

    if (error) {
      toast.error('Error deleting catalog');
      return;
    }

    toast.success('Catalog deleted successfully');
    fetchSavedCatalogs();
  };

  const viewCatalogProducts = async (catalog: CatalogType) => {
    const products = await fetchCatalogProducts(catalog.filters);
    setSelectedCatalogProducts(products);
    setSelectedCatalogName(catalog.name);
    setIsProductDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
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

      {/* Saved Catalogs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Catalogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedCatalogs.map((catalog) => (
              <div key={catalog.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{catalog.name}</h3>
                  <p className="text-sm text-gray-500">Type: {catalog.filters.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewCatalogProducts(catalog)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCatalog(catalog.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {savedCatalogs.length === 0 && (
              <p className="text-center text-gray-500">No catalogs saved yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Products in {selectedCatalogName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SKU</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">MRP</th>
                </tr>
              </thead>
              <tbody>
                {selectedCatalogProducts.map((product) => (
                  <tr key={product.prodId} className="border-b">
                    <td className="p-2">{product.prodSku}</td>
                    <td className="p-2">{product.prodName}</td>
                    <td className="p-2">{product.prodCategory}</td>
                    <td className="p-2 text-right">₹{product.prodMrp.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedCatalogProducts.length === 0 && (
              <p className="text-center text-gray-500 py-4">No products found in this catalog</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogBuilder;
