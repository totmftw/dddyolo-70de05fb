import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Opportunity {
  id: string;
  lead_name: string;
  status: string;
  assigned_to: string;
  expected_value: number;
  probability: number;
  source: string;
  notes: string;
}

const SalesOpportunityManagement = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [leadName, setLeadName] = useState('');
  const [status, setStatus] = useState('New');
  const [assignedTo, setAssignedTo] = useState('');
  const [expectedValue, setExpectedValue] = useState<number>(0);
  const [probability, setProbability] = useState<number>(50);
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching opportunities",
          description: error.message
        });
      } else {
        setOpportunities(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addOpportunity = async () => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .insert([{
          lead_name: leadName,
          status,
          assigned_to: assignedTo,
          expected_value: expectedValue,
          probability,
          source,
          notes
        }]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error adding opportunity",
          description: error.message
        });
      } else {
        toast({
          title: "Success",
          description: "Opportunity added successfully"
        });
        clearFields();
        fetchOpportunities();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearFields = () => {
    setLeadName('');
    setStatus('New');
    setAssignedTo('');
    setExpectedValue(0);
    setProbability(50);
    setSource('');
    setNotes('');
  };

  return (
    <div className="container px-6 mx-auto">
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lead Name</label>
                <Input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Lead Name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Assigned To"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Value</label>
                <Input
                  type="number"
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(Number(e.target.value))}
                  placeholder="Expected Value"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Probability (%)</label>
                <Input
                  type="number"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  placeholder="Probability"
                  min="0"
                  max="100"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Source"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={addOpportunity}>Add Opportunity</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opportunities List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Lead Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Assigned To</th>
                  <th className="px-6 py-3">Expected Value</th>
                  <th className="px-6 py-3">Probability</th>
                  <th className="px-6 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4">{opportunity.lead_name}</td>
                    <td className="px-6 py-4">{opportunity.status}</td>
                    <td className="px-6 py-4">{opportunity.assigned_to}</td>
                    <td className="px-6 py-4">${opportunity.expected_value}</td>
                    <td className="px-6 py-4">{opportunity.probability}%</td>
                    <td className="px-6 py-4">{opportunity.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOpportunityManagement;
