import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createTables } from './src/database/migrations';

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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{ready ? 'Database ready' : 'Loading...'}</Text>
    </View>
  );
}