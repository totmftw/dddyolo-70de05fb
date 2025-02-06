// MarketingAutomation component handles marketing automation features.
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useTheme } from '../../context/ThemeContext';

/**
 * MarketingAutomation component is responsible for managing marketing automation campaigns.
 * It allows users to add new campaigns, view existing campaigns, and fetch campaigns from the database.
 */
const MarketingAutomation = () => {
    const { theme } = useTheme();
    // State variables to store campaign data
    const [campaigns, setCampaigns] = useState([]); // Array to store all campaigns
    const [campaignName, setCampaignName] = useState(''); // Input field for campaign name
    const [targetAudience, setTargetAudience] = useState(''); // Input field for target audience
    const [content, setContent] = useState(''); // Input field for campaign content

    /**
     * useEffect hook is used to fetch campaigns from the database when the component mounts.
     */
    useEffect(() => {
        fetchCampaigns();
    }, []);

    /**
     * fetchCampaigns function is used to retrieve all campaigns from the database.
     * It uses the supabase client to query the 'Campaigns' table and fetch all records.
     */
    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('Campaigns')
            .select('*');
        if (error) console.error('Error fetching campaigns:', error);
        else setCampaigns(data);
    };

    /**
     * addCampaign function is used to add a new campaign to the database.
     * It uses the supabase client to insert a new record into the 'Campaigns' table.
     * If the insertion is successful, it fetches the updated campaigns list and clears the input fields.
     */
    const addCampaign = async () => {
        const { error } = await supabase
            .from('Campaigns')
            .insert([{ campaign_name: campaignName, target_audience: targetAudience, content }]);
        if (error) console.error('Error adding campaign:', error);
        else {
            fetchCampaigns();
            clearFields();
        }
    };

    /**
     * clearFields function is used to reset the input fields after adding a new campaign.
     */
    const clearFields = () => {
        setCampaignName('');
        setTargetAudience('');
        setContent('');
    };

    return (
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Marketing Automation</h2>
            <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Campaign Name" />
            <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Target Audience" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Campaign Content" />
            <button onClick={addCampaign}>Add Campaign</button>
            <div>
                <h3>Campaign List</h3>
                <ul>
                    {campaigns.map((campaign) => (
                        <li key={campaign.id}>{campaign.campaign_name} - {campaign.target_audience}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MarketingAutomation;
