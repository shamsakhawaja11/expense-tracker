import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getCategoryTotals,
  getMonthlyTotals,
} from '../repositories/expenseRepository';

export default function SummaryScreen({ user, onBack }) {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadMonths() {
      try {
        const data = await getMonthlyTotals(user.id);
        setMonths(data);
        if (data.length > 0) {
          setSelectedMonth(data[0].month);
        }
      } catch (error) {
        console.log('Load months error:', error);
      }
    }

    loadMonths();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      if (selectedMonth === null) {
        return;
      }
      try {
        const data = await getCategoryTotals(user.id, selectedMonth);
        setCategories(data);
      } catch (error) {
        console.log('Load categories error:', error);
      }
    }

    loadCategories();
  }, [selectedMonth]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Summary</Text>

        <Text style={styles.sectionTitle}>Monthly totals</Text>
        {months.length === 0 && <Text style={styles.empty}>No data yet</Text>}
        {months.map(item => (
          <TouchableOpacity
            key={item.month}
            style={[styles.row, selectedMonth === item.month && styles.rowSelected]}
            onPress={() => setSelectedMonth(item.month)}>
            <Text style={styles.rowText}>{item.month}</Text>
            <Text style={styles.rowAmount}>Rs. {item.total}</Text>
          </TouchableOpacity>
        ))}

        {selectedMonth !== null && (
          <View>
            <Text style={styles.sectionTitle}>Categories in {selectedMonth}</Text>
            {categories.map(item => (
              <View key={item.category} style={styles.row}>
                <Text style={styles.rowText}>{item.category}</Text>
                <Text style={styles.rowAmount}>Rs. {item.total}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowSelected: { borderWidth: 2, borderColor: '#2563eb' },
  rowText: { fontSize: 16 },
  rowAmount: { fontSize: 16, fontWeight: 'bold' },
  empty: { color: '#666' },
  backButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
});