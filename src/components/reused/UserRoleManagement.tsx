import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FeaturePermission {
    id: string;
    feature_name: string;
    feature_path: string;
    is_enabled: boolean;
    parent_id: string | null;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

const UserRoleManagement = () => {
    const { theme } = useTheme();
    const { userProfile } = useAuth();
    const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
    const [newFeature, setNewFeature] = useState('');
    const [newPath, setNewPath] = useState('');
    const isAdmin = userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner';

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        const { data, error } = await supabase
            .from('feature_permissions')
            .select('*')
            .order('feature_name');
        
        if (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to load permissions');
        } else {
            setPermissions(data || []);
        }
    };

    const addFeature = async () => {
        if (!isAdmin) {
            toast.error('Only administrators can add features');
            return;
        }

        if (!newFeature.trim() || !newPath.trim()) {
            toast.error('Please enter both feature name and path');
            return;
        }

        const { error } = await supabase
            .from('feature_permissions')
            .insert([{ 
                feature_name: newFeature,
                feature_path: newPath,
                is_enabled: true,
                can_create: true,
                can_read: true,
                can_update: true,
                can_delete: true
            }]);

        if (error) {
            console.error('Error adding feature:', error);
            toast.error('Failed to add feature');
        } else {
            toast.success('Feature added successfully');
            setNewFeature('');
            setNewPath('');
            fetchPermissions();
        }
    };

    const toggleAllPermissions = async (id: string, value: boolean) => {
        if (!isAdmin) {
            toast.error('Only administrators can modify permissions');
            return;
        }

        const { error } = await supabase
            .from('feature_permissions')
            .update({
                can_create: value,
                can_read: value,
                can_update: value,
                can_delete: value,
                is_enabled: value
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating permissions:', error);
            toast.error('Failed to update permissions');
        } else {
            toast.success('Permissions updated successfully');
            fetchPermissions();
        }
    };

    const togglePermission = async (id: string, field: keyof FeaturePermission, currentValue: boolean) => {
        if (!isAdmin) {
            toast.error('Only IT administrators can modify permissions');
            return;
        }

        const { error } = await supabase
            .from('feature_permissions')
            .update({ [field]: !currentValue })
            .eq('id', id);

        if (error) {
            console.error('Error toggling permission:', error);
            toast.error('Failed to update permission');
        } else {
            toast.success('Permission updated successfully');
            fetchPermissions();
        }
    };

    return (
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>User Role Management</h2>
                {isAdmin && (
                    <Button
                        onClick={() => setNewFeature('')}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Role
                    </Button>
                )}
            </div>
            
            {isAdmin && (
                <div className="mt-4 flex gap-2">
                    <Input 
                        type="text" 
                        value={newFeature} 
                        onChange={(e) => setNewFeature(e.target.value)} 
                        placeholder="Feature Name" 
                        className="flex-1"
                    />
                    <Input 
                        type="text" 
                        value={newPath} 
                        onChange={(e) => setNewPath(e.target.value)} 
                        placeholder="Feature Path" 
                        className="flex-1"
                    />
                    <Button onClick={addFeature}>
                        Add Feature
                    </Button>
                </div>
            )}

            <div className="mt-6">
                <div className="space-y-2">
                    {permissions.map((permission) => (
                        <div 
                            key={permission.id} 
                            className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className={`font-medium ${
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
                                {isAdmin && (
                                    <Button
                                        variant="outline"
                                        onClick={() => toggleAllPermissions(permission.id, true)}
                                    >
                                        Enable All
                                    </Button>
                                )}
                            </div>
                            <div className="mt-3 flex gap-4">
                                {['read', 'create', 'update', 'delete'].map((action) => {
                                    const permissionKey = `can_${action}` as keyof FeaturePermission;
                                    return (
                                        <label
                                            key={action}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={Boolean(permission[permissionKey])}
                                                onChange={() => togglePermission(
                                                    permission.id,
                                                    permissionKey,
                                                    Boolean(permission[permissionKey])
                                                )}
                                                disabled={!isAdmin}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm capitalize">{action}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserRoleManagement;
