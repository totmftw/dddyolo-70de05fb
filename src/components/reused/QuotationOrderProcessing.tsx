import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Quotation {
  id: string;
  customer_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const QuotationOrderProcessing = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*');

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      toast.error('Error fetching quotations');
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Quotations</h2>
      </CardContent>
    </Card>
  );
};

export default QuotationOrderProcessing;
