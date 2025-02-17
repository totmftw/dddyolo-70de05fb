import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface Material {
  id: string;
  name: string;
  collection_id: string;
  created_at: string;
  updated_at: string;
}

const AdminProductConfig = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterialName, setNewMaterialName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
	const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchMaterials();
		fetchCollections();
  }, []);

	const fetchCollections = async () => {
		const { data, error } = await supabase
			.from('collections')
			.select('*');

		if (error) {
			toast.error('Error fetching collections');
			return;
		}

		setCollections(data || []);
	};

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*');
  
    if (error) {
      toast.error('Error fetching materials');
      return;
    }
  
    setMaterials(data || []);
  };

  const handleAddMaterial = async () => {
    if (!newMaterialName || !selectedCollection) {
      toast.error('Material name and collection must be selected.');
      return;
    }

    const { data, error } = await supabase
      .from('materials')
      .insert([{ name: newMaterialName, collection_id: selectedCollection }])
      .select();

    if (error) {
      toast.error('Error adding material');
      console.error(error);
      return;
    }

    setMaterials([...materials, data[0]]);
    setNewMaterialName('');
		setSelectedCollection('');
    fetchMaterials();
  };

  const handleDeleteMaterial = async (id: string) => {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting material');
      console.error(error);
      return;
    }

    setMaterials(materials.filter(material => material.id !== id));
    fetchMaterials();
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-2xl font-bold mb-4">Material Management</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="New Material Name"
            value={newMaterialName}
            onChange={(e) => setNewMaterialName(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
					<select
						value={selectedCollection}
						onChange={(e) => setSelectedCollection(e.target.value)}
						className="border rounded px-2 py-1 mr-2"
					>
						<option value="">Select Collection</option>
						{collections.map((collection: any) => (
							<option key={collection.id} value={collection.id}>
								{collection.name}
							</option>
						))}
					</select>
          <button onClick={handleAddMaterial} className="bg-green-500 text-white px-4 py-2 rounded">
            Add Material
          </button>
        </div>

        <ul>
          {materials.map(material => (
            <li key={material.id} className="flex justify-between items-center py-2 border-b">
              {material.name} ({material.collection_id})
              <button onClick={() => handleDeleteMaterial(material.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AdminProductConfig;
