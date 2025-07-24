import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { User, Expense } from '../types';
import { calculateMonthlySpending, calculateCategoryBudgets, getMonthlyTrends, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  currentUser: User;
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, expenses }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthlySpending = calculateMonthlySpending(expenses, currentYear, currentMonth);
  const categoryBudgets = calculateCategoryBudgets(expenses, currentUser.categoryBudgets);
  const monthlyTrends = getMonthlyTrends(expenses, 6);

  const budgetRemaining = currentUser.monthlyBudget - monthlySpending;
  const budgetPercentage = (monthlySpending / currentUser.monthlyBudget) * 100;

  const getCategoryColor = (category: string): string => {
    const colors = {
      'Food & Dining': 'bg-red-500',
      'Transportation': 'bg-blue-500',
      'Entertainment': 'bg-purple-500',
      'Shopping': 'bg-pink-500',
      'Healthcare': 'bg-green-500',
      'Bills & Utilities': 'bg-yellow-500',
      'Travel': 'bg-indigo-500',
      'Education': 'bg-teal-500',
      'Other': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlySpending)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budget Remaining</p>
              <p className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(budgetRemaining)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              budgetRemaining >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {budgetRemaining >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900">{budgetPercentage.toFixed(1)}%</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              budgetPercentage > 80 ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {budgetPercentage > 80 ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-blue-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overall Budget</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(monthlySpending)} / {formatCurrency(currentUser.monthlyBudget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                budgetPercentage > 100 ? 'bg-red-500' : budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Spending</h3>
        <div className="space-y-4">
          {categoryBudgets.map((categoryBudget) => (
            <div key={categoryBudget.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(categoryBudget.category)}`} />
                  <span className="text-sm font-medium text-gray-700">{categoryBudget.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {formatCurrency(categoryBudget.spent)} / {formatCurrency(categoryBudget.budget)}
                  </span>
                  {categoryBudget.percentage > 80 && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    categoryBudget.percentage > 100 ? 'bg-red-500' : 
                    categoryBudget.percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(categoryBudget.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-end h-48">
            {monthlyTrends.map((trend, index) => {
              const maxAmount = Math.max(...monthlyTrends.map(t => t.amount));
              const height = maxAmount > 0 ? (trend.amount / maxAmount) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-8 bg-emerald-500 rounded-t-md transition-all hover:bg-emerald-600"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{trend.month}</p>
                    <p className="text-xs font-medium text-gray-900">{formatCurrency(trend.amount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;