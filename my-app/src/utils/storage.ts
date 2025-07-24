import { User, Expense } from '../types';

const USERS_KEY = 'moneyflow_users';
const EXPENSES_KEY = 'moneyflow_expenses';
const CURRENT_USER_KEY = 'moneyflow_current_user';

export const storageUtils = {
  // User management
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  },

  // Current user session
  getCurrentUser(): User | null {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Expense management
  getExpenses(): Expense[] {
    const expenses = localStorage.getItem(EXPENSES_KEY);
    return expenses ? JSON.parse(expenses) : [];
  },

  getUserExpenses(userId: string): Expense[] {
    const expenses = this.getExpenses();
    return expenses.filter(expense => expense.userId === userId);
  },

  saveExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    const existingIndex = expenses.findIndex(e => e.id === expense.id);
    
    if (existingIndex >= 0) {
      expenses[existingIndex] = expense;
    } else {
      expenses.push(expense);
    }
    
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  },

  deleteExpense(expenseId: string): void {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(e => e.id !== expenseId);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(filteredExpenses));
  }
};