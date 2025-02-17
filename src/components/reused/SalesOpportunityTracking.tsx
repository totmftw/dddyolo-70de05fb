import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  customer_id: number;
  title: string;
  status: string;
  value: number;
  created_at: string;
  updated_at: string;
}

const SalesOpportunityTracking = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_opportunities')
        .select('*');

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      toast.error('Error fetching opportunities');
      console.error('Error:', error);
    }
  };

  const handleCreate = async (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('sales_opportunities')
        .insert([opportunity]);

      if (error) throw error;
      toast.success('Opportunity created successfully');
      fetchOpportunities();
    } catch (error) {
      toast.error('Error creating opportunity');
      console.error('Error:', error);
    }
  };

  return (
    <CardContent>
      <h2 className="text-2xl font-bold mb-4">Sales Opportunities</h2>
    </CardContent>
  );
};

export default SalesOpportunityTracking;
