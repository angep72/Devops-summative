import { Expense, CategoryBudget } from '../types';

export const calculateMonthlySpending = (expenses: Expense[], year: number, month: number): number => {
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateCategorySpending = (expenses: Expense[], category: string, year: number, month: number): number => {
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expense.category === category && 
             expenseDate.getFullYear() === year && 
             expenseDate.getMonth() === month;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateCategoryBudgets = (expenses: Expense[], categoryBudgets: Record<string, number>): CategoryBudget[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return Object.entries(categoryBudgets).map(([category, budget]) => {
    const spent = calculateCategorySpending(expenses, category, currentYear, currentMonth);
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    return {
      category,
      budget,
      spent,
      percentage: Math.min(percentage, 100)
    };
  });
};

export const getMonthlyTrends = (expenses: Expense[], months: number = 6): { month: string; amount: number }[] => {
  const currentDate = new Date();
  const trends = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const amount = calculateMonthlySpending(expenses, year, month);
    
    trends.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      amount
    });
  }

  return trends;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};