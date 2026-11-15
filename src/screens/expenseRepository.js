export async function getMonthlyTotals() {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT SUBSTR(date, 1, 7) AS month, SUM(amount) AS total
     FROM expenses
     GROUP BY month
     ORDER BY month DESC;`,
  );
  return rowsToArray(result);
}

export async function getCategoryTotals(month) {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT category, SUM(amount) AS total
     FROM expenses
     WHERE SUBSTR(date, 1, 7) = ?
     GROUP BY category
     ORDER BY total DESC;`,
    [month],
  );
  return rowsToArray(result);
}