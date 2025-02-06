import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductManagement from '../pages/ProductManagement';
import CustomerManagement from '../pages/CustomerManagement';

// AccountManagement component handles the management of user accounts.
const AccountManagement = () => {
    // State to hold the list of accounts and form inputs.
    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState('');
    const [financials, setFinancials] = useState('');
    const [contracts, setContracts] = useState('');

    // useEffect hook to fetch accounts when the component mounts.
    useEffect(() => {
        fetchAccounts();
    }, []);

    // Function to fetch accounts from Supabase.
    const fetchAccounts = async () => {
        const { data, error } = await supabase
            .from('Accounts')
            .select('*');
        if (error) console.error('Error fetching accounts:', error);
        else setAccounts(data);
    };

    // Function to add a new account to Supabase.
    const addAccount = async () => {
        const { error } = await supabase
            .from('Accounts')
            .insert([{ account_id: accountId, financials, contracts }]);
        if (error) console.error('Error adding account:', error);
        else {
            fetchAccounts(); // Refresh the list after adding.
            clearFields(); // Clear form fields after adding.
        }
    };

    // Function to clear form fields.
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
