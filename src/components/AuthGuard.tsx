
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
    if (!session) {
      navigate('/');
      return;
    }

    // Super admin roles bypass permission checks
    if (userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner') {
      return;
    }

    const currentPath = location.pathname;
    
    // If we're at the root app path, allow access
    if (currentPath === '/app') {
      return;
    }

    // First try exact route match
    let permission = routePermissions[currentPath];

    // If no exact match, try to find a parent route
    if (!permission) {
      const parentRoute = Object.keys(routePermissions)
        .filter(route => currentPath.startsWith(route) && route !== '/app')
        .sort((a, b) => b.length - a.length)[0]; // Get the most specific matching route

      if (parentRoute) {
        permission = routePermissions[parentRoute];
      }
    }

    // Only check permissions if we found a matching route
    if (permission) {
      const hasAccess = hasPermission(permission.resource, permission.action);
      if (!hasAccess) {
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
