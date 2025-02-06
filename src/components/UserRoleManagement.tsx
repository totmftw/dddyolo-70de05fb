// UserRoleManagement component manages user roles and permissions.
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * UserRoleManagement component is responsible for managing user roles and permissions.
 * It fetches existing roles from the database, allows adding new roles, and displays the list of existing roles.
 */
const UserRoleManagement = () => {
    // State to store the list of existing roles
    const [roles, setRoles] = useState([]);
    
    // State to store the new role to be added
    const [newRole, setNewRole] = useState('');

    /**
     * Effect hook to fetch existing roles from the database when the component mounts.
     */
    useEffect(() => {
        fetchRoles();
    }, []);

    /**
     * Fetches existing roles from the 'FeaturePermissions' table in the database.
     * Updates the 'roles' state with the fetched data.
     */
    const fetchRoles = async () => {
        const { data, error } = await supabase
            .from('FeaturePermissions')
            .select('*');
        if (error) console.error('Error fetching roles:', error);
        else setRoles(data);
    };

    /**
     * Adds a new role to the 'FeaturePermissions' table in the database.
     * Updates the 'roles' state by refetching the existing roles.
     * Resets the 'newRole' state to an empty string.
     */
    const addRole = async () => {
        const { error } = await supabase
            .from('FeaturePermissions')
            .insert([{ feature_name: newRole }]);
        if (error) console.error('Error adding role:', error);
        else {
            fetchRoles();
            setNewRole('');
        }
    };

    return (
        <div className="user-role-management">
            <h2>User Role Management</h2>
            <p>Manage user roles and permissions within the application.</p>
            <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="New Role" />
            <button onClick={addRole}>Add Role</button>
            <div>
                <h3>Existing Roles</h3>
                <ul>
                    {roles.map((role) => (
                        <li key={role.id}>{role.feature_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserRoleManagement;
