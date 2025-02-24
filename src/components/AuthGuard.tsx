
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
}

const routePermissions: Record<string, { resource: string; action: 'view' | 'create' | 'edit' | 'delete' }> = {
  '/app': { resource: 'dashboard', action: 'view' },
  '/app/customers': { resource: 'customers', action: 'view' },
  '/app/inventory': { resource: 'inventory', action: 'view' },
  '/app/payments': { resource: 'payments', action: 'view' },
  '/app/products': { resource: 'products', action: 'view' },
  '/app/roles': { resource: 'roles', action: 'view' },
  '/app/sales-opportunities': { resource: 'sales', action: 'view' },
  '/app/sales-management': { resource: 'sales', action: 'view' },
  '/app/catalog-builder': { resource: 'catalogs', action: 'view' },
  '/app/dashboard': { resource: 'dashboard', action: 'view' },
  '/app/whatsapp-config': { resource: 'settings', action: 'view' },
  '/app/inventory/low-stock': { resource: 'inventory', action: 'view' },
  '/app/products/manage': { resource: 'products', action: 'view' },
  '/app/products/view': { resource: 'products', action: 'view' },
  '/app/products/admin': { resource: 'products', action: 'view' },
  '/app/products/collections': { resource: 'products', action: 'view' },
  '/app/quantity-discounts': { resource: 'products', action: 'view' },
  '/app/whatsapp-config/customer': { resource: 'settings', action: 'view' }
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, hasPermission, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!session) {
      navigate('/');
      return;
    }

    // IT Admin and Business Owner bypass permission checks
    if (userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner') {
      return;
    }

    // Check if the current route requires specific permissions
    const currentPath = location.pathname;

    // If path is exactly /app, allow access (dashboard)
    if (currentPath === '/app') {
      return;
    }

    const requiredPermission = routePermissions[currentPath];

    if (requiredPermission) {
      const hasAccess = hasPermission(requiredPermission.resource, requiredPermission.action);
      if (!hasAccess) {
        toast.error("You don't have permission to access this page");
        navigate('/app');
      }
    } else {
      // For unregistered routes, check if parent route has permission
      const parentRoute = Object.keys(routePermissions).find(route => 
        currentPath.startsWith(route) && route !== '/app'
      );

      if (parentRoute) {
        const parentPermission = routePermissions[parentRoute];
        const hasAccess = hasPermission(parentPermission.resource, parentPermission.action);
        if (!hasAccess) {
          toast.error("You don't have permission to access this page");
          navigate('/app');
        }
      }
    }
  }, [session, location.pathname, hasPermission, navigate, userProfile]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
