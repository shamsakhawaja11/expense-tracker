import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { deleteExpense, getExpenses } from '../repositories/expenseRepository';

const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Other'];

export default function ExpenseListScreen({
    user,
    onAddPress,
    onSummaryPress,
    onEditPress,
    onLogout,
}) {
    const [expenses, setExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchText, setSearchText] = useState('');

    async function loadExpenses() {
        try {
            const data = await getExpenses(user.id, selectedCategory, searchText);
            setExpenses(data);
        } catch (error) {
            console.log('Load error:', error);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, [selectedCategory, searchText]);

    function confirmDelete(id) {
        Alert.alert('Delete expense', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteExpense(user.id, id);
                        await loadExpenses();
                    } catch (error) {
                        console.log('Delete error:', error);
                    }
                },
            },
        ]);
    }

    function confirmLogout() {
        Alert.alert('Log out', 'Do you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', onPress: onLogout },
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
                    <TouchableOpacity onPress={() => onEditPress(item)}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.heading}>Hi, {user.name}</Text>
                <View style={styles.headerLinks}>
                    <TouchableOpacity onPress={onSummaryPress}>
                        <Text style={styles.link}>Summary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmLogout}>
                        <Text style={styles.logoutLink}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search title or note"
                autoCapitalize="none"
                autoCorrect={false}
            />

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
                            style={
                                selectedCategory === category
                                    ? styles.chipTextSelected
                                    : styles.chipText
                            }>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={expenses}
                keyExtractor={item => String(item.id)}
                renderItem={renderExpense}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={<Text style={styles.empty}>No expenses found</Text>}
            />

            <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                <Text style={styles.addButtonText}>+ Add expense</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    heading: { fontSize: 22, fontWeight: 'bold', flex: 1 },
    headerLinks: { flexDirection: 'row' },
    link: { color: '#2563eb', fontWeight: 'bold', fontSize: 16 },
    logoutLink: { color: 'red', fontWeight: 'bold', fontSize: 16, marginLeft: 16 },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 12,
    },
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
    editText: { color: '#2563eb', marginTop: 6 },
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