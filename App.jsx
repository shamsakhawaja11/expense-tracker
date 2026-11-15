import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createTables } from './src/database/migrations';
import { getLoggedInUser, logout } from './src/repositories/authRepository';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import SummaryScreen from './src/screens/SummaryScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('login');
  const [screen, setScreen] = useState('list');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        await createTables();
        const savedUser = await getLoggedInUser();
        setUser(savedUser);
        setReady(true);
      } catch (error) {
        console.log('Startup error:', error);
      }
    }

    setup();
  }, []);

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    setScreen('list');
  }

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setAuthScreen('login');
      setScreen('list');
      setEditingExpense(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  }

  function openAdd() {
    setEditingExpense(null);
    setScreen('add');
  }

  function openEdit(expense) {
    setEditingExpense(expense);
    setScreen('add');
  }

  function goToList() {
    setEditingExpense(null);
    setScreen('list');
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user === null) {
    if (authScreen === 'signup') {
      return (
        <SignUpScreen
          onSignedUp={handleAuthSuccess}
          onGoToLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onLoggedIn={handleAuthSuccess}
        onGoToSignUp={() => setAuthScreen('signup')}
      />
    );
  }

  if (screen === 'add') {
    return (
      <AddExpenseScreen
        user={user}
        expense={editingExpense}
        onSave={goToList}
        onCancel={goToList}
      />
    );
  }

  if (screen === 'summary') {
    return <SummaryScreen user={user} onBack={goToList} />;
  }

  return (
    <ExpenseListScreen
      user={user}
      onAddPress={openAdd}
      onSummaryPress={() => setScreen('summary')}
      onEditPress={openEdit}
      onLogout={handleLogout}
    />
  );
}