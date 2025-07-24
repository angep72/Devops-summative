import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Settings from './components/Settings';
import { User, Expense } from './types';
import { storageUtils } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = storageUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadExpenses(user.id);
    }
  }, [refreshKey]);

  const loadExpenses = (userId: string) => {
    const userExpenses = storageUtils.getUserExpenses(userId);
    setExpenses(userExpenses);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    loadExpenses(user.id);
  };

  const handleLogout = () => {
    storageUtils.clearCurrentUser();
    setCurrentUser(null);
    setExpenses([]);
    setCurrentTab('dashboard');
  };

  const handleExpenseChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUserUpdated = (user: User) => {
    setCurrentUser(user);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} expenses={expenses} />;
      case 'add-expense':
        return <AddExpense currentUser={currentUser} onExpenseAdded={handleExpenseChange} />;
      case 'expenses':
        return <ExpenseList expenses={expenses} onExpenseUpdated={handleExpenseChange} />;
      case 'settings':
        return <Settings currentUser={currentUser} onUserUpdated={handleUserUpdated} />;
      default:
        return <Dashboard currentUser={currentUser} expenses={expenses} />;
    }
  };

  return (
    <Layout
      currentUser={currentUser}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;