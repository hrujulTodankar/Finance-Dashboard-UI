import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

export const CATEGORY_COLORS = {
  'Salary': '#10b981',       // Green
  'Groceries': '#ef4444',    // Red
  'Utilities': '#f97316',    // Orange
  'Entertainment': '#f59e0b',// Yellow/Amber
  'Housing': '#3b82f6',      // Blue
  'Other': '#8b5cf6'         // Purple
};


const MOCK_DB = [
  // February
  { id: 101, date: '2026-02-28', amount: 85000, category: 'Salary', type: 'income', merchant: 'TechCorp Inc.' },
  
  // March
  { id: 102, date: '2026-03-01', amount: 25000, category: 'Housing', type: 'expense', merchant: 'Skyline Apartments' },
  { id: 103, date: '2026-03-05', amount: 4500, category: 'Groceries', type: 'expense', merchant: 'FreshMart' },
  { id: 104, date: '2026-03-10', amount: 1200, category: 'Utilities', type: 'expense', merchant: 'City Water Dept' },
  { id: 105, date: '2026-03-12', amount: 3500, category: 'Utilities', type: 'expense', merchant: 'PowerGrid Co.' },
  { id: 106, date: '2026-03-15', amount: 1500, category: 'Entertainment', type: 'expense', merchant: 'Cineplex Movies' },
  { id: 107, date: '2026-03-18', amount: 3200, category: 'Groceries', type: 'expense', merchant: 'Whole Foods' },
  { id: 108, date: '2026-03-22', amount: 800, category: 'Other', type: 'expense', merchant: 'Uber Rides' },
  { id: 109, date: '2026-03-25', amount: 4500, category: 'Entertainment', type: 'expense', merchant: 'Gourmet Dining' },
  { id: 110, date: '2026-03-28', amount: 85000, category: 'Salary', type: 'income', merchant: 'TechCorp Inc.' },
  { id: 111, date: '2026-03-29', amount: 6500, category: 'Groceries', type: 'expense', merchant: 'SuperStore' },
  { id: 112, date: '2026-03-30', amount: 1800, category: 'Utilities', type: 'expense', merchant: 'Telecom Broadband' },
  
  // April
  { id: 113, date: '2026-04-01', amount: 25000, category: 'Housing', type: 'expense', merchant: 'Skyline Apartments' },
  { id: 114, date: '2026-04-01', amount: 999, category: 'Entertainment', type: 'expense', merchant: 'Netflix Subscription' },
  { id: 115, date: '2026-04-02', amount: 2100, category: 'Groceries', type: 'expense', merchant: 'Local Market' },
  { id: 116, date: '2026-04-05', amount: 1500, category: 'Other', type: 'expense', merchant: 'Pharmacy' },
  { id: 117, date: '2026-04-08', amount: 3800, category: 'Entertainment', type: 'expense', merchant: 'Gaming Store' },
  { id: 118, date: '2026-04-10', amount: 1100, category: 'Other', type: 'expense', merchant: 'Coffee Shop' },
  { id: 119, date: '2026-04-12', amount: 5200, category: 'Groceries', type: 'expense', merchant: 'FreshMart' },
  { id: 120, date: '2026-04-15', amount: 2800, category: 'Utilities', type: 'expense', merchant: 'PowerGrid Co.' },
];

// 2. Create a Mock API Fetch Function
const fetchTransactionsMock = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 90% success rate
      const isSuccess = Math.random() > 0.1; 
      if (isSuccess) {
        resolve([...MOCK_DB]); // Returns a copy of the mock data
      } else {
        reject(new Error("Failed to fetch transactions. Server error."));
      }
    }, 1500); // 1.5 second fake network delay
  });
};

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState('viewer'); 
  
  // 3. Add UI States for the API call
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Apply dark class to the HTML document for Tailwind
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    // Save preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // 4. Trigger the Mock API call when the app loads
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTransactionsMock();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const summaries = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    return { income, expenses, balance };
  }, [transactions]);

  // Optionally, you could also make these async to simulate posting/deleting to a server
  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(txn => txn.id !== id));
  };

  const addTransaction = (newTxn) => {
    if (role !== 'admin') return;
    setTransactions(prev => [{ ...newTxn, id: Date.now() }, ...prev]);
  };

  const updateTransaction = (updatedTxn) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.map(txn => txn.id === updatedTxn.id ? updatedTxn : txn));
  };

  return (
    // Expose the new isLoading and error states
    <FinanceContext.Provider value={{ transactions, role, setRole, summaries, deleteTransaction, addTransaction,updateTransaction,theme,toggleTheme, isLoading, error }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);