import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React from 'react';
import Sidebar from './components/Dashboard/Sidebar';
import DashboardGrid from './components/Dashboard/DashboardGrid';
import ProductManagement from './components/ProductManagement';
import CustomerManagement from './components/CustomerManagement';
import InventoryManagement from './components/InventoryManagement';
import PaymentTracking from './components/PaymentTracking';
import UserRoleManagement from './components/UserRoleManagement';
import AccountManagement from './components/AccountManagement';
import './App.css'; // Add any global styles

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardGrid />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/account-management" element={<AccountManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/payments" element={<PaymentTracking />} />
            <Route path="/roles" element={<UserRoleManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
