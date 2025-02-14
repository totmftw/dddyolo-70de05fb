
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useTheme } from '../../theme/ThemeContext';
import { toast } from "sonner";

interface FeaturePermission {
    id: string;
    feature_name: string;
    feature_path: string;
    is_enabled: boolean;
    parent_id: string | null;
}

const UserRoleManagement = () => {
    const { theme } = useTheme();
    const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        const { data, error } = await supabase
            .from('feature_permissions')
            .select('*');
        
        if (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to load permissions');
        } else {
            setPermissions(data || []);
        }
    };

    const addFeature = async () => {
        if (!newFeature.trim()) {
            toast.error('Please enter a feature name');
            return;
        }

        const { error } = await supabase
            .from('feature_permissions')
            .insert([{ 
                feature_name: newFeature,
                feature_path: `/dashboard/${newFeature.toLowerCase().replace(/\s+/g, '-')}`,
                is_enabled: true
            }]);

        if (error) {
            console.error('Error adding feature:', error);
            toast.error('Failed to add feature');
        } else {
            toast.success('Feature added successfully');
            setNewFeature('');
            fetchPermissions();
        }
    };

    const toggleFeature = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('feature_permissions')
            .update({ is_enabled: !currentStatus })
            .eq('id', id);

        if (error) {
            console.error('Error toggling feature:', error);
            toast.error('Failed to update feature status');
        } else {
            toast.success('Feature status updated');
            fetchPermissions();
        }
    };

    return (
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}> 
            <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>User Role Management</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage user roles and permissions within the application.
            </p>
            
            <div className="mt-4 flex gap-2">
                <input 
                    type="text" 
                    value={newFeature} 
                    onChange={(e) => setNewFeature(e.target.value)} 
                    placeholder="New Feature" 
                    className={`py-2 px-4 text-sm text-gray-700 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
                />
                <button 
                    onClick={addFeature}
                    className={`py-2 px-4 text-sm text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-700'
                    }`}
                >
                    Add Feature
                </button>
            </div>

            <div className="mt-6">
                <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Existing Features
                </h3>
                <div className="space-y-2">
                    {permissions.map((permission) => (
                        <div 
                            key={permission.id} 
                            className={`flex justify-between items-center p-3 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                        >
                            <div>
                                <p className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                                }`}>
                                    {permission.feature_name}
                                </p>
                                <p className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    Path: {permission.feature_path}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleFeature(permission.id, permission.is_enabled)}
                                className={`px-3 py-1 text-xs rounded-full ${
                                    permission.is_enabled 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {permission.is_enabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserRoleManagement;
