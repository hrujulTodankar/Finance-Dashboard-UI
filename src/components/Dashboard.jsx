import React, { useMemo } from 'react';
import { useFinance, CATEGORY_COLORS } from './FinanceContext';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { PieChart } from '@mui/x-charts/PieChart';
import { Alert, AlertTitle, Button } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

// UPDATED: Added from-white to-indigo-50/50 gradient and indigo border!
const Card = ({ title, value, change }) => (
  <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:bg-none dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-indigo-50 dark:border-gray-700 flex flex-col gap-1 transition-all duration-300">
    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
    <div className="text-3xl font-bold text-gray-950 dark:text-white">{value}</div>
    {change && <div className={`text-sm ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{change}</div>}
  </div>
);

const Dashboard = () => {
  const { summaries, transactions, theme } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    const highestCategory = Object.keys(categoryTotals).length > 0 
      ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
      : 'N/A';

    const expensesByMonth = expenses.reduce((acc, curr) => {
      const month = curr.date.substring(0, 7); 
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});
    
    const sortedMonths = Object.keys(expensesByMonth).sort();
    let monthlyComparison = "Add more months of data to see trends.";
    
    if (sortedMonths.length >= 2) {
      const currentMonthTotal = expensesByMonth[sortedMonths[sortedMonths.length - 1]];
      const previousMonthTotal = expensesByMonth[sortedMonths[sortedMonths.length - 2]];
      
      const diff = currentMonthTotal - previousMonthTotal;
      const percentChange = ((Math.abs(diff) / previousMonthTotal) * 100).toFixed(1);
      
      if (diff > 0) {
         monthlyComparison = `Expenses are up by ${percentChange}% compared to last month.`;
      } else {
         monthlyComparison = `Great job! Expenses dropped by ${percentChange}% compared to last month.`;
      }
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    let observation = "Keep tracking your expenses to find savings opportunities.";
    if (totalIncome > 0) {
       const savingsRate = (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1);
       if (savingsRate > 0) {
           observation = `You are currently saving a healthy ${savingsRate}% of your total income.`;
       } else {
           observation = `You are currently spending more than you earn. Review your budget!`;
       }
    }

    return { highestCategory, monthlyComparison, observation };
  }, [transactions]);

  const trendData = useMemo(() => {
    let currentBalance = 0;
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.map(t => {
      currentBalance += (t.type === 'income' ? t.amount : -t.amount);
      return {
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: currentBalance
      };
    });
  }, [transactions]);

  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.entries(totals).map(([label, value]) => ({ 
      id: label.toLowerCase().replace(/\s+/g, '-'), 
      label: label, 
      value: value,
      color: CATEGORY_COLORS[label] || '#9ca3af'
    }));
  }, [transactions]);

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e0e7ff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Balance" value={formatCurrency(summaries.balance)} />
        <Card title="Monthly Income" value={formatCurrency(summaries.income)} change="+12.5% vs last month" />
        <Card title="Monthly Expenses" value={formatCurrency(summaries.expenses)} change="-3.1% vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* UPDATED: Added gradient to Line Chart container */}
        <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:bg-none dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-indigo-50 dark:border-gray-700 h-96 flex flex-col transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">Balance Trend</h3>
          <div className="flex-grow w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#f3f4f6'} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), 'Balance']} />
                <Area type="natural" dataKey="balance" stroke="#3b82f6" strokeWidth={3} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UPDATED: Added gradient to Pie Chart container */}
        <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:bg-none dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-indigo-50 dark:border-gray-700 h-96 flex flex-col transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">Expense Breakdown</h3>
          <div className="flex-grow w-full h-full flex items-center justify-center">
            {expenseData.length === 0 ? (
              <div className="text-gray-400">No expense data available</div>
            ) : (
              <PieChart
                series={[{
                  data: expenseData,
                  valueFormatter: (item) => formatCurrency(item.value),
                  innerRadius: 60, outerRadius: 90, paddingAngle: 2, cornerRadius: 4,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  highlighted: { additionalRadius: 10 },
                  faded: { innerRadius: 30, additionalRadius: -10, color: theme === 'dark' ? '#374151' : 'gray' },
                }]}
                margin={{ top: 20, bottom: 20, left: 20, right: 140 }}
                slotProps={{ legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' }, padding: -20 } }}
              />
            )}
          </div>
        </div>
      </div>

      <Alert 
        icon={<InsightsIcon fontSize="inherit" sx={{ mt: 0.5 }} />} 
        severity="info" 
        sx={{ 
          borderRadius: '12px', 
          alignItems: 'flex-start',
          backgroundColor: theme === 'dark' ? '#1e3a8a' : '#eff6ff', 
          color: theme === 'dark' ? '#eff6ff' : '#1e3a8a'
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold', mb: 1.5, fontSize: '1rem' }}>Smart Financial Insights</AlertTitle>
        {insights ? (
          <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base">
            <li><strong>Highest Spend:</strong> Your highest spending category is <span className="font-semibold">{insights.highestCategory}</span>.</li>
            <li><strong>Trend:</strong> {insights.monthlyComparison}</li>
            <li><strong>Observation:</strong> {insights.observation}</li>
          </ul>
        ) : (
          <p>Add some transactions to generate insights!</p>
        )}
      </Alert>

    </div>
  );
};

export default Dashboard;