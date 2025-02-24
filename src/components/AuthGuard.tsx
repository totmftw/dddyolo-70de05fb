
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
}

// Map each route to its required permission
const routePermissions: Record<string, { resource: string; action: 'view' | 'create' | 'edit' | 'delete' }> = {
  'app': { resource: 'dashboard', action: 'view' },
  'dashboard': { resource: 'dashboard', action: 'view' },
  'customers': { resource: 'customers', action: 'view' },
  'inventory': { resource: 'inventory', action: 'view' },
  'inventory/low-stock': { resource: 'inventory', action: 'view' },
  'payments': { resource: 'payments', action: 'view' },
  'products': { resource: 'products', action: 'view' },
  'products/manage': { resource: 'products', action: 'view' },
  'products/view': { resource: 'products', action: 'view' },
  'products/admin': { resource: 'products', action: 'view' },
  'products/collections': { resource: 'products', action: 'view' },
  'quantity-discounts': { resource: 'products', action: 'view' },
  'roles': { resource: 'roles', action: 'view' },
  'sales-opportunities': { resource: 'sales', action: 'view' },
  'sales-management': { resource: 'sales', action: 'view' },
  'catalog-builder': { resource: 'catalogs', action: 'view' },
  'whatsapp-config': { resource: 'settings', action: 'view' },
  'whatsapp-config/customer': { resource: 'settings', action: 'view' }
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, hasPermission, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    // Super admin roles bypass all permission checks
    if (userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner') {
      console.log('Super admin access granted');
      return;
    }

    // Get the relative path by removing /app/ prefix
    const relativePath = location.pathname.replace(/^\/app\/?/, '');
    
    // Root path and dashboard access
    if (!relativePath || relativePath === 'dashboard') {
      return;
    }

    // Find matching permission
    const permission = Object.entries(routePermissions).find(([route]) => 
      relativePath.startsWith(route)
    );

    if (permission && !hasPermission(permission[1].resource, permission[1].action)) {
      console.log('Permission denied for:', relativePath);
      toast.error("You don't have permission to access this page");
      navigate('./dashboard');
      return;
    }

  }, [session, location.pathname, hasPermission, navigate, userProfile]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
