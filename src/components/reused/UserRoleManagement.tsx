
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from "sonner";

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
    const isAdmin = userProfile?.role === 'it_admin';

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
            toast.error('Only IT administrators can add features');
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
                can_create: false,
                can_read: true,
                can_update: false,
                can_delete: false
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
            <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>User Role Management</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage feature permissions within the application.
                {!isAdmin && (
                    <span className="block mt-2 text-yellow-500">
                        Note: Only IT administrators can modify permissions
                    </span>
                )}
            </p>
            
            {isAdmin && (
                <div className="mt-4 flex gap-2">
                    <input 
                        type="text" 
                        value={newFeature} 
                        onChange={(e) => setNewFeature(e.target.value)} 
                        placeholder="Feature Name" 
                        className={`flex-1 py-2 px-4 text-sm text-gray-700 ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
                    />
                    <input 
                        type="text" 
                        value={newPath} 
                        onChange={(e) => setNewPath(e.target.value)} 
                        placeholder="Feature Path" 
                        className={`flex-1 py-2 px-4 text-sm text-gray-700 ${
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
            )}

            <div className="mt-6">
                <h3 className={`text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Feature Permissions
                </h3>
                <div className="space-y-2">
                    {permissions.map((permission) => (
                        <div 
                            key={permission.id} 
                            className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                        >
                            <div className="flex justify-between items-start">
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
                                <button
                                    onClick={() => togglePermission(permission.id, 'is_enabled', Boolean(permission.is_enabled))}
                                    className={`px-3 py-1 text-xs rounded-full ${
                                        permission.is_enabled 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    } ${!isAdmin && 'cursor-not-allowed opacity-70'}`}
                                    disabled={!isAdmin}
                                >
                                    {permission.is_enabled ? 'Enabled' : 'Disabled'}
                                </button>
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
