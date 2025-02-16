
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ViewProducts from './pages/ViewProducts';
import NotFound from './pages/NotFound';
import AdminOneLayout from './layouts/AdminOneLayout';
import AuthGuard from './components/AuthGuard';
import SalesOpportunityManagement from './pages/SalesOpportunityManagement';
import QuantityDiscount from './pages/QuantityDiscount';
import ProductConfig from './pages/ProductConfig';
import CollectionConfig from './pages/CollectionConfig';
import CatalogBuilder from './pages/CatalogBuilder';
import { ThemeProvider } from './theme/ThemeContext';
import { Toaster } from "sonner";
import { SidebarProvider } from './context/SidebarContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <AdminOneLayout />
                    </AuthGuard>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="sales-opportunities" element={<SalesOpportunities />} />
                  <Route path="account" element={<AccountManagement />} />
                  <Route path="payments" element={<PaymentTracking />} />
                  <Route path="roles" element={<UserRoleManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="products/manage" element={<ManageProducts />} />
                  <Route path="products/view" element={<ViewProducts />} />
                  <Route path="products/admin" element={<ProductConfig />} />
                  <Route path="products/collections" element={<CollectionConfig />} />
                  <Route path="catalog-builder" element={<CatalogBuilder />} />
                  <Route path="sales-management" element={<SalesOpportunityManagement />} />
                  <Route path="quantity-discounts" element={<QuantityDiscount />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
