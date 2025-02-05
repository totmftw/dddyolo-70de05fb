import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const QuotationOrderProcessing = () => {
    const [productDetails, setProductDetails] = useState('');
    const [pricing, setPricing] = useState('');
    const [orderId, setOrderId] = useState('');
    const [quoteId, setQuoteId] = useState('');

    const generateQuote = async () => {
        const { data, error } = await supabase
            .from('Quotes')
            .insert([{ product_details: productDetails, pricing }]);
        if (error) console.error('Error generating quote:', error);
        if (data) {
            const quoteId = data[0].id;
            setQuoteId(quoteId);
            await generateOrder(quoteId);
        }
    };

    const generateOrder = async (quoteId) => {
        const { data, error } = await supabase
            .from('Orders')
            .insert([{ quote_id: quoteId, status: 'pending' }]);
        if (error) console.error('Error generating order:', error);
        if (data) {
            const orderId = data[0].id;
            setOrderId(orderId);
        }
    };

    return (
        <div>
            <h2>Quotation & Order Processing</h2>
            <input type="text" value={productDetails} onChange={(e) => setProductDetails(e.target.value)} placeholder="Product Details" />
            <input type="text" value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="Pricing" />
            <button onClick={generateQuote}>Generate Quote</button>
            {quoteId && <p>Quote ID: {quoteId}</p>}
            {orderId && <p>Order ID: {orderId}</p>}
        </div>
    );
};

export default QuotationOrderProcessing;
