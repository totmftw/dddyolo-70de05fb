
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/reused/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/reused/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Settings, Clock, Bell, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/reused/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CustomerConfig {
  id: number;
  custBusinessname: string;
  customer_config: {
    pv_category: string | null;
    ptr_category: string | null;
    product_tags: string[];
  } | null;
}

interface WhatsAppRules {
  reminderDays: number[];
  beforeDueDate: boolean;
  afterDueDate: boolean;
  sendTime: string;
  messageTemplate: string;
}

const pvCategories = ['High', 'Medium', 'Low'];
const ptrCategories = ['Good', 'Average', 'Poor'];
const productTags = ['Regular', 'Seasonal', 'Premium', 'Basic'];
const defaultReminderDays = [7, 15, 30];
const reminderTimeOptions = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const WhatsappCustomerConfig = () => {
  const [search, setSearch] = useState('');
  const [filterPV, setFilterPV] = useState<string>('all');
  const [filterPTR, setFilterPTR] = useState<string>('all');
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false);
  const [whatsappRules, setWhatsappRules] = useState<WhatsAppRules>({
    reminderDays: defaultReminderDays,
    beforeDueDate: true,
    afterDueDate: true,
    sendTime: '09:00',
    messageTemplate: 'default_payment_reminder'
  });

  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customer-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customerMaster')
        .select(`
          id,
          custBusinessname,
          customer_config (
            pv_category,
            ptr_category,
            product_tags
          )
        `);
      
      if (error) throw error;
      return data as CustomerConfig[];
    }
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ customerId, field, value }: { customerId: number, field: string, value: string | string[] }) => {
      const { error } = await supabase
        .from('customer_config')
        .upsert({
          customer_id: customerId,
          [field]: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'customer_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-configs'] });
      toast.success('Configuration updated successfully');
    },
    onError: (error) => {
      console.error('Error updating config:', error);
      toast.error('Failed to update configuration');
    }
  });

  const handleUpdateConfig = (customerId: number, field: string, value: string | string[]) => {
    updateConfigMutation.mutate({ customerId, field, value });
  };

  const handleSaveRules = async () => {
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .update({
          reminder_rules: whatsappRules
        })
        .eq('is_active', true);

      if (error) throw error;
      toast.success('WhatsApp rules updated successfully');
      setIsRulesDialogOpen(false);
    } catch (err) {
      console.error('Error saving rules:', err);
      toast.error('Failed to save WhatsApp rules');
    }
  };

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.custBusinessname.toLowerCase().includes(search.toLowerCase());
    const matchesPV = filterPV === 'all' || customer.customer_config?.pv_category === filterPV;
    const matchesPTR = filterPTR === 'all' || customer.customer_config?.ptr_category === filterPTR;
    return matchesSearch && matchesPV && matchesPTR;
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <CardTitle>Customer WhatsApp Configuration</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterPV} onValueChange={setFilterPV}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by PV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All PV Categories</SelectItem>
                  {pvCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPTR} onValueChange={setFilterPTR}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by PTR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All PTR Categories</SelectItem>
                  {ptrCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsRulesDialogOpen(true)}
              >
                <Settings className="h-4 w-4" />
                Configure Rules
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>PV Category</TableHead>
                <TableHead>PTR Category</TableHead>
                <TableHead>Product Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredCustomers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.custBusinessname}</TableCell>
                  <TableCell>
                    <Select
                      value={customer.customer_config?.pv_category || "none"}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'pv_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PV Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Category</SelectItem>
                        {pvCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.customer_config?.ptr_category || "none"}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'ptr_category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PTR Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Category</SelectItem>
                        {ptrCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.customer_config?.product_tags?.[0] || "none"}
                      onValueChange={(value) => handleUpdateConfig(customer.id, 'product_tags', [value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Tags" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Tag</SelectItem>
                        {productTags.map(tag => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRulesDialogOpen} onOpenChange={setIsRulesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure WhatsApp Reminder Rules</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Reminder Schedule</Label>
              <div className="flex items-center gap-4">
                <Checkbox 
                  id="beforeDueDate"
                  checked={whatsappRules.beforeDueDate}
                  onCheckedChange={(checked) => 
                    setWhatsappRules(prev => ({ ...prev, beforeDueDate: checked as boolean }))
                  }
                />
                <Label htmlFor="beforeDueDate">Send reminders before due date</Label>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox 
                  id="afterDueDate"
                  checked={whatsappRules.afterDueDate}
                  onCheckedChange={(checked) => 
                    setWhatsappRules(prev => ({ ...prev, afterDueDate: checked as boolean }))
                  }
                />
                <Label htmlFor="afterDueDate">Send reminders after due date</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Reminder Time</Label>
              <Select 
                value={whatsappRules.sendTime}
                onValueChange={(value) => 
                  setWhatsappRules(prev => ({ ...prev, sendTime: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {reminderTimeOptions.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Message Template</Label>
              <Select 
                value={whatsappRules.messageTemplate}
                onValueChange={(value) => 
                  setWhatsappRules(prev => ({ ...prev, messageTemplate: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default_payment_reminder">Default Payment Reminder</SelectItem>
                  <SelectItem value="urgent_payment_reminder">Urgent Payment Reminder</SelectItem>
                  <SelectItem value="friendly_reminder">Friendly Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRulesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRules} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Save Rules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsappCustomerConfig;
