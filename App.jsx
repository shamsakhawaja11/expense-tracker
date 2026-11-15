import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createTables } from './src/database/migrations';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import SummaryScreen from './src/screens/SummaryScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('list');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        await createTables();
        setReady(true);
      } catch (error) {
        console.log('Database error:', error);
      }
    }

    setup();
  }, []);

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

  if (screen === 'add') {
    return (
      <AddExpenseScreen
        expense={editingExpense}
        onSave={goToList}
        onCancel={goToList}
      />
    );
  }

  if (screen === 'summary') {
    return <SummaryScreen onBack={goToList} />;
  }

  return (
    <ExpenseListScreen
      onAddPress={openAdd}
      onSummaryPress={() => setScreen('summary')}
      onEditPress={openEdit}
    />
  );
}