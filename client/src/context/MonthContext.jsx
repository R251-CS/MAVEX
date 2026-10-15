import React, { createContext, useContext, useState } from 'react';

const MonthContext = createContext(null);

export function MonthProvider({ children }) {
  // Default month observed in system screens: 2026-10
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  const value = {
    selectedMonth,
    setSelectedMonth
  };

  return (
    <MonthContext.Provider value={value}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
}
