import React from 'react';
import { useFinance } from './FinanceContext';


const Header = () => {
  const { role, setRole,toggleTheme,theme } = useFinance();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b dark:border-gray-800 border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">F</div>
          <h1 className=" dark:text-white text-2xl font-bold text-gray-950">
            Finance<span className="font-light text-gray-500">Dash</span>
          </h1>
        </div> 
        
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">☀️</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">🌙</span>
          </div>
        
        {/* ROLE SWITCHER */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50 transition-colors duration-300">
          <label htmlFor="role-switcher" className="text-sm font-medium text-gray-600 pl-3 dark:text-white">Simulate Role:</label>
          <select 
            id="role-switcher"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-white dark:bg-indigo-900 text-sm rounded-full px-4 py-1.5 border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 capitalize font-semibold text-gray-900 cursor-pointer"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
      </nav>
    </header>
  );
};

export default Header;