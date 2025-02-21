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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Grid, Filter, Save, Eye, Trash2, Send, FileDown } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

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

interface CustomerConfig {
  customer_id: number;
  pv_category: string;
  ptr_category: string;
  product_tags: string[];
}

interface WhatsAppConfig {
  id: number;
  catalog_id?: string;
  status?: 'pending' | 'sent' | 'delivered' | 'failed';
  api_key: string;
  template_name: string;
  template_namespace: string;
  from_phone_number_id: string;
  is_active: boolean;
  updated_at: string;
}

const CatalogBuilder = () => {
  const { userProfile } = useAuth();
  const [catalogName, setCatalogName] = useState('');
  const [selectedType, setSelectedType] = useState<'standard' | 'aged_stock' | 'dead_stock' | 'seasonal'>('standard');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [savedCatalogs, setSavedCatalogs] = useState<CatalogType[]>([]);
  const [selectedCatalogProducts, setSelectedCatalogProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedCatalogName, setSelectedCatalogName] = useState('');
  const [customerConfigs, setCustomerConfigs] = useState<CustomerConfig[]>([]);
  const [workflowConfigs, setWorkflowConfigs] = useState<Map<string, WhatsAppConfig>>(new Map());
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
    fetchCategories();
    fetchSavedCatalogs();
    fetchCustomerConfigs();
    fetchWorkflowStatus();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchSubcategories(selectedCategories[0]);
    }
  }, [selectedCategories]);

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

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name');
    
    if (error) {
      toast.error('Error fetching categories');
      return;
    }
    
    setCategories(data || []);
  };

  const fetchSubcategories = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('product_subcategories')
      .select('id, name')
      .eq('category_id', categoryId);
    
    if (error) {
      toast.error('Error fetching subcategories');
      return;
    }
    
    setSubcategories(data || []);
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

  const fetchCustomerConfigs = async () => {
    const { data, error } = await supabase
      .from('customer_config')
      .select('*');

    if (error) {
      toast.error('Error fetching customer configurations');
      return;
    }

    setCustomerConfigs(data || []);
  };

  const fetchWorkflowStatus = async () => {
    const { data, error } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('template_name', 'catalog_share');

    if (error) {
      console.error('Error fetching workflow status:', error);
      return;
    }

    const configMap = new Map<string, WhatsAppConfig>();
    data?.forEach(config => {
      if (config.catalog_id) {
        configMap.set(config.catalog_id, config as WhatsAppConfig);
      }
    });

    setWorkflowConfigs(configMap);
  };

  const fetchCatalogProducts = async (filters: CatalogType['filters']) => {
    let query = supabase.from('productManagement').select('prodId, prodName, prodSku, prodCategory, prodMrp');

    if (filters.collections?.length) {
      query = query.in('prodCollection', filters.collections);
    }
    if (filters.categories?.length) {
      query = query.in('prodCategory', filters.categories);
    }
    if (filters.subcategories?.length) {
      query = query.in('prodSubcategory', filters.subcategories);
    }
    if (filters.type) {
      switch(filters.type) {
        case 'aged_stock':
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          query = query.lt('created_at', sixMonthsAgo.toISOString());
          break;
        case 'dead_stock':
          query = query.eq('prodStatus', 'dead_stock');
          break;
        case 'seasonal':
          query = query.eq('prodStatus', 'seasonal');
          break;
      }
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Error fetching catalog products');
      return [];
    }

    const filteredProducts = data?.filter(product => {
      const relevantConfig = customerConfigs.find(config => 
        config.pv_category === product.prodCategory ||
        config.ptr_category === product.prodCategory ||
        (config.product_tags && config.product_tags.some(tag => product.prodId.includes(tag)))
      );

      return !relevantConfig || filters.type === 'standard';
    });

    return filteredProducts || [];
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
        categories: selectedCategories,
        subcategories: selectedSubcategories,
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
    setSelectedCategories([]);
    setSelectedSubcategories([]);
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
    
    if (products.length === 0) {
      toast.info('No products found matching the catalog criteria');
    }
    
    setSelectedCatalogProducts(products);
    setSelectedCatalogName(catalog.name);
    setIsProductDialogOpen(true);

    const workflowConfig = workflowConfigs.get(catalog.id);
    if (workflowConfig?.status) {
      const statusMessage = `Catalog workflow status: ${workflowConfig.status}`;
      const statusType = workflowConfig.status === 'delivered' ? 'success' : 
                        workflowConfig.status === 'failed' ? 'error' : 'info';
      
      toast[statusType](statusMessage);
    }
  };

  const handleSendToWorkflow = async (event: React.MouseEvent<HTMLButtonElement>, catalogId: string) => {
    event.preventDefault();
    try {
      const { data: existingConfig, error: configError } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (configError) {
        toast.error('No active WhatsApp configuration found');
        return;
      }

      const workflowConfig = {
        api_key: existingConfig.api_key,
        template_name: 'catalog_share',
        template_namespace: existingConfig.template_namespace,
        from_phone_number_id: existingConfig.from_phone_number_id,
        catalog_id: catalogId,
        status: 'pending' as const,
        is_active: true
      };

      const { error } = await supabase
        .from('whatsapp_config')
        .insert([workflowConfig]);

      if (error) throw error;

      toast.success('Catalog added to workflow queue');
      fetchWorkflowStatus();
    } catch (err) {
      console.error('Error sending catalog to workflow:', err);
      toast.error('Failed to add catalog to workflow');
    }
  };

  const generateCatalogPDF = async (catalogId: string) => {
    try {
      const { data: catalogData, error: catalogError } = await supabase
        .from('catalogs')
        .select('*')
        .eq('id', catalogId)
        .single();

      if (catalogError || !catalogData) {
        toast.error('Catalog not found');
        return;
      }

      const catalog: CatalogType = {
        id: catalogData.id,
        name: catalogData.name,
        filters: catalogData.filters as CatalogFilters,
        created_at: new Date(catalogData.created_at)
      };

      const products = await fetchCatalogProducts(catalog.filters);

      const docDefinition = {
        content: [
          { text: catalog.name, style: 'header' },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', 'auto'],
              body: [
                [
                  { text: 'SKU', style: 'tableHeader' },
                  { text: 'Name', style: 'tableHeader' },
                  { text: 'Category', style: 'tableHeader' },
                  { text: 'MRP (₹)', style: 'tableHeader' }
                ],
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

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob((blob) => {
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

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={selectedCategories[0]} onValueChange={(value) => setSelectedCategories([value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <Select 
                value={selectedSubcategories[0]} 
                onValueChange={(value) => setSelectedSubcategories([value])}
                disabled={!selectedCategories.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategories.length ? "Select subcategory" : "Select a category first"} />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => {
                setCatalogName('');
                setSelectedCollections([]);
                setSelectedCategories([]);
                setSelectedSubcategories([]);
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
                  {workflowConfigs.get(catalog.id)?.status && (
                    <p className="text-sm text-blue-500">
                      Status: {workflowConfigs.get(catalog.id)?.status}
                    </p>
                  )}
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
                    onClick={(e) => handleSendToWorkflow(e, catalog.id)}
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
