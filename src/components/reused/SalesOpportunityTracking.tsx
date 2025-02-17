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
import { Plus, Target } from 'lucide-react';

interface Opportunity {
  id: string;
  customer_id: string;
  title: string;
  status: 'new' | 'in_progress' | 'won' | 'lost';
  value: number;
  created_at: string;
}

const SalesOpportunityTracking = () => {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([]);
  const [newOpportunity, setNewOpportunity] = React.useState({
    title: '',
    value: 0,
    customer_id: '',
  });

  React.useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching opportunities');
      return;
    }

    setOpportunities(data || []);
  };

  const createOpportunity = async () => {
    if (!newOpportunity.title || !newOpportunity.customer_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = await supabase
      .from('sales_opportunities')
      .insert([{
        ...newOpportunity,
        status: 'new'
      }]);

    if (error) {
      toast.error('Error creating opportunity');
      return;
    }

    toast.success('Opportunity created successfully');
    setNewOpportunity({
      title: '',
      value: 0,
      customer_id: '',
    });
    fetchOpportunities();
  };

  const updateOpportunityStatus = async (id: string, status: 'new' | 'in_progress' | 'won' | 'lost') => {
    const { error } = await supabase
      .from('sales_opportunities')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Error updating opportunity');
      return;
    }

    toast.success('Opportunity updated successfully');
    fetchOpportunities();
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            <CardTitle>Sales Opportunities</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Opportunity Title"
                value={newOpportunity.title}
                onChange={(e) => setNewOpportunity(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Value"
                value={newOpportunity.value}
                onChange={(e) => setNewOpportunity(prev => ({ ...prev, value: Number(e.target.value) }))}
              />
              <Input
                placeholder="Customer ID"
                value={newOpportunity.customer_id}
                onChange={(e) => setNewOpportunity(prev => ({ ...prev, customer_id: e.target.value }))}
              />
            </div>
            <Button onClick={createOpportunity} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Opportunity
            </Button>

            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{opportunity.title}</h3>
                        <p className="text-sm text-gray-500">Value: ${opportunity.value}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={opportunity.status === 'new' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOpportunityStatus(opportunity.id, 'new')}
                        >
                          New
                        </Button>
                        <Button
                          variant={opportunity.status === 'in_progress' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOpportunityStatus(opportunity.id, 'in_progress')}
                        >
                          In Progress
                        </Button>
                        <Button
                          variant={opportunity.status === 'won' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOpportunityStatus(opportunity.id, 'won')}
                        >
                          Won
                        </Button>
                        <Button
                          variant={opportunity.status === 'lost' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateOpportunityStatus(opportunity.id, 'lost')}
                        >
                          Lost
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOpportunityTracking;
