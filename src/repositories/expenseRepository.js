import { getDatabase } from '../database/db';

function rowsToArray(result) {
  const list = [];
  for (let i = 0; i < result.rows.length; i++) {
    list.push(result.rows.item(i));
  }
  return list;
}

export async function addExpense(title, amount, category, note, date) {
  const db = await getDatabase();
  await db.executeSql(
    'INSERT INTO expenses (title, amount, category, note, date) VALUES (?, ?, ?, ?, ?);',
    [title, amount, category, note, date],
  );
}

export async function getAllExpenses() {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM expenses ORDER BY date DESC, id DESC;',
  );
  return rowsToArray(result);
}

export async function getExpensesByCategory(category) {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM expenses WHERE category = ? ORDER BY date DESC, id DESC;',
    [category],
  );
  return rowsToArray(result);
}

export async function updateExpense(id, title, amount, category, note, date) {
  const db = await getDatabase();
  await db.executeSql(
    'UPDATE expenses SET title = ?, amount = ?, category = ?, note = ?, date = ? WHERE id = ?;',
    [title, amount, category, note, date, id],
  );
}

export async function deleteExpense(id) {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM expenses WHERE id = ?;', [id]);
}