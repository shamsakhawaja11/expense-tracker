import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    addExpense,
    deleteExpense,
    getAllExpenses,
    getExpensesByCategory,
} from '../repositories/expenseRepository';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other'];

export default function ExpenseListScreen({ onAddPress }) {
    const [expenses, setExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    async function loadExpenses() {
        try {
            let data;
            if (selectedCategory === 'All') {
                data = await getAllExpenses();
            } else {
                data = await getExpensesByCategory(selectedCategory);
            }
            setExpenses(data);
        } catch (error) {
            console.log('Load error:', error);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, [selectedCategory]);

    // TEMPORARY: remove this when we build the Add screen
    async function addTestExpense() {
        try {
            const today = new Date().toISOString().slice(0, 10);
            await addExpense('Lunch', 250, 'Food', null, today);
            await loadExpenses();
        } catch (error) {
            console.log('Add error:', error);
        }
    }

    function confirmDelete(id) {
        Alert.alert('Delete expense', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteExpense(id);
                        await loadExpenses();
                    } catch (error) {
                        console.log('Delete error:', error);
                    }
                },
            },
        ]);
    }

    function renderExpense({ item }) {
        return (
            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.small}>
                        {item.category} - {item.date}
                    </Text>
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.amount}>Rs. {item.amount}</Text>
                    <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>My Expenses</Text>

            <View style={styles.filterRow}>
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.chip,
                            selectedCategory === category && styles.chipSelected,
                        ]}
                        onPress={() => setSelectedCategory(category)}>
                        <Text
                            style={selectedCategory === category ? styles.chipTextSelected : styles.chipText}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={expenses}
                keyExtractor={item => String(item.id)}
                renderItem={renderExpense}
                ListEmptyComponent={<Text style={styles.empty}>No expenses yet</Text>}
            />

            <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                <Text style={styles.addButtonText}>+ Add expense</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
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
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    cardLeft: { flex: 1 },
    cardRight: { alignItems: 'flex-end' },
    title: { fontSize: 16, fontWeight: '600' },
    small: { color: '#666', marginTop: 4 },
    amount: { fontSize: 16, fontWeight: 'bold' },
    deleteText: { color: 'red', marginTop: 6 },
    empty: { textAlign: 'center', marginTop: 40, color: '#666' },
    addButton: {
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
});