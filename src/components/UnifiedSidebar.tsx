
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  CreditCard,
  UserCog,
  Target,
  FileStack,
  Settings,
  Upload,
  ChevronRight,
  Plus,
  Eye,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';

const UnifiedSidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/customers', name: 'Customer Management', icon: Users },
    { path: '/product-bulk-manage', name: 'Product Bulk Upload', icon: Upload },
    { path: '/inventory', name: 'Inventory Management', icon: Package },
    { path: '/sales-opportunities', name: 'Sales Opportunities', icon: Target },
    { path: '/account-management', name: 'Account Management', icon: Settings },
    { path: '/payments', name: 'Payment Tracking', icon: CreditCard },
    { path: '/roles', name: 'User Role Management', icon: UserCog },
    { path: '/sales-opportunity-management', name: 'Sales Management', icon: ClipboardList },
    {
      path: '/products',
      name: 'Product Management',
      icon: FileStack,
      subItems: [
        { path: '/products', name: 'Add Product', icon: Plus },
        { path: '/products/view', name: 'View Products', icon: Eye }
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <Link to="/" className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
          Admin Dashboard
        </Link>
        <ul className="mt-6">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div className="relative px-6 py-3">
                {isActive(item.path) && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg" />
                )}
                <Link
                  to={item.path}
                  className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                    isActive(item.path)
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-4">{item.name}</span>
                  {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </div>
              {item.subItems && (
                <ul className="pl-10 mt-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="relative py-1">
                      <Link
                        to={subItem.path}
                        className={`inline-flex items-center w-full text-sm transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                          isActive(subItem.path)
                            ? 'text-gray-800 dark:text-gray-100 font-semibold'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4" />
                        <span className="ml-3">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="px-6 my-6">
          <Button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
