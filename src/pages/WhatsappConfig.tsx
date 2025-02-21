import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import { MessageSquare, Users } from 'lucide-react';

interface WhatsappConfig {
  id: number;
  api_key: string;
  from_phone_number_id: string;
  template_namespace: string;
  template_name: string;
  is_active: boolean;
}

const WhatsappConfig = () => {
  const [config, setConfig] = useState<WhatsappConfig>({
    id: 0,
    api_key: '',
    from_phone_number_id: '',
    template_namespace: '',
    template_name: '',
    is_active: true
  });

  const { data: existingConfig, refetch } = useQuery({
    queryKey: ['whatsappConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
    }
  }, [existingConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .upsert({
          ...config,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('WhatsApp configuration saved successfully');
      refetch();
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save WhatsApp configuration');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-2xl font-bold">WhatsApp Configuration</h1>
        </div>
        <Link to="/app/whatsapp-config/customer">
          <Button className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Configuration
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            type="text"
            value={config.api_key}
            onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
            placeholder="Enter WhatsApp API Key"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">From Phone Number ID</label>
          <Input
            type="text"
            value={config.from_phone_number_id}
            onChange={(e) => setConfig({ ...config, from_phone_number_id: e.target.value })}
            placeholder="Enter phone number ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Template Namespace</label>
          <Input
            type="text"
            value={config.template_namespace}
            onChange={(e) => setConfig({ ...config, template_namespace: e.target.value })}
            placeholder="Enter template namespace"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Template Name</label>
          <Input
            type="text"
            value={config.template_name}
            onChange={(e) => setConfig({ ...config, template_name: e.target.value })}
            placeholder="Enter template name"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={config.is_active}
            onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        <Button type="submit">Save Configuration</Button>
      </form>
    </div>
  );
};

export default WhatsappConfig;
