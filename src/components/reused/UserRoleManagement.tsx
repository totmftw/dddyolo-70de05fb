
import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from "sonner";
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../reused/card";

interface Role {
  id: string;
  role_name: string;
  description: string;
  created_at: string;
}

interface RolePermission {
  id: number;
  role_name: string;
  permission_name: string;
  can_create: boolean;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  custom_permissions?: Record<string, any>;
}

interface FeaturePermission {
  id: string;
  feature_name: string;
  feature_path: string;
}

type PermissionAction = 'can_create' | 'can_view' | 'can_edit' | 'can_delete';

const UserRoleManagement = () => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [features, setFeatures] = useState<FeaturePermission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const isAdmin = userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner';

  useEffect(() => {
    fetchRoles();
    fetchFeatures();
    fetchRolePermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      if (data) {
        setRoles(data as Role[]);
      }
    } catch (error) {
      toast.error('Error fetching roles');
      console.error('Error fetching roles:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_permissions')
        .select('id, feature_name, feature_path')
        .order('feature_name');
      
      if (error) throw error;
      if (data) {
        setFeatures(data);
      }
    } catch (error) {
      toast.error('Error fetching features');
      console.error('Error fetching features:', error);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');
      
      if (error) throw error;
      if (data) {
        setRolePermissions(data as RolePermission[]);
      }
    } catch (error) {
      toast.error('Error fetching role permissions');
      console.error('Error fetching role permissions:', error);
    }
  };

  const addRole = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can add roles');
      return;
    }

    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ 
          role_name: newRoleName,
          description: newRoleDescription 
        }]);

      if (error) throw error;
      
      // After adding the role, create default permissions for all features
      const defaultPermissions = features.map(feature => ({
        role_name: newRoleName,
        permission_name: feature.feature_name,
        can_create: false,
        can_view: false,
        can_edit: false,
        can_delete: false
      }));

      const { error: permError } = await supabase
        .from('role_permissions')
        .insert(defaultPermissions);

      if (permError) throw permError;
      
      toast.success('Role added successfully');
      setNewRoleName('');
      setNewRoleDescription('');
      setShowAddForm(false);
      fetchRoles();
      fetchRolePermissions();
    } catch (err) {
      console.error('Error adding role:', err);
      toast.error('Failed to add role');
    }
  };

  const handlePermissionToggle = async (roleName: string, featureName: string, action: PermissionAction) => {
    if (!isAdmin) {
      toast.error('Only administrators can modify permissions');
      return;
    }

    // Bypass permission changes for protected roles
    if (roleName === 'it_admin' || roleName === 'business_owner') {
      toast.info('Permissions for IT Admin and Business Owner roles cannot be modified');
      return;
    }

    try {
      const existingPermission = rolePermissions.find(
        rp => rp.role_name === roleName && rp.permission_name === featureName
      );

      if (existingPermission) {
        const { error } = await supabase
          .from('role_permissions')
          .update({ 
            [action]: !existingPermission[action] 
          })
          .eq('role_name', roleName)
          .eq('permission_name', featureName);

        if (error) throw error;
      } else {
        const newPermission = {
          role_name: roleName,
          permission_name: featureName,
          can_create: action === 'can_create',
          can_view: action === 'can_view',
          can_edit: action === 'can_edit',
          can_delete: action === 'can_delete'
        };

        const { error } = await supabase
          .from('role_permissions')
          .insert([newPermission]);

        if (error) throw error;
      }

      toast.success('Permission updated successfully');
      await fetchRolePermissions();
    } catch (err) {
      console.error('Error updating permission:', err);
      toast.error('Failed to update permission');
    }
  };

  const getRolePermission = (roleName: string, featureName: string): RolePermission | undefined => {
    // For it_admin and business_owner, always return full permissions
    if (roleName === 'it_admin' || roleName === 'business_owner') {
      return {
        id: 0,
        role_name: roleName,
        permission_name: featureName,
        can_create: true,
        can_view: true,
        can_edit: true,
        can_delete: true
      };
    }

    return rolePermissions.find(
      rp => rp.role_name === roleName && rp.permission_name === featureName
    );
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Role Management</CardTitle>
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
        </CardHeader>
        <CardContent>
          {showAddForm && isAdmin && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4">Add New Role</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Role Name"
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Role Description"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addRole}>
                    Add Role
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {roles.map(role => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{role.role_name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRoleId(selectedRoleId === role.id ? null : role.id)}
                  >
                    {selectedRoleId === role.id ? 'Hide Permissions' : 'Edit Permissions'}
                  </Button>
                </div>

                {selectedRoleId === role.id && (
                  <div className="grid gap-4">
                    {features.map(feature => (
                      <div key={feature.id} className="border rounded p-4">
                        <h4 className="font-medium mb-2">{feature.feature_name}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['can_create', 'can_view', 'can_edit', 'can_delete'].map(action => {
                            const permission = getRolePermission(role.role_name, feature.feature_name);
                            const isChecked = permission ? permission[action as PermissionAction] : false;
                            
                            return (
                              <label key={action} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handlePermissionToggle(
                                    role.role_name, 
                                    feature.feature_name, 
                                    action as PermissionAction
                                  )}
                                  disabled={!isAdmin || role.role_name === 'it_admin' || role.role_name === 'business_owner'}
                                  className="form-checkbox h-4 w-4"
                                />
                                <span className="text-sm capitalize">
                                  {action.replace('can_', '')}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManagement;
