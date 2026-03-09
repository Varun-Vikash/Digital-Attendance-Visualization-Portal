import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'attendviz-secret-key-2026';

app.use(cors());
app.use(express.json());

// Initialize Database
initDb().then(() => {
  console.log('Database initialization check complete.');
});

// --- Auth Endpoints ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (user && user.password === password) { // Simple password check for now
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- User Endpoints ---

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, avatar FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Attendance Endpoints ---

app.get('/api/attendance', async (req, res) => {
  const { userId } = req.query;
  
  try {
    let query = 'SELECT * FROM attendance';
    let params = [];
    
    if (userId) {
      query += ' WHERE "userId" = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { userId, date, status, checkInTime, subject } = req.body;
  
  try {
    const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if record exists for this day and user
    const existingRes = await pool.query(
      'SELECT id FROM attendance WHERE "userId" = $1 AND date = $2', 
      [userId, date]
    );
    const existing = existingRes.rows[0];

    if (existing) {
      // Update
      await pool.query(
        'UPDATE attendance SET status = $1, "checkInTime" = $2, subject = $3 WHERE id = $4',
        [status, checkInTime, subject, existing.id]
      );
      const updatedRes = await pool.query('SELECT * FROM attendance WHERE id = $1', [existing.id]);
      res.json(updatedRes.rows[0]);
    } else {
      // Create
      const id = `${userId}-${date}-${Date.now()}`;
      await pool.query(
        'INSERT INTO attendance (id, "userId", "userName", date, status, "checkInTime", subject) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, userId, user.name, date, status, checkInTime, subject]
      );
      const createdRes = await pool.query('SELECT * FROM attendance WHERE id = $1', [id]);
      res.json(createdRes.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM attendance');
    res.json({ message: 'Database reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}