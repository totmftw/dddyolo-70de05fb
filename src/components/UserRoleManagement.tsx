import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const UserRoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const { data, error } = await supabase
            .from('FeaturePermissions')
            .select('*');
        if (error) console.error('Error fetching roles:', error);
        else setRoles(data);
    };

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
        <div>
            <h2>User Role Management</h2>
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
