import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Quotation {
  id: string;
  customer_id: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const QuotationOrderProcessing = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from('quotations')
      .select('*');

    if (error) {
      toast.error('Error fetching quotations');
      return;
    }

    if (data) {
      setQuotations(data);
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
