import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createTables } from './src/database/migrations';
import ExpenseListScreen from './src/screens/ExpenseListScreen';

export default function App() {
  const [ready, setReady] = useState(false);

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

  return <ExpenseListScreen />;
}