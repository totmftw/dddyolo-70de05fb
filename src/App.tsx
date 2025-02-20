import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import InventoryManagement from './pages/InventoryManagement';
import SalesOpportunities from './pages/SalesOpportunities';
import AccountManagement from './pages/AccountManagement';
import PaymentTracking from './pages/PaymentTracking';
import UserRoleManagement from './components/reused/UserRoleManagement';
import ProductManagement from './pages/ProductManagement';
import ManageProducts from './pages/ManageProducts';
import LiveInventory from './pages/LiveInventory';
import AdminOneLayout from './layouts/AdminOneLayout';
import AuthGuard from './components/AuthGuard';
import SalesOpportunityManagement from './pages/SalesOpportunityManagement';
import QuantityDiscount from './pages/QuantityDiscount';
import ProductConfig from './pages/ProductConfig';
import CollectionConfig from './pages/CollectionConfig';
import CatalogBuilder from './pages/CatalogBuilder';
import Shipment from './pages/Shipment';
import WhatsappConfig from './pages/WhatsappConfig';
import { ThemeProvider } from './theme/ThemeContext';
import { Toaster } from "sonner";
import { SidebarProvider } from './context/SidebarContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LowStockInventory from './pages/LowStockInventory';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <AdminOneLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "customers",
        element: <CustomerManagement />,
      },
      {
        path: "inventory",
        element: <InventoryManagement />,
      },
      {
        path: "shipment",
        element: <Shipment />,
      },
      {
        path: "sales-opportunities",
        element: <SalesOpportunities />,
      },
      {
        path: "account",
        element: <AccountManagement />,
      },
      {
        path: "payments",
        element: <PaymentTracking />,
      },
      {
        path: "roles",
        element: <UserRoleManagement />,
      },
      {
        path: "catalog-builder",
        element: <CatalogBuilder />,
      },
      {
        path: "whatsapp-config",
        element: <WhatsappConfig />,
      },
      {
        path: "products",
        element: <ProductManagement />,
      },
      {
        path: "products/manage",
        element: <ManageProducts />,
      },
      {
        path: "products/view",
        element: <LiveInventory />,
      },
      {
        path: "products/admin",
        element: <ProductConfig />,
      },
      {
        path: "products/collections",
        element: <CollectionConfig />,
      },
      {
        path: "sales-management",
        element: <SalesOpportunityManagement />,
      },
      {
        path: "quantity-discounts",
        element: <QuantityDiscount />,
      },
      {
        path: "inventory/low-stock",
        element: <LowStockInventory />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <Toaster />
            <RouterProvider router={router} />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
