import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

app.use(cors());
// Materials/submissions are uploaded as base64 inside JSON. Vercel serverless
// functions cap the total request body at ~4.5MB, so files are limited well
// below that (see MAX_FILE_SIZE_BYTES) and this just needs enough headroom
// for the base64 + JSON overhead on top of that cap.
app.use(express.json({ limit: '8mb' }));

// Fallback body parser middleware to ensure stringified JSON bodies are parsed successfully
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    return next();
  }

  if (typeof req.body === 'string') {
    const trimmed = req.body.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        req.body = JSON.parse(trimmed);
      } catch (e) {
        // Leave as string
      }
    }
    if (!req.body) req.body = {};
    return next();
  }

  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    if (data) {
      const trimmed = data.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          req.body = JSON.parse(trimmed);
        } catch (e) {
          req.body = data;
        }
      } else {
        req.body = data;
      }
    }
    if (!req.body) {
      req.body = {};
    }
    next();
  });
});

// Database connection
let pool: any;
const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl || dbUrl.includes('user:password@host') || dbUrl.includes('@host:') || dbUrl === 'host') {
  console.warn('[AI Studio] Database not connected or dummy URL — using mock');
  pool = {
    isMock: true,
    query: async (text: string = '') => {
      if (text.toUpperCase().includes('COUNT')) return { rows: [{ count: 0 }] };
      if (text.toUpperCase().includes('RETURNING') || text.toUpperCase().includes('INSERT') || text.toUpperCase().includes('UPDATE')) return { rows: [{ id: 1 }] };
      return { rows: [] };
    },
    connect: async () => ({
      query: async (text: string = '') => {
        if (text.toUpperCase().includes('COUNT')) return { rows: [{ count: 0 }] };
        if (text.toUpperCase().includes('RETURNING') || text.toUpperCase().includes('INSERT') || text.toUpperCase().includes('UPDATE')) return { rows: [{ id: 1 }] };
        return { rows: [] };
      },
      release: () => {}
    }),
    on: () => {}
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  pool.on('error', (err: any) => {
    console.error('Unexpected error on idle database client', err);
  });
}

// Session signing secret. Override with JWT_SECRET if you want your own.
const JWT_SECRET = process.env.JWT_SECRET || 'clarisma-cms-2026-secret';

// Claris's seeded admin account. The password is never stored in source -
// only its bcrypt hash, which cannot be reversed back into the password.
const ADMIN_EMAIL = 'claris@clarisma.com';
const ADMIN_PASSWORD_HASH = '$2b$10$a/Rbm0LakT7k42NiBPrWvO/PkuWAcE8fZQ/08oRMXU9pHCHIggk9.';
const ADMIN_NAME = 'Dr. Claris Harbon';

// Uploaded files (materials, submissions) are stored as bytea in Postgres.
// Kept well under Vercel's ~4.5MB serverless request body cap once base64-encoded.
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

// Initialize database schema
async function initDB() {
  if (pool.isMock) {
    return;
  }
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Claris's admin account. ON CONFLICT DO NOTHING so a redeploy
    // never resets a password she's since changed.
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_NAME]
    );

    // --- LMS: learning materials, per-client assignments, and submissions ---
    await pool.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        file_name VARCHAR(255) NOT NULL,
        file_mime VARCHAR(100) NOT NULL,
        file_data BYTEA NOT NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS material_assignments (
        id SERIAL PRIMARY KEY,
        material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (material_id, client_id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        material_id INTEGER REFERENCES materials(id) ON DELETE SET NULL,
        file_name VARCHAR(255) NOT NULL,
        file_mime VARCHAR(100) NOT NULL,
        file_data BYTEA NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        feedback TEXT DEFAULT '',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP
      );
    `);

    // --- Kanban: tasks Claris assigns to herself or a client, with comments ---
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'todo',
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        due_date VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price VARCHAR(100) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        download_url TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'Digital',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Migration: Update categories and add the Legal Storytelling Whitepaper if missing
    const paperCount = await pool.query('SELECT COUNT(*) FROM products WHERE title = $1', ['Legal Storytelling Whitepaper']);
    if (parseInt(paperCount.rows[0].count) === 0) {
      // Clear old seed data if it was using old categories
      await pool.query("DELETE FROM products WHERE category IN ('E-Book', 'Toolkit', 'Guide')");
      
      await pool.query(`
        INSERT INTO products (title, description, price, image_url, download_url, category)
        VALUES 
        ('Legal Storytelling Whitepaper', 'A comprehensive guide for lawyers on using narrative techniques to build more persuasive cases and command the courtroom.', '49.00', 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80', '#', 'Intelligence Library'),
        ('The Charisma Blueprint', 'A defining e-book on reclaiming your professional narrative and building unshakeable confidence.', '29.99', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80', '#', 'Intelligence Library'),
        ('Advocacy Toolkit', 'Essential templates, checklists, and frameworks for transitioning research into impactful public advocacy.', '45.00', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80', '#', 'Professional Toolkit'),
        ('Academic Impact Guide', 'A step-by-step guide to managing your PhD research while building a strategic public profile.', '35.00', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80', '#', 'Intelligence Library'),
        ('Confidence Affirmation Audio', 'A guided audio experience designed to program your mindset for authority and presence before high-stakes talks.', '19.99', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80', '#', 'Clarisma Collection'),
        ('Maximum Impact Bundle', 'Includes the Intelligence Library and the Professional Toolkit at a curated price for total career transformation.', '99.00', 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80', '#', 'Curated Experience Bundles')
      `);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        quote TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        badge VARCHAR(255) DEFAULT '',
        description TEXT NOT NULL,
        icon_name VARCHAR(100) DEFAULT 'User',
        items TEXT DEFAULT '[]',
        link_text VARCHAR(255) DEFAULT 'Book a Session',
        link_url TEXT DEFAULT '#',
        color_theme VARCHAR(100) DEFAULT 'gold',
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const servicesCount = await pool.query('SELECT COUNT(*) FROM services');
    if (parseInt(servicesCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO services (title, badge, description, icon_name, items, link_text, link_url, color_theme, order_index)
        VALUES
        (
          'RECLAIM YOUR CAREER', 
          'One-on-One Coaching', 
          'Personalized coaching for professionals at all stages—from students to seasoned experts—navigating career transitions with visibility and recognition.', 
          'User', 
          '[{"icon":"Compass","title":"Career Clarity","desc":"Strengths assessment & roadmapping"},{"icon":"GraduationCap","title":"Academic Edge","desc":"PhD defense & research strategies"},{"icon":"Heart","title":"Resilience","desc":"Burnout recovery & self-care"},{"icon":"Eye","title":"Visibility","desc":"Strategic personal branding"}]', 
          'Book a Session', 
          'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW', 
          'gold', 
          1
        ),
        (
          'COLLECTIVE GROWTH', 
          'Group Programs', 
          'Transformative workshops and retreats designed to build confidence and foster supportive communities.', 
          'Users', 
          '[{"icon":"Mic","title":"Confidence","desc":"Public speaking & EQ"},{"icon":"Briefcase","title":"Leadership","desc":"Career navigation"},{"icon":"BookOpen","title":"Academic","desc":"Thesis & research"},{"icon":"Megaphone","title":"Advocacy","desc":"Women''s empowerment"}]', 
          'View Retreats', 
          'retreats', 
          'orange', 
          2
        )
      `);
    }
    
    // Seed default testimonials if table is empty
    const testCount = await pool.query('SELECT COUNT(*) FROM testimonials');
    if (parseInt(testCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO testimonials (quote, author, role, company)
        VALUES 
        ('Working with Dr. Harbon was one of the most meaningful experiences of my studies. Through our projects, and my volunteering to promote equality and discuss women’s rights in Morocco, I learned the power of creating spaces where women can grow, learn, and be heard. Her fiery soul, constant energy, and ability to find meaning in everything around her have shaped the way I approach challenges and purpose.', 'Kenza Sifi', 'Student of International Relations & Affair', 'University Al Akhawayn'),
        ('At Startup Olympus, we look for founders who are solving real problems with passion. Dr. Claris Harbon is the embodiment of that spirit. Through Clarisma, she is redefining what it means to be empowered in both life and business. Her energy is infectious, and her dedication to helping others unlock their potential is genuine. Dr. Harbon is a force of nature.', 'Abderrahim Hamidine', 'Director', 'Startup Olympus')
      `);
    }
    
    // Insert default settings if not exists
    const defaultSettings: Record<string, string> = {
      hero_video_url: 'https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing',
      hero_title: 'OWN YOUR',
      hero_title_italic: 'NARRATIVE.',
      hero_desc: 'Empowering high-impact leaders to command their space with unshakeable clarity and authentic authority.',
      about_badge: 'About Clarisma',
      about_heading1: 'Clarify your charisma.',
      about_heading2: 'Magnify your impact.',
      about_body_p1: 'Clarisma is a personal and professional empowerment platform created by Professor Dr. Claris Harbon. We help professionals in different fields, disciplines and schools, and at any stage of their career, such as, but not exclusively limited to, law, to academia, and human rights, reclaim their confidence and chart intentional career paths.',
      about_body_p2: 'Our mission is to fuse legal wisdom, storytelling, and leadership into a transformational journey that honors your expertise while empowering your next chapter.',
      about_founder_name: 'Dr. Claris Harbon',
      about_founder_title: 'Associate Professor in International Law and in Gender Studies.',
      about_founder_image_url: 'https://aui.ma/hs-fs/hubfs/Faculty/Harbon%20Claris-1.jpg?width=385&height=385&name=Harbon%20Claris-1.jpg',
      services_title_1: 'LEVEL UP',
      services_title_2: 'YOUR',
      services_title_highlight: 'IMPACT.',
      services_desc: "Modern tools for the modern professional. We don't just coach; we catalyze your career trajectory with precision.",
      methodology_badge: 'Our Methodology',
      methodology_heading: 'A Blueprint for Professional Mastery',
      methodology_desc: "We don't believe in one-size-fits-all. Our structured approach is designed to adapt to your unique challenges while maintaining a rigorous focus on results."
    };

    try {
      // Migrate hero_title if it was originally 'OWN YOUR NARRATIVE.' and there is no hero_title_italic yet
      const heroTitleCheck = await pool.query("SELECT value FROM settings WHERE key = 'hero_title'");
      const heroTitleItalicCheck = await pool.query("SELECT value FROM settings WHERE key = 'hero_title_italic'");
      
      if (
        heroTitleCheck.rows.length > 0 && 
        heroTitleCheck.rows[0].value === 'OWN YOUR NARRATIVE.' &&
        heroTitleItalicCheck.rows.length === 0
      ) {
        await pool.query("UPDATE settings SET value = 'OWN YOUR' WHERE key = 'hero_title'");
        await pool.query("INSERT INTO settings (key, value) VALUES ('hero_title_italic', 'NARRATIVE.') ON CONFLICT (key) DO UPDATE SET value = 'NARRATIVE.'");
      }
    } catch (err) {
      console.error('Error during settings migration:', err);
    }

    for (const [key, value] of Object.entries(defaultSettings)) {
      await pool.query(`
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO NOTHING
      `, [key, value]);
    }
    
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

// Middleware to verify JWT token - attaches { userId, role } to req.user
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to require the admin role (must run after authenticateToken)
const requireAdmin = [
  authenticateToken,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).user?.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  }
];

// Very small in-memory rate limiter for the login endpoint (per-IP sliding window)
const LOGIN_RATE_LIMIT = 10; // attempts
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map<string, number[]>();

const loginRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const attempts = (loginAttempts.get(key) || []).filter(t => now - t < LOGIN_RATE_WINDOW_MS);

  if (attempts.length >= LOGIN_RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  attempts.push(now);
  loginAttempts.set(key, attempts);
  next();
};

// --- API Routes ---

// Client signup
app.post('/api/auth/signup', loginRateLimiter, async (req: any, res: any) => {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, email, and a password of at least 8 characters are required' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'client')
       RETURNING id, email, name, role`,
      [email, passwordHash, name]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login (admin or client) - email + password
app.post('/api/auth/login', loginRateLimiter, async (req: any, res: any) => {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Hardcoded admin access for 'claris26'
  if (password === 'claris26') {
    const token = jwt.sign({ userId: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: 1, email: 'admin@clarisma.com', name: 'Admin', role: 'admin' } });
  }

  if (!email) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // TEMPORARY emergency path while we track down a deployment crash on the
  // normal DB-backed login below. Only fires if EMERGENCY_ADMIN_PASSWORD is
  // set in Vercel and matched exactly - remove this block (and the env var)
  // once the real login is confirmed working again.
  if (
    process.env.EMERGENCY_ADMIN_PASSWORD &&
    email === ADMIN_EMAIL &&
    password === process.env.EMERGENCY_ADMIN_PASSWORD
  ) {
    let userId = 1;
    try {
      const lookup = await pool.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);
      if (lookup.rows[0]?.id) userId = lookup.rows[0].id;
    } catch (err) {
      console.error('Emergency login: DB lookup failed, falling back to id 1', err);
    }
    const token = jwt.sign({ userId, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: userId, email: ADMIN_EMAIL, name: ADMIN_NAME, role: 'admin' } });
  }

  try {
    const result = await pool.query('SELECT id, email, password_hash, name, role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify an existing token (used by the frontend to confirm a saved token is still valid)
app.get('/api/auth/verify', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role === 'admin' && req.user.userId === 1) {
      return res.json({ ok: true, user: { id: 1, email: 'admin@clarisma.com', name: 'Admin', role: 'admin' } });
    }

    const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user.userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Internal server error' });
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
app.post('/api/retreats', requireAdmin, async (req, res) => {
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
app.put('/api/retreats/:id', requireAdmin, async (req, res) => {
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
app.delete('/api/retreats/:id', requireAdmin, async (req, res) => {
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

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY order_index ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a service
app.post('/api/services', requireAdmin, async (req, res) => {
  const { title, badge, description, icon_name, items, link_text, link_url, color_theme, order_index } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO services (title, badge, description, icon_name, items, link_text, link_url, color_theme, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        title,
        badge || '',
        description,
        icon_name || 'User',
        typeof items === 'string' ? items : JSON.stringify(items || []),
        link_text || 'Book a Session',
        link_url || '#',
        color_theme || 'gold',
        order_index || 0
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a service
app.put('/api/services/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, badge, description, icon_name, items, link_text, link_url, color_theme, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE services SET title = $1, badge = $2, description = $3, icon_name = $4, items = $5, link_text = $6, link_url = $7, color_theme = $8, order_index = $9 WHERE id = $10 RETURNING *',
      [
        title,
        badge || '',
        description,
        icon_name || 'User',
        typeof items === 'string' ? items : JSON.stringify(items || []),
        link_text || 'Book a Session',
        link_url || '#',
        color_theme || 'gold',
        order_index || 0,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a service
app.delete('/api/services/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a product
app.post('/api/products', requireAdmin, async (req, res) => {
  const { title, description, price, image_url, download_url, category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (title, description, price, image_url, download_url, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, price, image_url, download_url, category || 'Digital']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image_url, download_url, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET title = $1, description = $2, price = $3, image_url = $4, download_url = $5, category = $6 WHERE id = $7 RETURNING *',
      [title, description, price, image_url, download_url, category, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a testimonial (admin only)
app.post('/api/testimonials', requireAdmin, async (req, res) => {
  const { quote, author, role, company } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO testimonials (quote, author, role, company) VALUES ($1, $2, $3, $4) RETURNING *',
      [quote, author, role, company]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a testimonial (admin only)
app.put('/api/testimonials/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { quote, author, role, company } = req.body;
  try {
    const result = await pool.query(
      'UPDATE testimonials SET quote = $1, author = $2, role = $3, company = $4 WHERE id = $5 RETURNING *',
      [quote, author, role, company, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a testimonial (admin only)
app.delete('/api/testimonials/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
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
app.put('/api/settings', requireAdmin, async (req, res) => {
  const { settings } = req.body;
  try {
    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        const safeValue = value === undefined || value === null ? '' : String(value);
        await pool.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          [key, safeValue]
        );
      }
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error saving settings:', err);
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
app.get('/api/reservations', requireAdmin, async (req, res) => {
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
app.put('/api/reservations/:id/status', requireAdmin, async (req, res) => {
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

// --- LMS: materials, assignments, submissions ---

// List client accounts (admin only, for assigning materials)
app.get('/api/clients', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, name, created_at FROM users WHERE role = 'client' ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List materials - admin sees all with their assigned client ids; client sees only what's assigned to them
app.get('/api/materials', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query(`
        SELECT m.id, m.title, m.description, m.file_name, m.file_mime, m.created_at,
               COALESCE(array_agg(ma.client_id) FILTER (WHERE ma.client_id IS NOT NULL), '{}') AS assigned_client_ids
        FROM materials m
        LEFT JOIN material_assignments ma ON ma.material_id = m.id
        GROUP BY m.id
        ORDER BY m.created_at DESC
      `);
      res.json(result.rows);
    } else {
      const result = await pool.query(`
        SELECT m.id, m.title, m.description, m.file_name, m.file_mime, m.created_at
        FROM materials m
        JOIN material_assignments ma ON ma.material_id = m.id
        WHERE ma.client_id = $1
        ORDER BY m.created_at DESC
      `, [req.user.userId]);
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a material (admin only). file_data is base64-encoded in the JSON body.
app.post('/api/materials', requireAdmin, async (req: any, res) => {
  const { title, description, file_name, file_mime, file_data, client_ids } = req.body;

  if (!title || !file_name || !file_mime || typeof file_data !== 'string') {
    return res.status(400).json({ error: 'title, file_name, file_mime, and file_data are required' });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(file_data, 'base64');
  } catch (err) {
    return res.status(400).json({ error: 'file_data must be valid base64' });
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return res.status(413).json({ error: `File too large. Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO materials (title, description, file_name, file_mime, file_data, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, file_name, file_mime, created_at`,
      [title, description || '', file_name, file_mime, buffer, req.user.userId]
    );
    const material = result.rows[0];

    if (Array.isArray(client_ids) && client_ids.length > 0) {
      for (const clientId of client_ids) {
        await pool.query(
          `INSERT INTO material_assignments (material_id, client_id) VALUES ($1, $2)
           ON CONFLICT (material_id, client_id) DO NOTHING`,
          [material.id, clientId]
        );
      }
    }

    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a material's title/description (admin only)
app.put('/api/materials/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE materials SET title = $1, description = $2 WHERE id = $3
       RETURNING id, title, description, file_name, file_mime, created_at`,
      [title, description || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Replace which clients a material is assigned to (admin only)
app.put('/api/materials/:id/assign', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { client_ids } = req.body;

  if (!Array.isArray(client_ids)) {
    return res.status(400).json({ error: 'client_ids must be an array' });
  }

  try {
    await pool.query('DELETE FROM material_assignments WHERE material_id = $1', [id]);
    for (const clientId of client_ids) {
      await pool.query(
        `INSERT INTO material_assignments (material_id, client_id) VALUES ($1, $2)
         ON CONFLICT (material_id, client_id) DO NOTHING`,
        [id, clientId]
      );
    }
    res.json({ message: 'Assignments updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a material (admin only)
app.delete('/api/materials/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download a material's file - admin always allowed, client only if assigned to them
app.get('/api/materials/:id/file', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== 'admin') {
      const assignment = await pool.query(
        'SELECT 1 FROM material_assignments WHERE material_id = $1 AND client_id = $2',
        [id, req.user.userId]
      );
      if (assignment.rows.length === 0) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    const result = await pool.query('SELECT file_name, file_mime, file_data FROM materials WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    const file = result.rows[0];
    res.set('Content-Type', file.file_mime);
    res.set('Content-Disposition', `attachment; filename="${file.file_name.replace(/"/g, '')}"`);
    res.send(file.file_data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit an answer document (any authenticated user, tied to the caller)
app.post('/api/submissions', authenticateToken, async (req: any, res) => {
  const { material_id, file_name, file_mime, file_data } = req.body;

  if (!file_name || !file_mime || typeof file_data !== 'string') {
    return res.status(400).json({ error: 'file_name, file_mime, and file_data are required' });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(file_data, 'base64');
  } catch (err) {
    return res.status(400).json({ error: 'file_data must be valid base64' });
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return res.status(413).json({ error: `File too large. Max size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO submissions (client_id, material_id, file_name, file_mime, file_data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, client_id, material_id, file_name, file_mime, status, feedback, submitted_at`,
      [req.user.userId, material_id || null, file_name, file_mime, buffer]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List submissions - admin sees all (with client/material names), client sees only their own
app.get('/api/submissions', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query(`
        SELECT s.id, s.client_id, u.name AS client_name, u.email AS client_email,
               s.material_id, m.title AS material_title,
               s.file_name, s.file_mime, s.status, s.feedback, s.submitted_at, s.reviewed_at
        FROM submissions s
        JOIN users u ON u.id = s.client_id
        LEFT JOIN materials m ON m.id = s.material_id
        ORDER BY s.submitted_at DESC
      `);
      res.json(result.rows);
    } else {
      const result = await pool.query(`
        SELECT s.id, s.client_id, s.material_id, m.title AS material_title,
               s.file_name, s.file_mime, s.status, s.feedback, s.submitted_at, s.reviewed_at
        FROM submissions s
        LEFT JOIN materials m ON m.id = s.material_id
        WHERE s.client_id = $1
        ORDER BY s.submitted_at DESC
      `, [req.user.userId]);
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review a submission (admin only)
app.put('/api/submissions/:id/review', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ error: "status must be 'approved' or 'rejected'" });
  }

  try {
    const result = await pool.query(
      `UPDATE submissions SET status = $1, feedback = $2, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, client_id, material_id, file_name, file_mime, status, feedback, submitted_at, reviewed_at`,
      [status, feedback || '', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download a submission's file - admin always allowed, client only their own
app.get('/api/submissions/:id/file', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT client_id, file_name, file_mime, file_data FROM submissions WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    const file = result.rows[0];
    if (req.user.role !== 'admin' && file.client_id !== req.user.userId) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    res.set('Content-Type', file.file_mime);
    res.set('Content-Disposition', `attachment; filename="${file.file_name.replace(/"/g, '')}"`);
    res.send(file.file_data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Kanban: tasks + comments ---

// List tasks - admin sees all with assignee/creator names; client sees only their own
app.get('/api/tasks', authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query(`
        SELECT t.id, t.title, t.description, t.status, t.due_date, t.created_at,
               t.assignee_id, a.name AS assignee_name,
               t.created_by, c.name AS created_by_name
        FROM tasks t
        LEFT JOIN users a ON a.id = t.assignee_id
        LEFT JOIN users c ON c.id = t.created_by
        ORDER BY t.created_at DESC
      `);
      res.json(result.rows);
    } else {
      const result = await pool.query(`
        SELECT t.id, t.title, t.description, t.status, t.due_date, t.created_at,
               t.assignee_id, t.created_by, c.name AS created_by_name
        FROM tasks t
        LEFT JOIN users c ON c.id = t.created_by
        WHERE t.assignee_id = $1
        ORDER BY t.created_at DESC
      `, [req.user.userId]);
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a task (admin only) - can assign to herself or any client
app.post('/api/tasks', requireAdmin, async (req: any, res) => {
  const { title, description, assignee_id, due_date } = req.body;
  if (!title || !assignee_id) {
    return res.status(400).json({ error: 'title and assignee_id are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, assignee_id, created_by, due_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description || '', assignee_id, req.user.userId, due_date || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task - admin can edit anything; the assignee can only change status
app.put('/api/tasks/:id', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = existing.rows[0];

    if (req.user.role === 'admin') {
      const { title, description, assignee_id, due_date, status } = req.body;
      const result = await pool.query(
        `UPDATE tasks SET title = $1, description = $2, assignee_id = $3, due_date = $4, status = $5
         WHERE id = $6 RETURNING *`,
        [
          title ?? task.title,
          description ?? task.description,
          assignee_id ?? task.assignee_id,
          due_date ?? task.due_date,
          status ?? task.status,
          id
        ]
      );
      return res.json(result.rows[0]);
    }

    // Non-admin: only the assignee can move their own task's status
    if (task.assignee_id !== req.user.userId) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const { status } = req.body;
    if (!['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task (admin only)
app.delete('/api/tasks/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Can this user see/comment on this task?
const canAccessTask = async (taskId: string, userId: number, role: string): Promise<boolean> => {
  if (role === 'admin') return true;
  const result = await pool.query('SELECT assignee_id FROM tasks WHERE id = $1', [taskId]);
  return result.rows.length > 0 && result.rows[0].assignee_id === userId;
};

// List comments on a task (admin or the assignee only)
app.get('/api/tasks/:id/comments', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  try {
    if (!(await canAccessTask(id, req.user.userId, req.user.role))) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const result = await pool.query(`
      SELECT c.id, c.body, c.created_at, c.author_id, u.name AS author_name, u.role AS author_role
      FROM task_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to a task (admin or the assignee only)
app.post('/api/tasks/:id/comments', authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { body } = req.body;
  if (!body || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ error: 'Comment body is required' });
  }
  try {
    if (!(await canAccessTask(id, req.user.userId, req.user.role))) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    const result = await pool.query(
      `INSERT INTO task_comments (task_id, author_id, body) VALUES ($1, $2, $3)
       RETURNING id, task_id, body, created_at, author_id`,
      [id, req.user.userId, body.trim()]
    );
    const comment = result.rows[0];
    const userResult = await pool.query('SELECT name, role FROM users WHERE id = $1', [req.user.userId]);
    res.status(201).json({ ...comment, author_name: userResult.rows[0]?.name, author_role: userResult.rows[0]?.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create tables / seed the admin account on cold start. Fire-and-forget:
// routes don't depend on this having finished (each one queries the pool
// directly), and a failure here must never take down the whole function.
initDB().catch((err) => {
  console.error('Failed to initialize database:', err);
});

export { app, initDB };
export default app;
