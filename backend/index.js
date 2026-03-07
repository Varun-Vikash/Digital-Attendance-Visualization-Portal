import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'attendviz-secret-key-2026';

app.use(cors());
app.use(express.json());

// Initialize Database
await initDb();

// --- Auth Endpoints ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
    
    if (user && user.password === password) { // Simple password check for now
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- User Endpoints ---

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.allAsync('SELECT id, name, email, role, avatar FROM users');
    res.json(users);
  } catch (err) {
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
      query += ' WHERE userId = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY date DESC';
    const records = await db.allAsync(query, params);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { userId, date, status, checkInTime, subject } = req.body;
  
  try {
    const user = await db.getAsync('SELECT name FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if record exists for this day and user
    const existing = await db.getAsync(
      'SELECT id FROM attendance WHERE userId = ? AND date = ?', 
      [userId, date]
    );

    if (existing) {
      // Update
      await db.runAsync(
        'UPDATE attendance SET status = ?, checkInTime = ?, subject = ? WHERE id = ?',
        [status, checkInTime, subject, existing.id]
      );
      const updated = await db.getAsync('SELECT * FROM attendance WHERE id = ?', [existing.id]);
      res.json(updated);
    } else {
      // Create
      const id = `${userId}-${date}-${Date.now()}`;
      await db.runAsync(
        'INSERT INTO attendance (id, userId, userName, date, status, checkInTime, subject) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, userId, user.name, date, status, checkInTime, subject]
      );
      const created = await db.getAsync('SELECT * FROM attendance WHERE id = ?', [id]);
      res.json(created);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/reset', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM attendance');
    res.json({ message: 'Database reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
