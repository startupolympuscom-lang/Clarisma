import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
const ADMIN_PSEUDO = process.env.ADMIN_PSEUDO || 'Clarisma@retreat';

// Initialize database schema
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS retreats (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        city VARCHAR(255) DEFAULT '',
        tags TEXT DEFAULT '[]',
        description TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        price VARCHAR(100) NOT NULL,
        signup_url TEXT DEFAULT '',
        seats_available VARCHAR(100) DEFAULT '',
        agenda_url TEXT DEFAULT '',
        payment_details TEXT DEFAULT '',
        custom_form_schema TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS retreat_reservations (
        id SERIAL PRIMARY KEY,
        retreat_id INTEGER REFERENCES retreats(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) DEFAULT '',
        message TEXT DEFAULT '',
        answers TEXT DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    
    // Insert default video URL if not exists
    await pool.query(`
      INSERT INTO settings (key, value)
      VALUES ('hero_video_url', 'https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing')
      ON CONFLICT (key) DO NOTHING;
    `);
    
    // Update placeholder if it was already inserted
    await pool.query(`
      UPDATE settings 
      SET value = 'https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing' 
      WHERE key = 'hero_video_url' AND value = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    `);
    
    // Check if signup_url column exists, if not add it
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreats' AND column_name='signup_url') THEN
          ALTER TABLE retreats ADD COLUMN signup_url TEXT DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreats' AND column_name='seats_available') THEN
          ALTER TABLE retreats ADD COLUMN seats_available VARCHAR(100) DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreats' AND column_name='agenda_url') THEN
          ALTER TABLE retreats ADD COLUMN agenda_url TEXT DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreats' AND column_name='payment_details') THEN
          ALTER TABLE retreats ADD COLUMN payment_details TEXT DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreats' AND column_name='custom_form_schema') THEN
          ALTER TABLE retreats ADD COLUMN custom_form_schema TEXT DEFAULT '[]';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='retreat_reservations' AND column_name='answers') THEN
          ALTER TABLE retreat_reservations ADD COLUMN answers TEXT DEFAULT '{}';
        END IF;
      END $$;
    `);
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  }
}

// Middleware to verify JWT token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// --- API Routes ---

// Auth login
app.post('/api/auth/login', async (req, res) => {
  const { pseudo, password } = req.body;
  
  if (pseudo === ADMIN_PSEUDO && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get all retreats
app.get('/api/retreats', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM retreats ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a retreat
app.post('/api/retreats', authenticateToken, async (req, res) => {
  const { title, date, location, city, tags, description, image_url, price, signup_url, seats_available, agenda_url, payment_details, custom_form_schema } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO retreats (title, date, location, city, tags, description, image_url, price, signup_url, seats_available, agenda_url, payment_details, custom_form_schema) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [title, date, location, city, JSON.stringify(tags || []), description, image_url, price, signup_url || '', seats_available || '', agenda_url || '', payment_details || '', custom_form_schema || '[]']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a retreat
app.put('/api/retreats/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, date, location, city, tags, description, image_url, price, signup_url, seats_available, agenda_url, payment_details, custom_form_schema } = req.body;
  try {
    const result = await pool.query(
      'UPDATE retreats SET title = $1, date = $2, location = $3, city = $4, tags = $5, description = $6, image_url = $7, price = $8, signup_url = $9, seats_available = $10, agenda_url = $11, payment_details = $12, custom_form_schema = $13 WHERE id = $14 RETURNING *',
      [title, date, location, city, JSON.stringify(tags || []), description, image_url, price, signup_url || '', seats_available || '', agenda_url || '', payment_details || '', custom_form_schema || '[]', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Retreat not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a retreat
app.delete('/api/retreats/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM retreats WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Retreat not found' });
    }
    res.json({ message: 'Retreat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settings = result.rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update settings
app.put('/api/settings', authenticateToken, async (req, res) => {
  const { settings } = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [key, value]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a reservation
app.post('/api/reservations', async (req, res) => {
  const { retreat_id, name, email, phone, message, answers } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO retreat_reservations (retreat_id, name, email, phone, message, answers) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [retreat_id, name, email, phone || '', message || '', answers || '{}']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reservations (admin only)
app.get('/api/reservations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, ret.title as retreat_title 
      FROM retreat_reservations r 
      JOIN retreats ret ON r.retreat_id = ret.id 
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reservation status (admin only)
app.put('/api/reservations/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE retreat_reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Vite Integration ---
async function startServer() {
  await initDB();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
