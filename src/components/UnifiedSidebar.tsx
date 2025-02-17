
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
  Plus,
  Eye,
  LogOut,
  Edit,
  Percent,
  Grid,
  Truck,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';

const UnifiedSidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { signOut, hasPermission } = useAuth();

  const menuItems = [
    { path: '/app', name: 'Dashboard', icon: LayoutDashboard, permission: { resource: 'dashboard', action: 'view' as const } },
    { path: '/app/customers', name: 'Customer Management', icon: Users, permission: { resource: 'customers', action: 'view' as const } },
    { path: '/app/inventory', name: 'Inventory Management', icon: Package, permission: { resource: 'inventory', action: 'view' as const } },
    { path: '/app/shipment', name: 'Shipment Management', icon: Truck, permission: { resource: 'shipment', action: 'view' as const } },
    { path: '/app/sales-opportunities', name: 'Sales Opportunities', icon: Target, permission: { resource: 'sales', action: 'view' as const } },
    { path: '/app/account', name: 'Account Management', icon: Settings, permission: { resource: 'settings', action: 'view' as const } },
    { path: '/app/payments', name: 'Payment Tracking', icon: CreditCard, permission: { resource: 'payments', action: 'view' as const } },
    { path: '/app/roles', name: 'User Role Management', icon: UserCog, permission: { resource: 'roles', action: 'view' as const } },
    { path: '/app/catalog-builder', name: 'Catalog Builder', icon: BookOpen, permission: { resource: 'catalogs', action: 'view' as const } },
    { path: '/app/quantity-discounts', name: 'Quantity Discounts', icon: Percent, permission: { resource: 'products', action: 'view' as const } },
    {
      path: '/app/products',
      name: 'Product Management',
      icon: FileStack,
      permission: { resource: 'products', action: 'view' as const },
      subItems: [
        { path: '/app/products', name: 'Add Product', icon: Plus, permission: { resource: 'products', action: 'create' as const } },
        { path: '/app/products/manage', name: 'Manage Products', icon: Edit, permission: { resource: 'products', action: 'view' as const } },
        { path: '/app/products/view', name: 'View Products', icon: Eye, permission: { resource: 'products', action: 'view' as const } },
        { path: '/app/products/admin', name: 'Product Config', icon: Settings, permission: { resource: 'products', action: 'create' as const } }
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
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Inventory</span>
          </div>
        </div>
        <ul className="mt-6">
          {menuItems.map((item, index) => (
            hasPermission(item.permission.resource, item.permission.action) && (
              <li key={index} className="relative px-6 py-3">
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
                </Link>
                {item.subItems && (
                  <ul className="pl-10 mt-1">
                    {item.subItems.map((subItem, subIndex) => (
                      hasPermission(subItem.permission.resource, subItem.permission.action) && (
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
                      )
                    ))}
                  </ul>
                )}
              </li>
            )
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
