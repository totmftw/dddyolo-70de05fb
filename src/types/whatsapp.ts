
export interface WhatsAppConfig {
  id: number;
  catalog_id?: string;
  status?: 'pending' | 'sent' | 'delivered' | 'failed';
  api_key: string;
  template_name: string;
  template_namespace: string;
  from_phone_number_id: string;
  is_active: boolean;
  updated_at: string;
}
