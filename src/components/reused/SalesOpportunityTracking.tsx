import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  customer_id: number;
  title: string;
  status: string;
  value: number;
  created_at: string;
}

const SalesOpportunityTracking = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .select('*');

    if (error) {
      toast.error('Error fetching opportunities');
      return;
    }

    if (data) {
      setOpportunities(data);
    }
  };

  const handleCreate = async (opportunity: Omit<Opportunity, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('sales_opportunities')
      .insert([opportunity]);

    if (error) {
      toast.error('Error creating opportunity');
      return;
    }

    toast.success('Opportunity created successfully');
    fetchOpportunities();
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sales Opportunities</h2>
    </Card>
  );
};

export default SalesOpportunityTracking;
