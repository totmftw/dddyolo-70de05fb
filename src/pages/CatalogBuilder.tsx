import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from "sonner";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Grid, Filter, Save, Eye, Trash2, Send, FileDown } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';

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

interface CustomerConfigOption {
  category: string;
  value: string;
}

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

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

  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Fetch customer config options
  const { data: configOptions } = useQuery({
    queryKey: ['customer-config-options'],
    queryFn: async () => {
      const [pvQuery, ptrQuery, tagQuery] = await Promise.all([
        supabase
          .from('customer_config')
          .select('pv_category')
          .not('pv_category', 'is', null),
        supabase
          .from('customer_config')
          .select('ptr_category')
          .not('ptr_category', 'is', null),
        supabase
          .from('customer_config')
          .select('product_tags')
          .not('product_tags', 'is', null)
      ]);

      // Create unique sets of values
      const pvSet = new Set(pvQuery.data?.map(d => d.pv_category));
      const ptrSet = new Set(ptrQuery.data?.map(d => d.ptr_category));
      const tagSet = new Set(tagQuery.data?.flatMap(d => d.product_tags || []));

      const options: CustomerConfigOption[] = [
        ...(Array.from(pvSet).map(value => ({ category: 'PV Category', value })) || []),
        ...(Array.from(ptrSet).map(value => ({ category: 'PTR Category', value })) || []),
        ...(Array.from(tagSet).map(value => ({ category: 'Product Tags', value })) || [])
      ].filter((option): option is CustomerConfigOption => 
        option.value !== null && option.value !== undefined
      );

      return options;
    }
  });

  const handleSendToWorkflow = async () => {
    try {
      // Here you would implement the logic to send the catalog based on selected filters
      // This is a placeholder for the actual implementation
      toast.success('Catalog sent to workflow successfully');
      setShowWorkflowDialog(false);
    } catch (error) {
      toast.error('Failed to send catalog to workflow');
    }
  };

  const generateCatalogPDF = async (catalogId: string) => {
    try {
      // First fetch the catalog details
      const { data: catalogData, error: catalogError } = await supabase
        .from('catalogs')
        .select('*')
        .eq('id', catalogId)
        .single();

      if (catalogError || !catalogData) {
        toast.error('Catalog not found');
        return;
      }

      // Transform the raw catalog data to ensure it matches our CatalogType
      const catalog: CatalogType = {
        id: catalogData.id,
        name: catalogData.name,
        filters: catalogData.filters as CatalogFilters,
        created_at: new Date(catalogData.created_at)
      };

      // Fetch products for this catalog
      const products = await fetchCatalogProducts(catalog.filters);

      // Define the document definition
      const docDefinition = {
        content: [
          { text: catalog.name, style: 'header' },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', 'auto'],
              body: [
                // Header row
                [
                  { text: 'SKU', style: 'tableHeader' },
                  { text: 'Name', style: 'tableHeader' },
                  { text: 'Category', style: 'tableHeader' },
                  { text: 'MRP (₹)', style: 'tableHeader' }
                ],
                // Product rows
                ...products.map(product => [
                  product.prodSku,
                  product.prodName,
                  product.prodCategory,
                  product.prodMrp.toFixed(2)
                ])
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        },
        defaultStyle: {
          fontSize: 12
        }
      };

      // Generate PDF
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob(async (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${catalog.name.replace(/\s+/g, '_')}_catalog.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('PDF generated successfully');
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDownloadPDF = async (catalogId: string) => {
    await generateCatalogPDF(catalogId);
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
                    onClick={() => {
                      setSelectedCatalog(catalog.id);
                      setShowWorkflowDialog(true);
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(catalog.id)}
                  >
                    <FileDown className="h-4 w-4" />
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

      {/* Workflow Dialog */}
      <Dialog open={showWorkflowDialog} onOpenChange={setShowWorkflowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send to Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Filters</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedFilters.length > 0 
                      ? `${selectedFilters.length} filters selected`
                      : 'Select filters'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {configOptions?.map((option) => (
                    <DropdownMenuItem
                      key={`${option.category}-${option.value}`}
                      onSelect={() => {
                        const newValue = `${option.category}: ${option.value}`;
                        setSelectedFilters(prev => 
                          prev.includes(newValue)
                            ? prev.filter(f => f !== newValue)
                            : [...prev, newValue]
                        );
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(`${option.category}: ${option.value}`)}
                          onChange={() => {}}
                          className="h-4 w-4"
                        />
                        <span>{option.category}: {option.value}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button 
              className="w-full"
              onClick={handleSendToWorkflow}
              disabled={selectedFilters.length === 0}
            >
              Send to Workflow
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
