import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

// Use the DATABASE_URL environment variable if provided,
// otherwise fallback to a common local PostgreSQL connection string.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/attendviz',
});

export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "userName" TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        "checkInTime" TEXT,
        subject TEXT,
        FOREIGN KEY("userId") REFERENCES users(id)
      )
    `);

    // Seed data if empty
    const userCountRes = await pool.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(userCountRes.rows[0].count) === 0) {
      const MOCK_USERS = [
        { id: '1', name: 'Alice Admin', email: 'admin@school.edu', role: 'ADMIN', avatar: 'https://picsum.photos/id/64/200/200' },
        { id: '2', name: 'John Student', email: 'john@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/65/200/200' },
        { id: '3', name: 'Sarah Teacher', email: 'sarah@school.edu', role: 'TEACHER', avatar: 'https://picsum.photos/id/66/200/200' },
        { id: '4', name: 'Jane Doe', email: 'jane@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/68/200/200' },
        { id: '5', name: 'Mike Smith', email: 'mike@student.edu', role: 'STUDENT', avatar: 'https://picsum.photos/id/70/200/200' }
      ];

      for (const user of MOCK_USERS) {
        await pool.query(
          'INSERT INTO users (id, name, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5, $6)',
          [user.id, user.name, user.email, 'password', user.role, user.avatar]
        );
      }
      console.log('Database seeded with users.');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Make sure your PostgreSQL server is running and the database "attendviz" exists.');
  }
}

export default pool;