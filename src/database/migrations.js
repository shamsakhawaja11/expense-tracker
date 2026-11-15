import { getDatabase } from './db';

export async function createTables() {
  const db = await getDatabase();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL
    );
  `);
}