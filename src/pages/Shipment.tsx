
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Truck, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Shipment {
  id: string;
  shipment_number: string;
  transport_type: 'sea' | 'air' | 'local' | 'courier';
  awb_number?: string;
  sail_date?: string;
  eta?: string;
  status: string;
}

const Shipment = () => {
  const [newShipment, setNewShipment] = useState<Partial<Shipment>>({
    transport_type: 'sea',
    status: 'pending',
    shipment_number: ''  // Initialize with empty string to satisfy TypeScript
  });

  const { data: shipments, isLoading, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleAddShipment = async () => {
    if (!newShipment.shipment_number || !newShipment.transport_type) {
      toast.error('Shipment number and transport type are required');
      return;
    }

    const { error } = await supabase
      .from('shipments')
      .insert([{
        shipment_number: newShipment.shipment_number,
        transport_type: newShipment.transport_type,
        awb_number: newShipment.awb_number,
        status: 'pending'
      }]);

    if (error) {
      toast.error('Error adding shipment');
      return;
    }

    toast.success('Shipment added successfully');
    setNewShipment({
      transport_type: 'sea',
      status: 'pending',
      shipment_number: ''
    });
    refetch();
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6" />
              <CardTitle>Shipment Management</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add New Shipment Form */}
            <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <Input
                placeholder="Shipment Number"
                value={newShipment.shipment_number || ''}
                onChange={(e) => setNewShipment({ ...newShipment, shipment_number: e.target.value })}
              />
              <Select
                value={newShipment.transport_type}
                onValueChange={(value: 'sea' | 'air' | 'local' | 'courier') => 
                  setNewShipment({ ...newShipment, transport_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Transport Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sea">Sea</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="AWB Number"
                value={newShipment.awb_number || ''}
                onChange={(e) => setNewShipment({ ...newShipment, awb_number: e.target.value })}
              />
              <Button onClick={handleAddShipment} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Shipment
              </Button>
            </div>

            {/* Shipments Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment Number</TableHead>
                  <TableHead>Transport Type</TableHead>
                  <TableHead>AWB Number</TableHead>
                  <TableHead>Sail Date</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : shipments?.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.shipment_number}</TableCell>
                    <TableCell className="capitalize">{shipment.transport_type}</TableCell>
                    <TableCell>{shipment.awb_number || '-'}</TableCell>
                    <TableCell>
                      {shipment.sail_date ? format(new Date(shipment.sail_date), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {shipment.eta ? format(new Date(shipment.eta), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell className="capitalize">{shipment.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipment;
