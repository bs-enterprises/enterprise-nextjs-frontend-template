'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface LayoutContextType {
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LayoutContext.Provider value={{ activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within LayoutProvider');
  }
  return context;
}
