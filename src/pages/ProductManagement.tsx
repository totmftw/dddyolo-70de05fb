import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Package, Download, Upload, Database, Edit2 } from 'lucide-react';
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/reused/dialog";

interface Product {
  prodId: string;
  prodName: string;
  prodMrp: number;
  prodSku: string;
  prodStatus: string;
  prodBrand?: string;
  prodCategory?: string;
  prodCollection?: string;
  prodSubcategory?: string;
  prodType?: string;
  prodVariant?: string;
  prodMaterial?: string;
  prodBasePrice?: number;
  prodImages?: string[];
  prodMoq?: number;
  prodBoxstock?: number;
  prodPiecestock?: number;
  prodUnitweight?: number;
  prodGrossweight?: number;
  prodNettweight?: number;
}

interface ProductManagementType {
  prodId: string;
  prodName: string;
  prodMrp: number;
  prodSku: string;
  prodStatus: string;
  prodBrand?: string | null;
  prodCategory?: string | null;
  prodCollection?: string | null;
  prodSubcategory?: string | null;
  prodType?: string | null;
  prodVariant?: string | null;
  prodMaterial?: string | null;
  prodBasePrice?: number | null;
  prodImages?: string[] | null;
  prodMoq?: number | null;
  prodBoxstock?: number | null;
  prodPiecestock?: number | null;
  prodUnitweight?: number | null;
  prodGrossweight?: number | null;
  prodNettweight?: number | null;
  prodPackaging?: string | null;
  prodCbm?: number | null;
  prodShortName?: string | null;
  by_use?: string[] | null;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductManagementType>({
    prodId: `PROD-${Date.now()}`,
    prodName: '',
    prodMrp: 0,
    prodSku: '',
    prodStatus: 'active',
    prodBrand: 'Black Gold',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [additionalColors, setAdditionalColors] = useState<string[]>([]);
  const [mrpPercentage, setMrpPercentage] = useState(25);

  const collections = [
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Kitchen',
    'Bathroom',
    'Outdoor',
    'Office'
  ];

  const categories = [
    'Furniture',
    'Lighting',
    'Decor',
    'Storage',
    'Outdoor',
    'Accessories'
  ];

  const subCategories = {
    'Living Room': ['Sofas', 'Coffee Tables', 'TV Units', 'Bookshelves', 'Lounge Chairs'],
    'Bedroom': ['Beds', 'Wardrobes', 'Dressers', 'Nightstands', 'Mattresses'],
    'Dining Room': ['Dining Tables', 'Dining Chairs', 'Buffets', 'Bar Cabinets'],
    'Kitchen': ['Kitchen Islands', 'Bar Stools', 'Storage Units', 'Cabinets'],
    'Bathroom': ['Vanities', 'Mirrors', 'Storage Units', 'Accessories'],
    'Outdoor': ['Garden Furniture', 'Planters', 'Decor', 'Lighting', 'Doormats'],
    'Office': ['Desks', 'Office Chairs', 'Storage', 'Accessories']
  };

  const colors = [
    { name: 'Natural Wood', value: '#A0522D' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Grey', value: '#808080' },
    { name: 'Navy Blue', value: '#000080' },
    { name: 'Forest Green', value: '#228B22' },
    { name: 'Burgundy', value: '#800020' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Bronze', value: '#CD7F32' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('productManagement')
      .select('*')
      .order('prodName', { ascending: true });

    if (error) {
      toast.error('Error fetching products');
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 10) {
        toast.error('Maximum 10 images allowed');
        return;
      }
      setSelectedFiles(e.target.files);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.prodName || !formData.prodMrp || !formData.prodSku) {
      toast.error('Product name, MRP and SKU are required');
      return;
    }

    const productData: ProductManagementType = {
      ...formData,
      prodImages: selectedFiles ? Array.from(selectedFiles).map(file => URL.createObjectURL(file)) : [],
    };

    const { error } = await supabase
      .from('productManagement')
      .insert([productData]);

    if (error) {
      toast.error('Error adding product');
      console.error('Error adding product:', error);
    } else {
      toast.success('Product added successfully');
      fetchProducts();
      clearFields();
    }
  };

  const handleTemplateDownload = () => {
    const headers = [
      'Product Name', 'Brand', 'SKU', 'Collection', 'Subcategory',
      'Material', 'Type', 'Variant', 'Color 1', 'Color 2', 'Color 3', 'Color 4', 'Color 5',
      'Base Price', 'Landing Cost', 'Variable Price',
      'MOQ', 'Box Stock', 'Piece Stock',
      'Unit Weight (kg)', 'Gross Weight (kg)', 'Net Weight (kg)',
      'Box Length (cm)', 'Box Width (cm)', 'Box Height (cm)',
      'Product Length (cm)', 'Product Width (cm)', 'Product Height (cm)',
      'Status'
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products Template');
    XLSX.writeFile(wb, 'products_template.xlsx');
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const duplicates = data.filter((item, index, self) =>
          index !== self.findIndex((t) => (
            t['SKU'] === item['SKU'] ||
            t['Product Name'] === item['Product Name']
          ))
        );

        if (duplicates.length > 0) {
          toast.error(
            <div>
              <p>Duplicate products found:</p>
              <ul className="mt-2 list-disc list-inside">
                {duplicates.map((dup: any, index) => (
                  <li key={index}>
                    {dup['Product Name']} (SKU: {dup['SKU']})
                  </li>
                ))}
              </ul>
              <p className="mt-2">Please remove duplicates and try again.</p>
            </div>,
            { duration: 5000 }
          );
          return;
        }

        for (const row of data) {
          const { data: existingProduct } = await supabase
            .from('productManagement')
            .select('prodId')
            .or(`prodSku.eq.${row['SKU']},prodName.eq.${row['Product Name']}`)
            .single();

          if (existingProduct) {
            toast.error(`Product already exists: ${row['Product Name']} (SKU: ${row['SKU']})`);
            continue;
          }

          const productData = {
            prodId: `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            prodName: row['Product Name'],
            prodBrand: row['Brand'] || 'Black Gold',
            prodSku: row['SKU'],
            prodCollection: row['Collection'],
            prodSubcategory: row['Subcategory'],
            prodMaterial: row['Material'],
            prodType: row['Type'],
            prodVariant: row['Variant'],
            prodColor1: row['Color 1'],
            prodColor2: row['Color 2'],
            prodColor3: row['Color 3'],
            prodColor4: row['Color 4'],
            prodColor5: row['Color 5'],
            prodBasePrice: row['Base Price'],
            prodLandingcost: row['Landing Cost'],
            prodVariableprice: row['Variable Price'],
            prodMoq: row['MOQ'],
            prodBoxstock: row['Box Stock'],
            prodPiecestock: row['Piece Stock'],
            prodUnitweight: row['Unit Weight (kg)'],
            prodGrossweight: row['Gross Weight (kg)'],
            prodNettweight: row['Net Weight (kg)'],
            prodStatus: row['Status'] === 'Active' ? 'active' : 'inactive'
          };

          const { error } = await supabase
            .from('productManagement')
            .insert([productData]);

          if (error) {
            toast.error(`Error uploading product: ${row['Product Name']}`);
            console.error('Error:', error);
          }
        }
        toast.success('Bulk upload completed successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error processing file');
        console.error('Error:', error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadAllProducts = async () => {
    const { data, error } = await supabase
      .from('productManagement')
      .select('*');

    if (error) {
      toast.error('Error downloading products');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Products');
    XLSX.writeFile(wb, 'all_products.xlsx');
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setShowEditDialog(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    const { error } = await supabase
      .from('productManagement')
      .update(formData)
      .eq('prodId', selectedProduct.prodId);

    if (error) {
      toast.error('Error updating product');
      console.error('Error updating product:', error);
    } else {
      toast.success('Product updated successfully');
      setShowEditDialog(false);
      fetchProducts();
    }
  };

  const addColorField = () => {
    if (additionalColors.length < 5) {
      setAdditionalColors([...additionalColors, '']);
    } else {
      toast.error('Maximum 5 additional colors allowed');
    }
  };

  const clearFields = () => {
    setFormData({
      prodId: `PROD-${Date.now()}`,
      prodName: '',
      prodMrp: 0,
      prodSku: '',
      prodStatus: 'active',
      prodBrand: 'Black Gold',
    });
    setSelectedFiles(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Add New Product</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTemplateDownload}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Template Download
          </button>
          <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
            <Upload className="h-4 w-4" />
            Files Upload
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleDownloadAllProducts}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <Database className="h-4 w-4" />
            Download All Products
          </button>
        </div>
      </div>

      <form onSubmit={handleAddProduct} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <input
              type="text"
              name="prodName"
              value={formData.prodName}
              onChange={handleInputChange}
              placeholder="Product Name *"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="prodBrand"
              value={formData.prodBrand}
              onChange={handleInputChange}
              placeholder="Brand"
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
            <input
              type="text"
              name="prodSku"
              value={formData.prodSku || ''}
              onChange={handleInputChange}
              placeholder="SKU (will be auto-generated if empty)"
              className="w-full p-2 border rounded"
            />
            <select
              name="prodCategory"
              value={formData.prodCategory || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <h4 className="font-medium">By Room Type</h4>
            <select
              name="prodCollection"
              value={String(formData.prodCollection)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Room Type</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>{collection}</option>
              ))}
            </select>
            <div>
              <h4 className="font-medium">Collection</h4>
              <input
                type="text"
                name="prodCollection"
                value={formData.prodCollection || ''}
                onChange={handleInputChange}
                placeholder="Collection Name"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Color Options</h3>
            {[1, 2, 3, 4, 5].map((num) => (
              <select
                key={num}
                name={`prodColor${num}`}
                value={String(formData[`prodColor${num}` as keyof ProductManagementType])}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Color {num}</option>
                {colors.map(color => (
                  <option
                    key={color.name}
                    value={color.name}
                    style={{ backgroundColor: color.value }}
                  >
                    {color.name}
                  </option>
                ))}
              </select>
            ))}
            <button
              type="button"
              onClick={addColorField}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add more colors
            </button>
            {additionalColors.map((_, index) => (
              <select
                key={`additional-${index}`}
                name={`additionalColor${index}`}
                value={additionalColors[index]}
                onChange={(e) => {
                  const newColors = [...additionalColors];
                  newColors[index] = e.target.value;
                  setAdditionalColors(newColors);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Additional Color</option>
                {colors.map(color => (
                  <option key={color.name} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Images</h3>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload up to 10 images (1024x1024 recommended)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Specifications</h3>
            <input
              type="text"
              name="prodMaterial"
              value={formData.prodMaterial || ''}
              onChange={handleInputChange}
              placeholder="Material"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="prodType"
              value={formData.prodType || ''}
              onChange={handleInputChange}
              placeholder="Type"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="prodVariant"
              value={formData.prodVariant || ''}
              onChange={handleInputChange}
              placeholder="Variant"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pricing</h3>
            <input
              type="number"
              name="prodMrp"
              value={formData.prodMrp || ''}
              onChange={handleInputChange}
              placeholder="MRP *"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="prodBasePrice"
              value={formData.prodBasePrice || ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-50"
              placeholder="Base Price (auto-calculated)"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Inventory</h3>
            <input
              type="number"
              name="prodMoq"
              value={formData.prodMoq || ''}
              onChange={handleInputChange}
              placeholder="Minimum Order Quantity"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="prodBoxstock"
              value={formData.prodBoxstock || ''}
              onChange={handleInputChange}
              placeholder="Box Stock"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="prodPiecestock"
              value={formData.prodPiecestock || ''}
              onChange={handleInputChange}
              placeholder="Piece Stock"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Measurements</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="number"
                name="prodUnitweight"
                value={formData.prodUnitweight || ''}
                onChange={handleInputChange}
                placeholder="Unit Weight (kg)"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodGrossweight"
                value={formData.prodGrossweight || ''}
                onChange={handleInputChange}
                placeholder="Gross Weight (kg)"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodNettweight"
                value={formData.prodNettweight || ''}
                onChange={handleInputChange}
                placeholder="Net Weight (kg)"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            name="prodStatus"
            value={formData.prodStatus || 'active'}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.prodId} className="bg-white p-4 rounded-lg shadow">
              {product.prodImages && product.prodImages[0] && (
                <img
                  src={product.prodImages[0]}
                  alt={product.prodName}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h4 className="font-semibold">{product.prodName}</h4>
              <p className="text-sm text-gray-600">Brand: {product.prodBrand || 'N/A'}</p>
              <p className="text-sm text-gray-600">Category: {product.prodCategory || 'N/A'}</p>
              <p className="text-sm text-gray-600">Room Type: {product.prodCollection || 'N/A'}</p>
              <p className="text-sm text-gray-600">Collection: {product.prodCollection || 'N/A'}</p>
              <p className="text-sm text-gray-600">Stock: {String(product.prodPiecestock || 0)} pieces</p>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map(num => {
                  const colorName = product[`prodColor${num}` as keyof ProductManagementType];
                  if (colorName) {
                    const colorValue = colors.find(c => c.name === colorName)?.value;
                    return (
                      <div
                        key={num}
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorValue }}
                        title={String(colorName)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${product.prodStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.prodStatus === 'active' ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <input
                type="text"
                name="prodName"
                value={formData.prodName}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="prodBrand"
                value={formData.prodBrand}
                onChange={handleInputChange}
                placeholder="Brand"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="prodSku"
                value={formData.prodSku}
                onChange={handleInputChange}
                placeholder="SKU"
                className="w-full p-2 border rounded"
              />
              <select
                name="prodCategory"
                value={formData.prodCategory}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                name="prodCollection"
                value={formData.prodCollection}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Collection</option>
                {collections.map(collection => (
                  <option key={collection} value={collection}>{collection}</option>
                ))}
              </select>
              <input
                type="text"
                name="prodMaterial"
                value={formData.prodMaterial}
                onChange={handleInputChange}
                placeholder="Material"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="prodType"
                value={formData.prodType}
                onChange={handleInputChange}
                placeholder="Type"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="prodVariant"
                value={formData.prodVariant}
                onChange={handleInputChange}
                placeholder="Variant"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodMrp"
                value={formData.prodMrp}
                onChange={handleInputChange}
                placeholder="MRP"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodBasePrice"
                value={formData.prodBasePrice}
                onChange={handleInputChange}
                placeholder="Base Price"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodMoq"
                value={formData.prodMoq}
                onChange={handleInputChange}
                placeholder="MOQ"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodBoxstock"
                value={formData.prodBoxstock}
                onChange={handleInputChange}
                placeholder="Box Stock"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodPiecestock"
                value={formData.prodPiecestock}
                onChange={handleInputChange}
                placeholder="Piece Stock"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodUnitweight"
                value={formData.prodUnitweight}
                onChange={handleInputChange}
                placeholder="Unit Weight"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodGrossweight"
                value={formData.prodGrossweight}
                onChange={handleInputChange}
                placeholder="Gross Weight"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="prodNettweight"
                value={formData.prodNettweight}
                onChange={handleInputChange}
                placeholder="Net Weight"
                className="w-full p-2 border rounded"
              />
              <select
                name="prodStatus"
                value={formData.prodStatus}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => setShowEditDialog(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
