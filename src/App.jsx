import React, { useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import { useFinance, FinanceProvider } from './components/FinanceContext';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function DashboardApp() {
  const { isLoading, error, theme } = useFinance();

  const muiTheme = useMemo(() => createTheme({
    palette: { mode: theme },
    typography: { fontFamily: 'inherit' }
  }), [theme]);

  if (isLoading) {
    return (
      // UPDATED: A slightly darker, cooler slate background for the loading screen
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:bg-none dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      
      {/* UPDATED: The new slate canvas background that makes the cards pop! */}
      <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-100 to-slate-200 dark:bg-none dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Dashboard />
          <TransactionTable />
        </main>
        
        <footer className='py-6 border-t border-slate-300/50 dark:border-gray-800 bg-transparent dark:bg-gray-900 mt-auto text-center text-sm text-slate-500 dark:text-gray-500'>
            FinanceDash Pro © 2026. Built for evaluation.
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardApp />
    </FinanceProvider>
  );
}