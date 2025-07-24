export interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
  percentage: number;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Bills & Utilities',
  'Travel',
  'Education',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];