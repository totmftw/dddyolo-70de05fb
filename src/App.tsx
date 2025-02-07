
import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardGrid from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import CustomerManagement from './pages/CustomerManagement';
import InventoryManagement from './pages/InventoryManagement';
import PaymentTracking from './pages/PaymentTracking';
import UserRoleManagement from './components/reused/UserRoleManagement';
import AccountManagement from './pages/AccountManagement';
import SalesOpportunities from './pages/SalesOpportunities';
import SalesOpportunityManagement from './pages/SalesOpportunityManagement';
import ProductBulkManage from './pages/ProductBulkManage';
import './App.css';
import { SidebarProvider } from './context/SidebarContext';
import UnifiedSidebar from './components/UnifiedSidebar';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="main-content">
              <UnifiedSidebar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<DashboardGrid />} />
                <Route path="/account-management" element={<AccountManagement />} />
                <Route path="/customers" element={<CustomerManagement />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/payments" element={<PaymentTracking />} />
                <Route path="/roles" element={<UserRoleManagement />} />
                <Route path="/sales-opportunities" element={<SalesOpportunities />} />
                <Route path="/sales-opportunity-management" element={<SalesOpportunityManagement />} />
                <Route path="/product-bulk-manage" element={<ProductBulkManage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
