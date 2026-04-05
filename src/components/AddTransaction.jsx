import React, { useState, useEffect } from 'react';
import { useFinance } from './FinanceContext';

// Notice we accept 'initialData' here!
const AddTransactionModal = ({ isOpen, onClose, initialData }) => {
  const { addTransaction, updateTransaction } = useFinance();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Groceries',
    amount: '',
    type: 'expense'
  });

  // Pre-fill the form if we are editing an existing transaction
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        merchant: '',
        category: 'Groceries',
        amount: '',
        type: 'expense'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If we have initialData, we are EDITING. Otherwise, we are ADDING.
    if (initialData) {
      updateTransaction({ ...formData, amount: parseFloat(formData.amount) });
    } else {
      addTransaction({ ...formData, amount: parseFloat(formData.amount) });
    }
    
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })} className={`flex-1 py-1.5 text-sm font-medium rounded-md cursor-pointer ${formData.type === 'expense' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Expense</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })} className={`flex-1 py-1.5 text-sm font-medium rounded-md cursor-pointer ${formData.type === 'income' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Income</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input type="number" step="0.01" name="amount" required value={formData.amount} onChange={handleChange} placeholder="0.00" className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merchant / Description</label>
            <input type="text" name="merchant" required value={formData.merchant} onChange={handleChange} placeholder="e.g. Amazon, Whole Foods" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer">
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
              <option value="Housing">Housing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm shadow-sm transition-colors cursor-pointer">
              {initialData ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;