import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run);
db.getAsync = promisify(db.get);
db.allAsync = promisify(db.all);

export async function initDb() {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      checkInTime TEXT,
      subject TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  // Seed data if empty
  const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const MOCK_USERS = [
      { id: '1', name: 'Alice Admin', email: 'admin@school.edu', role: 'ADMIN', avatar: 'https://picsum.photos/id/64/200/200' },
      { id: '2', name: 'John Student', email: 'john@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/65/200/200' },
      { id: '3', name: 'Sarah Teacher', email: 'sarah@school.edu', role: 'TEACHER', avatar: 'https://picsum.photos/id/66/200/200' },
      { id: '4', name: 'Jane Doe', email: 'jane@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/68/200/200' },
      { id: '5', name: 'Mike Smith', email: 'mike@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/70/200/200' }
    ];

    const stmt = db.prepare('INSERT INTO users (id, name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?, ?)');
    for (const user of MOCK_USERS) {
      // Default password is "password"
      stmt.run(user.id, user.name, user.email, 'password', user.role, user.avatar);
    }
    stmt.finalize();
    console.log('Database seeded with users.');
  }
}

export default db;
