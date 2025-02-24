
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CatalogFiltersProps {
  catalogName: string;
  selectedType: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal';
  selectedCollections: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  collections: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  subcategories: Array<{ id: string; name: string }>;
  onNameChange: (value: string) => void;
  onTypeChange: (value: 'standard' | 'aged_stock' | 'dead_stock' | 'seasonal') => void;
  onCollectionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

const CatalogFilters = ({
  catalogName,
  selectedType,
  selectedCollections,
  selectedCategories,
  selectedSubcategories,
  collections,
  categories,
  subcategories,
  onNameChange,
  onTypeChange,
  onCollectionChange,
  onCategoryChange,
  onSubcategoryChange,
}: CatalogFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Catalog Name</label>
        <Input
          placeholder="Enter catalog name"
          value={catalogName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Catalog Type</label>
        <Select value={selectedType} onValueChange={onTypeChange}>
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
        <Select 
          value={selectedCollections[0]} 
          onValueChange={onCollectionChange}
        >
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
        <Select 
          value={selectedCategories[0]} 
          onValueChange={onCategoryChange}
        >
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
          onValueChange={onSubcategoryChange}
          disabled={!selectedCategories.length || subcategories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !selectedCategories.length 
                ? "Select a category first" 
                : subcategories.length === 0 
                  ? "No subcategories available" 
                  : "Select subcategory"
            } />
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
    </div>
  );
};

export default CatalogFilters;
