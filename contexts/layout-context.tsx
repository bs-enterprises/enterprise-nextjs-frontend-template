'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface LayoutContextType {
  activePage: string;
  setActivePage: (page: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState('');

  return (
    <LayoutContext.Provider value={{ activePage, setActivePage }}>
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
