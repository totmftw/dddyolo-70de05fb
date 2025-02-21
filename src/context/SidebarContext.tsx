
import React, { createContext, useContext, useState } from 'react';

// Define the type for the Sidebar context
interface SidebarContextType {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

// Create a context for the sidebar with a default value
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom hook to use the SidebarContext
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

// SidebarProvider component to manage the sidebar state
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    // Changed initial state to true so sidebar is visible by default
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};
