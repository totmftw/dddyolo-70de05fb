import React from 'react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Plus } from 'lucide-react';

interface Quotation {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const QuotationOrderProcessing = () => {
  const [quotations, setQuotations] = React.useState<Quotation[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      toast.error('Error fetching quotations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quotationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: newStatus })
        .eq('id', quotationId);

      if (error) throw error;
      toast.success(`Quotation ${newStatus} successfully`);
      fetchQuotations();
    } catch (error) {
      toast.error('Error updating quotation status');
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <CardTitle>Quotation & Order Processing</CardTitle>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Quotation
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search quotations..."
              className="max-w-sm"
            />
            <select className="border rounded-md px-3 py-2">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div>Loading...</div>
            ) : quotations.length === 0 ? (
              <div>No quotations found</div>
            ) : (
              quotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">Quotation #{quotation.id}</h3>
                    <p className="text-sm text-gray-500">
                      Amount: ${quotation.total_amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {quotation.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {quotation.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusChange(quotation.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusChange(quotation.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationOrderProcessing;
