
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from "sonner";
import { Plus, Settings } from 'lucide-react';
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
    const [showAddForm, setShowAddForm] = useState(false);
    const isAdmin = userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner';

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const { data, error } = await supabase
                .from('feature_permissions')
                .select('*')
                .order('feature_name');
            
            if (error) {
                console.error('Error fetching permissions:', error);
                toast.error('Failed to load permissions');
                return;
            }

            setPermissions(data || []);
        } catch (err) {
            console.error('Error:', err);
            toast.error('An error occurred while fetching permissions');
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

        try {
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

            if (error) throw error;
            
            toast.success('Feature added successfully');
            setNewFeature('');
            setNewPath('');
            setShowAddForm(false);
            fetchPermissions();
        } catch (err) {
            console.error('Error adding feature:', err);
            toast.error('Failed to add feature');
        }
    };

    const toggleAllPermissions = async (id: string, value: boolean) => {
        if (!isAdmin) {
            toast.error('Only administrators can modify permissions');
            return;
        }

        try {
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

            if (error) throw error;
            
            toast.success('Permissions updated successfully');
            fetchPermissions();
        } catch (err) {
            console.error('Error updating permissions:', err);
            toast.error('Failed to update permissions');
        }
    };

    const togglePermission = async (id: string, field: keyof FeaturePermission, currentValue: boolean) => {
        if (!isAdmin) {
            toast.error('Only administrators can modify permissions');
            return;
        }

        try {
            const { error } = await supabase
                .from('feature_permissions')
                .update({ [field]: !currentValue })
                .eq('id', id);

            if (error) throw error;
            
            toast.success('Permission updated successfully');
            fetchPermissions();
        } catch (err) {
            console.error('Error toggling permission:', err);
            toast.error('Failed to update permission');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Role Management</h2>
                {isAdmin && (
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Role
                    </Button>
                )}
            </div>
            
            {showAddForm && isAdmin && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>
                    <div className="flex gap-4">
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
                        <div className="space-x-2">
                            <Button onClick={addFeature} variant="default">
                                Add Feature
                            </Button>
                            <Button onClick={() => setShowAddForm(false)} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {permissions.map((permission) => (
                    <div 
                        key={permission.id} 
                        className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">{permission.feature_name}</h3>
                                <p className="text-sm text-gray-500">Path: {permission.feature_path}</p>
                            </div>
                            {isAdmin && (
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => toggleAllPermissions(permission.id, true)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Enable All
                                    </Button>
                                    <Button
                                        onClick={() => toggleAllPermissions(permission.id, false)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Disable All
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    );
};

export default UserRoleManagement;
