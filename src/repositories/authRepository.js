import { getDatabase } from '../database/db';

async function saveSession(userId) {
  const db = await getDatabase();
  await db.executeSql(
    'INSERT OR REPLACE INTO session (id, user_id) VALUES (1, ?);',
    [userId],
  );
}

export async function signUp(name, email, password) {
  const db = await getDatabase();
  const cleanEmail = email.trim().toLowerCase();

  const [existing] = await db.executeSql(
    'SELECT id FROM users WHERE email = ?;',
    [cleanEmail],
  );
  if (existing.rows.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const [result] = await db.executeSql(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?);',
    [name.trim(), cleanEmail, password],
  );

  await saveSession(result.insertId);
  return { id: result.insertId, name: name.trim(), email: cleanEmail };
}

export async function login(email, password) {
  const db = await getDatabase();
  const cleanEmail = email.trim().toLowerCase();

  const [result] = await db.executeSql(
    'SELECT id, name, email, password FROM users WHERE email = ?;',
    [cleanEmail],
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password.');
  }

  const row = result.rows.item(0);

  if (row.password !== password) {
    throw new Error('Invalid email or password.');
  }

  await saveSession(row.id);
  return { id: row.id, name: row.name, email: row.email };
}

export async function logout() {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM session;');
}

export async function getLoggedInUser() {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT users.id, users.name, users.email
     FROM session
     JOIN users ON users.id = session.user_id
     WHERE session.id = 1;`,
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows.item(0);
}