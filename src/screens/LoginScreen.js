import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { login } from '../repositories/authRepository';

export default function LoginScreen({ onLoggedIn, onGoToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (email.trim() === '' || password === '') {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }

    try {
      const user = await login(email, password);
      onLoggedIn(user);
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Log In</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="ali@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={onGoToSignUp}>
          <Text style={styles.linkText}>No account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  linkButton: { padding: 14, alignItems: 'center', marginTop: 8 },
  linkText: { color: '#2563eb' },
});