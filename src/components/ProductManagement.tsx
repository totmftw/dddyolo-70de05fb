
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, Image, Trash2 } from 'lucide-react';
import { toast } from "sonner";

interface Product {
  prodId: string;
  prodName: string;
  prodBrand?: string;
  prodCategory?: string;
  prodType?: string;
  prodVariant?: string;
  prodMaterial?: string;
  prodPackaging?: string;
  prodMoq?: number;
  prodPackcount?: number;
  prodCbm?: number;
  prodUnitweight?: number;
  prodGrossweight?: number;
  prodNettweight?: number;
  prodColor1?: string;
  prodColor2?: string;
  prodColor3?: string;
  prodColor4?: string;
  prodColor5?: string;
  prodPromo1?: string;
  prodPromo2?: string;
  prodLandingcost?: number;
  prodVariableprice?: number;
  prodBasePrice?: number;
  prodSlaborice1?: number;
  prodSlabprice2?: number;
  prodSlabprice3?: number;
  prodSlabprice4?: number;
  prodSlabprice5?: number;
  prodBoxstock?: number;
  prodPiecestock?: number;
  prodStatus?: boolean;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Product>({
        prodId: '',
        prodName: '',
        prodStatus: true
    });
    const [loading, setLoading] = useState(false);

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
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Generate a unique product ID if not provided
        const productData = {
            ...formData,
            prodId: formData.prodId || `PROD-${Date.now()}`
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
            setFormData({
                prodId: '',
                prodName: '',
                prodStatus: true
            });
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Package className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Product Management</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Basic Information */}
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
                            value={formData.prodBrand || ''}
                            onChange={handleInputChange}
                            placeholder="Brand"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="prodCategory"
                            value={formData.prodCategory || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Category</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Decor">Decor</option>
                            <option value="Lighting">Lighting</option>
                            <option value="Textiles">Textiles</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Bath">Bath</option>
                        </select>
                    </div>

                    {/* Specifications */}
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

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Pricing</h3>
                        <input
                            type="number"
                            name="prodBasePrice"
                            value={formData.prodBasePrice || ''}
                            onChange={handleInputChange}
                            placeholder="Base Price"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="prodLandingcost"
                            value={formData.prodLandingcost || ''}
                            onChange={handleInputChange}
                            placeholder="Landing Cost"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="prodVariableprice"
                            value={formData.prodVariableprice || ''}
                            onChange={handleInputChange}
                            placeholder="Variable Price"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Inventory */}
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

                    {/* Measurements */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Measurements</h3>
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

                    {/* Colors */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Colors Available</h3>
                        <input
                            type="text"
                            name="prodColor1"
                            value={formData.prodColor1 || ''}
                            onChange={handleInputChange}
                            placeholder="Color 1"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="prodColor2"
                            value={formData.prodColor2 || ''}
                            onChange={handleInputChange}
                            placeholder="Color 2"
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="prodColor3"
                            value={formData.prodColor3 || ''}
                            onChange={handleInputChange}
                            placeholder="Color 3"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="prodStatus"
                            checked={formData.prodStatus}
                            onChange={handleCheckboxChange}
                            className="form-checkbox"
                        />
                        <span>Active Product</span>
                    </label>
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
                            <h4 className="font-semibold">{product.prodName}</h4>
                            <p className="text-sm text-gray-600">Brand: {product.prodBrand || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Category: {product.prodCategory || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Stock: {product.prodPiecestock || 0} pieces</p>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${product.prodStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.prodStatus ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
