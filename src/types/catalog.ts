
export interface CatalogFilters {
  collections?: string[];
  categories?: string[];
  subcategories?: string[];
  type?: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal';
}

export interface CatalogType {
  id: string;
  name: string;
  filters: CatalogFilters;
  created_at: Date;
  is_active: boolean;
  created_by: string | null;
}

export interface Product {
  prodId: string;
  prodName: string;
  prodSku: string;
  prodCategory: string;
  prodMrp: number;
  maxColors: number;
  useCustomColors: boolean;
}
