
import React from 'react';
import { Eye, Send, FileDown, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { CatalogType } from '@/types/catalog';
import type { WhatsAppConfig } from '@/types/whatsapp';

interface CatalogListProps {
  catalogs: CatalogType[];
  workflowConfigs: Map<string, WhatsAppConfig>;
  onView: (catalog: CatalogType) => void;
  onSendToWorkflow: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDownload: (catalogId: string) => void;
  onDelete: (catalogId: string) => void;
}

const CatalogList = ({
  catalogs,
  workflowConfigs,
  onView,
  onSendToWorkflow,
  onDownload,
  onDelete,
}: CatalogListProps) => {
  return (
    <div className="space-y-4">
      {catalogs.map((catalog) => (
        <div key={catalog.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{catalog.name}</h3>
            <p className="text-sm text-gray-500">Type: {catalog.filters.type}</p>
            {workflowConfigs.get(catalog.id)?.status && (
              <p className="text-sm text-blue-500">
                Status: {workflowConfigs.get(catalog.id)?.status}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(catalog)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-catalog-id={catalog.id}
              onClick={onSendToWorkflow}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(catalog.id)}
            >
              <FileDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(catalog.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {catalogs.length === 0 && (
        <p className="text-center text-gray-500">No catalogs saved yet</p>
      )}
    </div>
  );
};

export default CatalogList;
