import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createTables } from './src/database/migrations';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('list');

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
        onSave={() => setScreen('list')}
        onCancel={() => setScreen('list')}
      />
    );
  }

  return <ExpenseListScreen onAddPress={() => setScreen('add')} />;
}