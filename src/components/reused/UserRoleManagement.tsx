// UserRoleManagement component manages user roles and permissions.
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import { useTheme } from '../../context/ThemeContext';

/**
 * UserRoleManagement component is responsible for managing user roles and permissions.
 * It fetches existing roles from the database, allows adding new roles, and displays the list of existing roles.
 */
const UserRoleManagement = () => {
    const { theme } = useTheme();
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
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}> 
            <h2 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>User Role Management</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage user roles and permissions within the application.</p>
            <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="New Role" className={`py-2 pl-10 text-sm text-gray-700 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`} />
            <button onClick={addRole} className={`py-2 px-4 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-600'}`}>Add Role</button>
            <div>
                <h3 className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Existing Roles</h3>
                <ul>
                    {roles.map((role) => (
                        <li key={role.id} className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{role.feature_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserRoleManagement;
