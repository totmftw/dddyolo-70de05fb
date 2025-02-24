
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
import { Grid, Save } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogList from '@/components/catalog/CatalogList';
import ProductTable from '@/components/catalog/ProductTable';
import type { 
  CatalogType, 
  Product, 
  CatalogFilters as CatalogFiltersType,
  Collection,
  Category,
  Subcategory 
} from '@/types/catalog';
import type { WhatsAppConfig } from '@/types/whatsapp';

interface CustomerConfig {
  customer_id: number;
  pv_category: string;
  ptr_category: string;
  product_tags: string[];
}

const CatalogBuilder = () => {
  const { userProfile } = useAuth();
  const hasFullAccess = userProfile?.role === 'business_owner' || userProfile?.role === 'it_admin';

  const [catalogName, setCatalogName] = useState('');
  const [selectedType, setSelectedType] = useState<'standard' | 'aged_stock' | 'dead_stock' | 'seasonal'>('standard');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedCatalogName, setSelectedCatalogName] = useState('');
  const [selectedCatalogProducts, setSelectedCatalogProducts] = useState<Product[]>([]);
  const [workflowConfigs, setWorkflowConfigs] = useState<Map<string, WhatsAppConfig>>(new Map());

  // Query for collections
  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase.from('collections').select('id, name');
      if (error) throw error;
      return [{ id: 'none', name: 'None' }, ...(data || [])];
    }
  });

  // Query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) throw error;
      return data || [];
    }
  });

  // Query for subcategories
  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories', selectedCategories[0]],
    queryFn: async () => {
      if (!selectedCategories[0]) return [];
      const { data, error } = await supabase
        .from('product_subcategories')
        .select('id, name')
        .eq('category_id', selectedCategories[0]);
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCategories[0]
  });

  // Query for saved catalogs
  const { data: savedCatalogs = [], refetch: refetchCatalogs } = useQuery({
    queryKey: ['catalogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalogs')
        .select('*')
        .eq('created_by', userProfile?.id);
      if (error) throw error;
      return (data || []).map(catalog => ({
        ...catalog,
        created_at: new Date(catalog.created_at)
      })) as CatalogType[];
    }
  });

  // Query for customer configs
  const { data: customerConfigs = [] } = useQuery({
    queryKey: ['customer-configs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customer_config').select('*');
      if (error) throw error;
      return data as CustomerConfig[];
    }
  });

  // Mutation for saving catalog
  const saveCatalogMutation = useMutation({
    mutationFn: async () => {
      if (!catalogName) {
        throw new Error('Please enter a catalog name');
      }

      const newCatalog = {
        name: catalogName,
        filters: {
          collections: selectedCollections,
          categories: selectedCategories,
          subcategories: selectedSubcategories,
          type: selectedType
        },
        created_by: userProfile?.id,
        is_active: true
      };

      const { error } = await supabase.from('catalogs').insert([newCatalog]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Catalog saved successfully');
      setCatalogName('');
      setSelectedCollections([]);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedType('standard');
      refetchCatalogs();
    },
    onError: (error) => {
      toast.error(`Error saving catalog: ${error.message}`);
    }
  });

  // Effects
  useEffect(() => {
    fetchWorkflowStatus();
  }, []);

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
        configMap.set(config.catalog_id, {
          ...config,
          status: config.status as WhatsAppConfig['status']
        });
      }
    });

    setWorkflowConfigs(configMap);
  };

  const handleSendToWorkflow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const catalogId = (e.currentTarget as HTMLButtonElement).dataset.catalogId;
    if (!catalogId) return;

    try {
      const { data: existingConfig, error: configError } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (configError && !hasFullAccess) {
        toast.error('No active WhatsApp configuration found');
        return;
      }

      const workflowConfig = {
        api_key: existingConfig?.api_key || 'admin_override',
        template_name: 'catalog_share',
        template_namespace: existingConfig?.template_namespace || 'admin_override',
        from_phone_number_id: existingConfig?.from_phone_number_id || 'admin_override',
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
        filters: catalogData.filters as CatalogFiltersType,
        created_at: new Date(catalogData.created_at),
        is_active: catalogData.is_active,
        created_by: catalogData.created_by
      };

      const products = await fetchCatalogProducts(catalog.filters);
      
      const docDefinition = {
        content: [
          { 
            text: catalog.name, 
            style: 'header',
            alignment: 'center' 
          },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', 'auto'],
              body: [
                [
                  { text: 'SKU', style: 'tableHeader', alignment: 'left' },
                  { text: 'Name', style: 'tableHeader', alignment: 'left' },
                  { text: 'Category', style: 'tableHeader', alignment: 'left' },
                  { text: 'MRP (₹)', style: 'tableHeader', alignment: 'right' }
                ],
                ...products.map(product => [
                  { text: product.prodSku, alignment: 'left' },
                  { text: product.prodName, alignment: 'left' },
                  { text: product.prodCategory, alignment: 'left' },
                  { text: product.prodMrp.toFixed(2), alignment: 'right' }
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
            color: 'black',
            fillColor: '#f3f4f6'
          }
        },
        defaultStyle: {
          fontSize: 12
        }
      };

      pdfMake.createPdf(docDefinition as any).getBlob((blob) => {
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

  const viewCatalogProducts = async (catalog: CatalogType) => {
    const products = await fetchCatalogProducts(catalog.filters);
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

  const fetchCatalogProducts = async (filters: CatalogType['filters']) => {
    let query = supabase.from('productManagement').select(`
      prodId, 
      prodName, 
      prodSku, 
      prodCategory, 
      prodMrp,
      maxColors,
      useCustomColors,
      created_at
    `);

    if (filters.collections?.length && filters.collections[0] !== 'none') {
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
          query = query.eq('prodStatus', 'inactive');
          break;
        case 'seasonal':
          query = query.eq('prodStatus', 'seasonal');
          break;
        default:
          query = query.eq('prodStatus', 'active');
      }
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Error fetching catalog products');
      console.error('Error fetching products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      toast.info('No products found matching the catalog criteria');
      return [];
    }

    if (hasFullAccess) {
      return data;
    }

    const filteredProducts = data.filter(product => {
      const relevantConfig = customerConfigs.find(config => 
        config.pv_category === product.prodCategory ||
        config.ptr_category === product.prodCategory ||
        (config.product_tags && config.product_tags.some(tag => product.prodId.includes(tag)))
      );

      return !relevantConfig || filters.type === 'standard';
    });

    return filteredProducts;
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
          <CatalogFilters
            catalogName={catalogName}
            selectedType={selectedType}
            selectedCollections={selectedCollections}
            selectedCategories={selectedCategories}
            selectedSubcategories={selectedSubcategories}
            collections={collections}
            categories={categories}
            subcategories={subcategories}
            onNameChange={setCatalogName}
            onTypeChange={setSelectedType}
            onCollectionChange={(value) => setSelectedCollections([value])}
            onCategoryChange={(value) => {
              setSelectedCategories([value]);
              setSelectedSubcategories([]);
            }}
            onSubcategoryChange={(value) => setSelectedSubcategories([value])}
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => {
              setCatalogName('');
              setSelectedCollections([]);
              setSelectedCategories([]);
              setSelectedSubcategories([]);
              setSelectedType('standard');
            }}>
              Reset
            </Button>
            <Button onClick={() => saveCatalogMutation.mutate()} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Catalog
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Catalogs</CardTitle>
        </CardHeader>
        <CardContent>
          <CatalogList
            catalogs={savedCatalogs}
            workflowConfigs={workflowConfigs}
            onView={viewCatalogProducts}
            onSendToWorkflow={handleSendToWorkflow}
            onDownload={generateCatalogPDF}
            onDelete={async (catalogId) => {
              const { error } = await supabase
                .from('catalogs')
                .delete()
                .eq('id', catalogId);

              if (error) {
                toast.error('Error deleting catalog');
                return;
              }

              toast.success('Catalog deleted successfully');
              refetchCatalogs();
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Products in {selectedCatalogName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ProductTable products={selectedCatalogProducts} />
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
