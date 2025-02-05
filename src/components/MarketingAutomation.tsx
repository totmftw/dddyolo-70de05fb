import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MarketingAutomation = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        const { data, error } = await supabase
            .from('Campaigns')
            .select('*');
        if (error) console.error('Error fetching campaigns:', error);
        else setCampaigns(data);
    };

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

    const clearFields = () => {
        setCampaignName('');
        setTargetAudience('');
        setContent('');
    };

    return (
        <div>
            <h2>Marketing Automation</h2>
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
