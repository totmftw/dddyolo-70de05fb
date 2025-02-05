// App component serves as the main entry point for the application.
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React from 'react';
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
import { ThemeProvider } from './theme/ThemeContext';
import './App.css'; // Add any global styles
import { SidebarProvider } from './context/SidebarContext';
import UnifiedSidebar from './components/UnifiedSidebar'; // Import the new UnifiedSidebar component

// Create a new instance of QueryClient to manage data fetching and caching.
const queryClient = new QueryClient();

/**
 * App component is the main entry point for the application.
 * It sets up the theme, query client, and routing for the app.
 * 
 * @returns JSX.Element
 */
const App = () => (
  // Wrap the app with the ThemeProvider to enable theme management.
  <ThemeProvider>
    {/* Wrap the app with the QueryClientProvider to enable data fetching and caching. */}
    <QueryClientProvider client={queryClient}>
      {/* Wrap the app with the TooltipProvider to enable tooltips. */}
      <TooltipProvider>
        {/* Wrap the app with the SidebarProvider to manage sidebar state. */}
        <SidebarProvider>
          {/* Render the Toaster and Sonner components for notifications. */}
          <Toaster />
          <Sonner />
          {/* Set up the BrowserRouter for client-side routing. */}
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            {/* Define the main content area for the app. */}
            <div className="main-content">
              <UnifiedSidebar /> // Integrate the new UnifiedSidebar component
              {/* Define routes for different pages. */}
              <Routes>
                {/* Route for the dashboard grid. */}
                <Route path="/" element={<DashboardGrid />} />
                {/* Route for product management. */}
                <Route path="/products" element={<ProductManagement />} />
                {/* Route for account management. */}
                <Route path="/account-management" element={<AccountManagement />} />
                {/* Route for customer management. */}
                <Route path="/customers" element={<CustomerManagement />} />
                {/* Route for inventory management. */}
                <Route path="/inventory" element={<InventoryManagement />} />
                {/* Route for payment tracking. */}
                <Route path="/payments" element={<PaymentTracking />} />
                {/* Route for user role management. */}
                <Route path="/roles" element={<UserRoleManagement />} />
                {/* Route for sales opportunities. */}
                <Route path="/sales-opportunities" element={<SalesOpportunities />} />
                {/* Route for sales opportunity management. */}
                <Route path="/sales-opportunity-management" element={<SalesOpportunityManagement />} />
                {/* Route for product bulk management. */}
                <Route path="/product-bulk-manage" element={<ProductBulkManage />} />
                {/* Catch-all route for 404 errors. */}
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
