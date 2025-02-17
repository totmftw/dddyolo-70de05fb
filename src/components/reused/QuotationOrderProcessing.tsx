
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Database } from '../../integrations/supabase/types';

type Quotation = Database['public']['Tables']['quotations']['Row'];

const QuotationOrderProcessing = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const { data: quotationData, error } = await supabase
        .from('quotations')
        .select('*')
        .returns<Quotation[]>();

      if (error) throw error;
      setQuotations(quotationData || []);
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
