
import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import Auth from './pages/Auth';
import NotFound from "./pages/NotFound";
import DashboardGrid from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import ManageProducts from './pages/ManageProducts';
import ViewProducts from './pages/ViewProducts';
import CustomerManagement from './pages/CustomerManagement';
import InventoryManagement from './pages/InventoryManagement';
import PaymentTracking from './pages/PaymentTracking';
import UserRoleManagement from './components/reused/UserRoleManagement';
import AccountManagement from './pages/AccountManagement';
import SalesOpportunities from './pages/SalesOpportunities';
import SalesOpportunityManagement from './pages/SalesOpportunityManagement';
import { SidebarProvider } from './context/SidebarContext';
import UnifiedSidebar from './components/UnifiedSidebar';
import QuantityDiscount from './pages/QuantityDiscount';
import './App.css';

const queryClient = new QueryClient();

const App = () => (
    <ThemeProvider>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <SidebarProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route
                                    path="/dashboard/*"
                                    element={
                                        <AuthGuard>
                                            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                                                <UnifiedSidebar />
                                                <div className="flex flex-col flex-1 overflow-y-auto">
                                                    <main className="h-full pb-16 overflow-y-auto">
                                                        <div className="container px-6 mx-auto">
                                                            <Routes>
                                                                <Route index element={<DashboardGrid />} />
                                                                <Route path="account" element={<AccountManagement />} />
                                                                <Route path="customers" element={<CustomerManagement />} />
                                                                <Route path="inventory" element={<InventoryManagement />} />
                                                                <Route path="payments" element={<PaymentTracking />} />
                                                                <Route path="products" element={<ProductManagement />} />
                                                                <Route path="products/manage" element={<ManageProducts />} />
                                                                <Route path="products/view" element={<ViewProducts />} />
                                                                <Route path="quantity-discounts" element={<QuantityDiscount />} />
                                                                <Route path="roles" element={<UserRoleManagement />} />
                                                                <Route path="sales-opportunities" element={<SalesOpportunities />} />
                                                                <Route path="sales-management" element={<SalesOpportunityManagement />} />
                                                                <Route path="*" element={<NotFound />} />
                                                            </Routes>
                                                        </div>
                                                    </main>
                                                </div>
                                            </div>
                                        </AuthGuard>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </SidebarProvider>
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    </ThemeProvider>
);

export default App;
