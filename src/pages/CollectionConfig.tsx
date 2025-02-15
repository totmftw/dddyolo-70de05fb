
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description?: string;
}

const CollectionConfig = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Error fetching collections');
    } else {
      setCollections(data || []);
    }
  };

  const addCollection = async () => {
    if (!newCollectionName) {
      toast.error('Please enter a collection name');
      return;
    }

    const { error } = await supabase
      .from('collections')
      .insert([{ 
        name: newCollectionName,
        description: newCollectionDescription || null
      }]);

    if (error) {
      toast.error('Error adding collection');
    } else {
      toast.success('Collection added successfully');
      setNewCollectionName('');
      setNewCollectionDescription('');
      fetchCollections();
    }
  };

  const deleteCollection = async (id: string) => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting collection');
    } else {
      toast.success('Collection deleted successfully');
      fetchCollections();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Collection Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <Input
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <Input
              placeholder="Collection Description (Optional)"
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
            />
            <Button onClick={addCollection} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
          </div>
          <div className="space-y-2">
            {collections.map((collection) => (
              <div key={collection.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-sm text-gray-600">{collection.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteCollection(collection.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionConfig;
