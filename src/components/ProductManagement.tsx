import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) console.error('Error fetching products:', error);
        else setProducts(data);
    };

    const addProduct = async () => {
        const { error } = await supabase
            .from('products')
            .insert([{ name, sku, category, stock }]);
        if (error) console.error('Error adding product:', error);
        else fetchProducts();
    };

    return (
        <div>
            <h2>Product Management</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} placeholder="Stock Level" />
            <button onClick={addProduct}>Add Product</button>
            <div>
                <h3>Product List</h3>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>{product.name} - SKU: {product.sku}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductManagement;
