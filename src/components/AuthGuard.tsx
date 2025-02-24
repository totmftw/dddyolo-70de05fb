
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
}

// Map each route to its required permission
const routePermissions: Record<string, { resource: string; action: 'view' | 'create' | 'edit' | 'delete' }> = {
  '/app': { resource: 'dashboard', action: 'view' },
  '/app/dashboard': { resource: 'dashboard', action: 'view' },
  '/app/customers': { resource: 'customers', action: 'view' },
  '/app/inventory': { resource: 'inventory', action: 'view' },
  '/app/inventory/low-stock': { resource: 'inventory', action: 'view' },
  '/app/payments': { resource: 'payments', action: 'view' },
  '/app/products': { resource: 'products', action: 'view' },
  '/app/products/manage': { resource: 'products', action: 'view' },
  '/app/products/view': { resource: 'products', action: 'view' },
  '/app/products/admin': { resource: 'products', action: 'view' },
  '/app/products/collections': { resource: 'products', action: 'view' },
  '/app/quantity-discounts': { resource: 'products', action: 'view' },
  '/app/roles': { resource: 'roles', action: 'view' },
  '/app/sales-opportunities': { resource: 'sales', action: 'view' },
  '/app/sales-management': { resource: 'sales', action: 'view' },
  '/app/catalog-builder': { resource: 'catalogs', action: 'view' },
  '/app/whatsapp-config': { resource: 'settings', action: 'view' },
  '/app/whatsapp-config/customer': { resource: 'settings', action: 'view' }
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, hasPermission, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for session
    if (!session) {
      navigate('/');
      return;
    }

    // Super admin roles bypass all permission checks
    if (userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner') {
      console.log('Super admin access granted');
      return;
    }

    const currentPath = location.pathname;

    // Root path access
    if (currentPath === '/app' || currentPath === '/app/dashboard') {
      return;
    }

    // Normalize the current path to match the routePermissions format
    const normalizedPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

    // Direct match first
    if (routePermissions[normalizedPath]) {
      const permission = routePermissions[normalizedPath];
      if (!hasPermission(permission.resource, permission.action)) {
        console.log('Direct permission denied for:', normalizedPath);
        toast.error("You don't have permission to access this page");
        navigate('/app/dashboard');
      }
      return;
    }

    // Check parent routes if no direct match
    const parentPath = Object.keys(routePermissions).find(route => 
      normalizedPath.startsWith(route) && route !== '/app'
    );

    if (parentPath) {
      const permission = routePermissions[parentPath];
      if (!hasPermission(permission.resource, permission.action)) {
        console.log('Parent route permission denied for:', normalizedPath);
        toast.error("You don't have permission to access this page");
        navigate('/app/dashboard');
      }
    }

  }, [session, location.pathname, hasPermission, navigate, userProfile]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
