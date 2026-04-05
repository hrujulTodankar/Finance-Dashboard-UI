import React, { useState, useMemo } from 'react';
import { useFinance, CATEGORY_COLORS } from './FinanceContext';
import AddTransactionModal from './AddTransaction';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
};

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const TransactionTable = () => {
  const { transactions, role, deleteTransaction } = useFinance();
  
  // --- STATE ---
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); // Tracks what you type!
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  // --- LOGIC ---
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions]);

  // THIS IS THE BRAINS: It filters instantly as you type.
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Dropdown filter check
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      
      // 2. Search bar check (looks at Merchant, Category, and Amount)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        t.merchant.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [transactions, filterCategory, searchTerm]); // Tells React to update if ANY of these change

  // --- HANDLERS ---
  const handleOpenEdit = (txn) => {
    setEditingTxn(txn);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTxn(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-4 relative">
      
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={editingTxn} 
      />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
        
        {/* HEADER CONTROLS */}
        <div className="bg-gradient-to-br from-white to-indigo-100 dark:bg-none dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-indigo-100 dark:border-gray-700 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-gray-950 dark:text-white">Recent Transactions</h3>
          
          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            
            {/* ENHANCED: Instant Search Bar with Clear Button */}
            <div className="relative flex-grow md:flex-grow-0 min-w-[200px] md:min-w-[250px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                type="text" 
                placeholder="Type to search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 text-sm rounded-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-600 font-medium text-gray-700 dark:text-gray-200 outline-none transition-colors duration-300"
              />
              {/* CLEAR BUTTON: Only shows up if you have typed something */}
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white dark:bg-gray-900 text-sm rounded-full px-4 py-2 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-600 font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer transition-colors duration-300"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {/* Add Button */}
            {role === 'admin' && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                + Add Transaction
              </button>
            )}
          </div>
        </div>

        {/* TABLE OR EMPTY STATE */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-300">
             No transactions found matching <span className="font-semibold">"{searchTerm || filterCategory}"</span>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className='border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300'>
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  {role === 'admin' && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(txn => (
                  <tr key={txn.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{formatDate(txn.date)}</td>
                    <td className="px-4 py-4 font-medium text-gray-950 dark:text-white">{txn.merchant}</td>
                    <td className="px-4 py-4">
                      <span className='px-3 py-1 rounded-full font-medium text-xs border border-transparent dark:border-gray-600/50' style={{ backgroundColor: `${CATEGORY_COLORS[txn.category] || '#9ca3af'}20`, color: CATEGORY_COLORS[txn.category] || '#4b5563' }}>
                        {txn.category}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-right font-bold ${txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-950 dark:text-white'}`}>
                      {txn.type === 'expense' ? '-' : '+'}{formatCurrency(txn.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-4 text-right space-x-3">
                        <button onClick={() => handleOpenEdit(txn)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer transition-colors">Edit</button>
                        <button onClick={() => deleteTransaction(txn.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium cursor-pointer transition-colors">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;