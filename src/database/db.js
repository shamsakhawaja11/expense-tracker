import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let database = null;

export async function getDatabase() {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabase({
    name: 'expense_tracker.db',
    location: 'default',
  });

  return database;
}