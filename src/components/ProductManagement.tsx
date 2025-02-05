
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package } from 'lucide-react';
import { toast } from "sonner";

interface Product {
    prodId: string;
    prodName: string;
    prodBrand?: string;
    prodCategory?: string;
    prodCollection?: string;
    prodSubcategory?: string;
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
    prodImages?: string[];
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
    prodRestockDate?: string;
    prodSku?: string;
    prodShortName?: string;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState<Product>({
        prodId: '',
        prodName: '',
        prodBrand: 'Black Gold', // Default brand
        prodStatus: true
    });
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const collections = [
        'Living Room',
        'Bedroom',
        'Dining Room',
        'Kitchen',
        'Bathroom',
        'Outdoor',
        'Office'
    ];

    const subCategories = {
        'Living Room': ['Sofas', 'Coffee Tables', 'TV Units', 'Bookshelves', 'Lounge Chairs'],
        'Bedroom': ['Beds', 'Wardrobes', 'Dressers', 'Nightstands', 'Mattresses'],
        'Dining Room': ['Dining Tables', 'Dining Chairs', 'Buffets', 'Bar Cabinets'],
        'Kitchen': ['Kitchen Islands', 'Bar Stools', 'Storage Units', 'Cabinets'],
        'Bathroom': ['Vanities', 'Mirrors', 'Storage Units', 'Accessories'],
        'Outdoor': ['Garden Furniture', 'Planters', 'Decor', 'Lighting'],
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
        const { name, value, type } = e.target;
        
        // Handle checkbox separately since it needs special handling for boolean values
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked
            }));
            return;
        }
        
        // Handle number inputs
        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : Number(value)
            }));
            return;
        }

        // Handle all other inputs (including select elements)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const images: string[] = [];
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${i}.${fileExt}`;
                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);

                if (uploadError) {
                    toast.error(`Error uploading image ${i + 1}`);
                    console.error(uploadError);
                } else if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(fileName);
                    images.push(publicUrl);
                }
            }
        }

        const productData = {
            ...formData,
            prodId: formData.prodId || `PROD-${Date.now()}`,
            prodImages: images
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
                prodBrand: 'Black Gold',
                prodStatus: true
            });
            setSelectedFiles(null);
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
                            placeholder="SKU"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="prodCollection"
                            value={formData.prodCollection || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Collection</option>
                            {collections.map(collection => (
                                <option key={collection} value={collection}>{collection}</option>
                            ))}
                        </select>
                        <select
                            name="prodSubcategory"
                            value={formData.prodSubcategory || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            disabled={!formData.prodCollection}
                        >
                            <option value="">Select Subcategory</option>
                            {formData.prodCollection && subCategories[formData.prodCollection as keyof typeof subCategories].map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color Options */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Color Options</h3>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <select
                                key={num}
                                name={`prodColor${num}`}
                                value={formData[`prodColor${num}` as keyof Product] || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                style={{
                                    backgroundColor: colors.find(c => c.name === formData[`prodColor${num}` as keyof Product])?.value
                                }}
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
                    </div>

                    {/* Images Upload */}
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
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="prodStatus"
                            checked={formData.prodStatus || false}
                            onChange={handleInputChange}
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
                            {product.prodImages && product.prodImages[0] && (
                                <img
                                    src={product.prodImages[0]}
                                    alt={product.prodName}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                            )}
                            <h4 className="font-semibold">{product.prodName}</h4>
                            <p className="text-sm text-gray-600">Brand: {product.prodBrand || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Collection: {product.prodCollection || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Subcategory: {product.prodSubcategory || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Stock: {String(product.prodPiecestock || 0)} pieces</p>
                            <div className="mt-2 flex gap-2">
                                {[1, 2, 3, 4, 5].map(num => {
                                    const colorName = product[`prodColor${num}` as keyof Product];
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
