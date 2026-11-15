import { getDatabase } from '../database/db';

function rowsToArray(result) {
  const list = [];
  for (let i = 0; i < result.rows.length; i++) {
    list.push(result.rows.item(i));
  }
  return list;
}

export async function addExpense(userId, title, amount, category, note, date) {
  const db = await getDatabase();
  await db.executeSql(
    'INSERT INTO expenses (user_id, title, amount, category, note, date) VALUES (?, ?, ?, ?, ?, ?);',
    [userId, title, amount, category, note, date],
  );
}

export async function getExpenses(userId, category, searchText) {
  const db = await getDatabase();

  let sql = 'SELECT * FROM expenses WHERE user_id = ?';
  const params = [userId];

  if (category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  const text = searchText.trim();
  if (text !== '') {
    sql += ' AND (title LIKE ? OR note LIKE ?)';
    params.push(`%${text}%`, `%${text}%`);
  }

  sql += ' ORDER BY date DESC, id DESC;';

  const [result] = await db.executeSql(sql, params);
  return rowsToArray(result);
}

export async function updateExpense(userId, id, title, amount, category, note, date) {
  const db = await getDatabase();
  await db.executeSql(
    'UPDATE expenses SET title = ?, amount = ?, category = ?, note = ?, date = ? WHERE id = ? AND user_id = ?;',
    [title, amount, category, note, date, id, userId],
  );
}

export async function deleteExpense(userId, id) {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM expenses WHERE id = ? AND user_id = ?;', [
    id,
    userId,
  ]);
}

export async function getMonthlyTotals(userId) {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT SUBSTR(date, 1, 7) AS month, SUM(amount) AS total
     FROM expenses
     WHERE user_id = ?
     GROUP BY month
     ORDER BY month DESC;`,
    [userId],
  );
  return rowsToArray(result);
}

export async function getCategoryTotals(userId, month) {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT category, SUM(amount) AS total
     FROM expenses
     WHERE user_id = ? AND SUBSTR(date, 1, 7) = ?
     GROUP BY category
     ORDER BY total DESC;`,
    [userId, month],
  );
  return rowsToArray(result);
}