import React, { useState } from 'react';
import { Settings as SettingsIcon, DollarSign, Save, User, Mail } from 'lucide-react';
import { User as UserType, EXPENSE_CATEGORIES } from '../types';
import { storageUtils } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';

interface SettingsProps {
  currentUser: UserType;
  onUserUpdated: (user: UserType) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    monthlyBudget: currentUser.monthlyBudget,
    categoryBudgets: { ...currentUser.categoryBudgets }
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const updatedUser: UserType = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      monthlyBudget: formData.monthlyBudget,
      categoryBudgets: formData.categoryBudgets
    };

    storageUtils.saveUser(updatedUser);
    storageUtils.setCurrentUser(updatedUser);
    onUserUpdated(updatedUser);
    setIsUpdating(false);
  };

  const handleCategoryBudgetChange = (category: string, budget: number) => {
    setFormData({
      ...formData,
      categoryBudgets: {
        ...formData.categoryBudgets,
        [category]: budget
      }
    });
  };

  const resetCategoryBudgets = () => {
    const equalBudget = Math.floor(formData.monthlyBudget / EXPENSE_CATEGORIES.length);
    const newCategoryBudgets = EXPENSE_CATEGORIES.reduce((acc, category) => {
      acc[category] = equalBudget;
      return acc;
    }, {} as Record<string, number>);

    setFormData({
      ...formData,
      categoryBudgets: newCategoryBudgets
    });
  };

  const totalCategoryBudgets = Object.values(formData.categoryBudgets).reduce((sum, budget) => sum + budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Settings</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="number"
                required
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({...formData, monthlyBudget: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Category Budgets</h4>
              <button
                type="button"
                onClick={resetCategoryBudgets}
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Reset to Equal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPENSE_CATEGORIES.map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {category}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.categoryBudgets[category] || 0}
                      onChange={(e) => handleCategoryBudgetChange(category, Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Category Budgets:</span>
                <span className={`text-sm font-medium ${
                  totalCategoryBudgets > formData.monthlyBudget ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(totalCategoryBudgets)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Monthly Budget:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(formData.monthlyBudget)}
                </span>
              </div>
              {totalCategoryBudgets > formData.monthlyBudget && (
                <p className="text-sm text-red-600 mt-2">
                  Category budgets exceed monthly budget by {formatCurrency(totalCategoryBudgets - formData.monthlyBudget)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;