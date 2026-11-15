import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addExpense, updateExpense } from '../repositories/expenseRepository';

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other'];

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDate(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return false;
  }

  const year = parseInt(text.slice(0, 4), 10);
  const month = parseInt(text.slice(5, 7), 10);
  const day = parseInt(text.slice(8, 10), 10);

  const check = new Date(year, month - 1, day);

  return (
    check.getFullYear() === year &&
    check.getMonth() === month - 1 &&
    check.getDate() === day
  );
}

export default function AddExpenseScreen({ user, expense, onSave, onCancel }) {
  const isEditing = expense !== null && expense !== undefined;

  const [title, setTitle] = useState(isEditing ? expense.title : '');
  const [amount, setAmount] = useState(isEditing ? String(expense.amount) : '');
  const [category, setCategory] = useState(isEditing ? expense.category : 'Food');
  const [note, setNote] = useState(
    isEditing && expense.note !== null ? expense.note : '',
  );
  const [date, setDate] = useState(isEditing ? expense.date : getToday());

  async function handleSave() {
    if (title.trim() === '') {
      Alert.alert('Missing title', 'Please enter a title.');
      return;
    }

    if (!/^\d+$/.test(amount) || parseInt(amount, 10) <= 0) {
      Alert.alert('Invalid amount', 'Enter a whole number greater than 0.');
      return;
    }

    if (!isValidDate(date)) {
      Alert.alert('Invalid date', 'Enter a real date like 2026-06-16.');
      return;
    }

    try {
      const cleanNote = note.trim() === '' ? null : note.trim();

      if (isEditing) {
        await updateExpense(
          user.id,
          expense.id,
          title.trim(),
          parseInt(amount, 10),
          category,
          cleanNote,
          date,
        );
      } else {
        await addExpense(
          user.id,
          title.trim(),
          parseInt(amount, 10),
          category,
          cleanNote,
          date,
        );
      }

      onSave();
    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', 'Could not save the expense.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>
          {isEditing ? 'Edit Expense' : 'Add Expense'}
        </Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Lunch"
        />

        <Text style={styles.label}>Amount (Rs.)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g. 250"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.filterRow}>
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, category === item && styles.chipSelected]}
              onPress={() => setCategory(item)}>
              <Text
                style={category === item ? styles.chipTextSelected : styles.chipText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2026-06-16"
        />

        <Text style={styles.label}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Anything extra"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { color: '#000' },
  chipTextSelected: { color: '#fff' },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { padding: 14, alignItems: 'center', marginTop: 8 },
  cancelButtonText: { color: '#666' },
});