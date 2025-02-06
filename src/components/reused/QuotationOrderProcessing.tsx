// QuotationOrderProcessing component handles the processing of quotations and orders.
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * QuotationOrderProcessing component is responsible for generating quotes and orders.
 * It uses the Supabase client to interact with the database.
 */
const QuotationOrderProcessing = () => {
    // State variables to store product details, pricing, order ID, and quote ID
    const [productDetails, setProductDetails] = useState('');
    const [pricing, setPricing] = useState('');
    const [orderId, setOrderId] = useState('');
    const [quoteId, setQuoteId] = useState('');

    /**
     * generateQuote method generates a new quote based on the provided product details and pricing.
     * It inserts a new record into the 'Quotes' table in the database and retrieves the generated quote ID.
     * If successful, it calls the generateOrder method to create a new order.
     */
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

    /**
     * generateOrder method generates a new order based on the provided quote ID.
     * It inserts a new record into the 'Orders' table in the database and retrieves the generated order ID.
     * @param {number} quoteId - The ID of the quote to associate with the order.
     */
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
