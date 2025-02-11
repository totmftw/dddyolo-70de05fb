
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';

// Map routes to required permissions
const routePermissions: Record<string, { resource: string; action: 'view' | 'create' | 'edit' | 'delete' }> = {
  '/dashboard/customers': { resource: 'customers', action: 'view' },
  '/dashboard/inventory': { resource: 'inventory', action: 'view' },
  '/dashboard/payments': { resource: 'payments', action: 'view' },
  '/dashboard/products': { resource: 'products', action: 'view' },
  '/dashboard/products/view': { resource: 'products', action: 'view' },
  '/dashboard/roles': { resource: 'roles', action: 'view' },
  '/dashboard/sales-opportunities': { resource: 'sales', action: 'view' },
  '/dashboard/sales-management': { resource: 'sales', action: 'view' },
  '/dashboard/product-bulk': { resource: 'products', action: 'create' },
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      navigate('/auth');
      return;
    }

    // Check if the current route requires specific permissions
    const currentPath = location.pathname;
    const requiredPermission = routePermissions[currentPath];

    if (requiredPermission) {
      const hasAccess = hasPermission(requiredPermission.resource, requiredPermission.action);
      if (!hasAccess) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page"
        });
        navigate('/dashboard');
      }
    }
  }, [session, location.pathname, hasPermission, navigate]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
