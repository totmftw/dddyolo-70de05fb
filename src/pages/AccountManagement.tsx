import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductManagement from '../pages/ProductManagement';
import CustomerManagement from '../pages/CustomerManagement';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState('');
    const [financials, setFinancials] = useState('');
    const [contracts, setContracts] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        const { data, error } = await supabase
            .from('Accounts')
            .select('*');
        if (error) console.error('Error fetching accounts:', error);
        else setAccounts(data);
    };

    const addAccount = async () => {
        const { error } = await supabase
            .from('Accounts')
            .insert([{ account_id: accountId, financials, contracts }]);
        if (error) console.error('Error adding account:', error);
        else {
            fetchAccounts();
            clearFields();
        }
    };

    const clearFields = () => {
        setAccountId('');
        setFinancials('');
        setContracts('');
    };

    return (
        <div>
            <h2>Account Management</h2>
            <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Account ID" />
            <input type="text" value={financials} onChange={(e) => setFinancials(e.target.value)} placeholder="Financials" />
            <input type="text" value={contracts} onChange={(e) => setContracts(e.target.value)} placeholder="Contracts" />
            <button onClick={addAccount}>Add Account</button>
            <div>
                <h3>Account List</h3>
                <ul>
                    {accounts.map((account) => (
                        <li key={account.id}>{account.account_id} - {account.financials}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AccountManagement;
