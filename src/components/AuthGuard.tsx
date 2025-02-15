
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
}

const routePermissions: Record<string, { resource: string; action: 'view' | 'create' | 'edit' | 'delete' }> = {
  '/dashboard/customers': { resource: 'customers', action: 'view' },
  '/dashboard/inventory': { resource: 'inventory', action: 'view' },
  '/dashboard/payments': { resource: 'payments', action: 'view' },
  '/dashboard/products': { resource: 'products', action: 'view' },
  '/dashboard/products/view': { resource: 'products', action: 'view' },
  '/dashboard/products/admin': { resource: 'products', action: 'create' },
  '/dashboard/roles': { resource: 'roles', action: 'view' },
  '/dashboard/sales-opportunities': { resource: 'sales', action: 'view' },
  '/dashboard/sales-management': { resource: 'sales', action: 'view' },
  '/dashboard/product-bulk': { resource: 'products', action: 'create' },
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

    // Super Admin (IT Admin) bypass - always has access
    if (userProfile?.role === 'it_admin') {
      return;
    }

    // Check if the current route requires specific permissions
    const currentPath = location.pathname;
    const requiredPermission = routePermissions[currentPath];

    if (requiredPermission) {
      const hasAccess = hasPermission(requiredPermission.resource, requiredPermission.action);
      if (!hasAccess) {
        toast.error("You don't have permission to access this page");
        navigate('/dashboard');
      }
    }
  }, [session, location.pathname, hasPermission, navigate, userProfile]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
