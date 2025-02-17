
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from '../../integrations/supabase/types';

type Opportunity = Database['public']['Tables']['sales_opportunities']['Row'];

const SalesOpportunityTracking = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data: opportunityData, error } = await supabase
        .from('sales_opportunities')
        .select('*')
        .returns<Opportunity[]>();

      if (error) throw error;
      setOpportunities(opportunityData || []);
    } catch (error) {
      toast.error('Error fetching opportunities');
      console.error('Error:', error);
    }
  };

  const handleCreate = async (opportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('sales_opportunities')
        .insert([opportunity])
        .returns<Opportunity>();

      if (error) throw error;
      toast.success('Opportunity created successfully');
      fetchOpportunities();
    } catch (error) {
      toast.error('Error creating opportunity');
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Sales Opportunities</h2>
      </CardContent>
    </Card>
  );
};

export default SalesOpportunityTracking;
