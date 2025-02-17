
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

type UserRole = 'business_owner' | 'catalog_manager' | 'accounts_manager' | 'sales_manager' | 'inventory_manager' | 'section_inventory_incharge' | 'it_admin' | 'catalog_builder' | 'business_manager';

interface UserPermissions {
  resource: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  custom_permissions?: Record<string, boolean>;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  role: UserRole;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  permissions: UserPermissions[];
  hasPermission: (resource: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  permissions: [],
  hasPermission: () => false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions[]>([]);

  const fetchUserPermissions = async (userId: string) => {
    const { data, error } = await supabase.rpc('get_user_permissions', { user_id: userId });
    if (error) {
      console.error('Error fetching user permissions:', error);
      return;
    }
    // Transform the data to match UserPermissions interface
    const transformedPermissions: UserPermissions[] = data.map((p: any) => ({
      resource: p.resource,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete,
      custom_permissions: p.custom_permissions ? JSON.parse(p.custom_permissions) : {}
    }));
    setPermissions(transformedPermissions);
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }

    // Transform the data to match UserProfile interface
    const transformedProfile: UserProfile = {
      id: data.id,
      full_name: data.full_name,
      role: data.role as UserRole
    };

    setUserProfile(transformedProfile);
    await fetchUserPermissions(userId);
  };

  const hasPermission = (resource: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    const resourcePermissions = permissions.find(p => p.resource === resource);
    if (!resourcePermissions) return false;

    switch (action) {
      case 'view':
        return resourcePermissions.can_view;
      case 'create':
        return resourcePermissions.can_create;
      case 'edit':
        return resourcePermissions.can_edit;
      case 'delete':
        return resourcePermissions.can_delete;
      default:
        return false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setPermissions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, userProfile, permissions, hasPermission, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
