
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
    const checkPermissions = () => {
      if (!session) {
        navigate('/');
        return;
      }

      // Super admin roles bypass all permission checks
      if (userProfile?.role === 'it_admin' || userProfile?.role === 'business_owner') {
        return;
      }

      const currentPath = location.pathname;

      // Special handling for root app path
      if (currentPath === '/app' || currentPath === '/app/dashboard') {
        return;
      }

      // Find the most specific matching route permission
      const matchingRoutes = Object.keys(routePermissions)
        .filter(route => currentPath.startsWith(route))
        .sort((a, b) => b.length - a.length);

      if (matchingRoutes.length > 0) {
        const matchedRoute = matchingRoutes[0];
        const permission = routePermissions[matchedRoute];
        
        const hasAccess = hasPermission(permission.resource, permission.action);
        if (!hasAccess) {
          toast.error("You don't have permission to access this page");
          navigate('/app/dashboard');
        }
      }
    };

    // Add a small delay to ensure the session and userProfile are loaded
    const timer = setTimeout(checkPermissions, 100);
    return () => clearTimeout(timer);
  }, [session, location.pathname, hasPermission, navigate, userProfile]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
