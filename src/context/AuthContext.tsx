
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

type UserRole = 'business_owner' | 'catalog_builder' | 'sales_manager' | 'business_manager' | 'it_admin';

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
    setPermissions(data);
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

    setUserProfile(data);
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
