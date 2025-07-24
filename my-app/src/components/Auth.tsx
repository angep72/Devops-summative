import React, { useState } from 'react';
import { User, Lock, Mail, DollarSign, PieChart } from 'lucide-react';
import { User as UserType, EXPENSE_CATEGORIES } from '../types';
import { storageUtils } from '../utils/storage';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    monthlyBudget: 2000
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      const user = storageUtils.getUserByEmail(formData.email);
      if (user) {
        storageUtils.setCurrentUser(user);
        onLogin(user);
      } else {
        setError('User not found. Please sign up first.');
      }
    } else {
      // Signup logic
      const existingUser = storageUtils.getUserByEmail(formData.email);
      if (existingUser) {
        setError('User already exists. Please login instead.');
        return;
      }

      const newUser: UserType = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        monthlyBudget: formData.monthlyBudget,
        categoryBudgets: EXPENSE_CATEGORIES.reduce((acc, category) => {
          acc[category] = Math.floor(formData.monthlyBudget / EXPENSE_CATEGORIES.length);
          return acc;
        }, {} as Record<string, number>)
      };

      storageUtils.saveUser(newUser);
      storageUtils.setCurrentUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MoneyFlow</h1>
          <p className="text-gray-600">Personal Expense Tracker</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              !isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="2000"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;