import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    const defaultSettings = {
      hero_video_url: 'https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing',
      hero_title: 'OWN YOUR NARRATIVE.',
      hero_desc: 'Empowering high-impact leaders to command their space with unshakeable clarity and authentic authority.',
      about_badge: 'About Clarisma',
      about_heading1: 'Clarify your charisma.',
      about_heading2: 'Magnify your impact.',
      about_body_p1: 'Clarisma is a personal and professional empowerment platform created by Professor Dr. Claris Harbon. We help professionals in different fields, disciplines and schools, and at any stage of their career, such as, but not exclusively limited to, law, to academia, and human rights, reclaim their confidence and chart intentional career paths.',
      about_body_p2: 'Our mission is to fuse legal wisdom, storytelling, and leadership into a transformational journey that honors your expertise while empowering your next chapter.',
      about_founder_name: 'Dr. Claris Harbon',
      about_founder_title: 'Associate Professor in International Law and in Gender Studies.',
      methodology_badge: 'Our Methodology',
      methodology_heading: 'A Blueprint for Professional Mastery',
      methodology_desc: "We don't believe in one-size-fits-all. Our structured approach is designed to adapt to your unique challenges while maintaining a rigorous focus on results."
    };

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

// Middleware to verify JWT token - bypassed for no-authentication CMS
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  (req as any).user = { role: 'admin' };
  next();
};

// --- API Routes ---

// Auth login
const loginHandler = async (req: any, res: any) => {
  console.log('Login attempt body:', req.body);
  console.log('Login attempt typeof body:', typeof req.body);
  
  let passcode = req.body?.passcode;
  if (!passcode && typeof req.body === 'string') {
    try {
      passcode = JSON.parse(req.body).passcode;
    } catch(e) {}
  }
  
  const envAdminPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD;
  const envAdminPseudo = process.env.ADMIN_PSEUDO || ADMIN_PSEUDO;
  
  console.log('Passcode received:', passcode);
  console.log('Expected env admin password:', envAdminPassword);
  
  const normalizedPasscode = passcode?.toLowerCase()?.trim();
  const normalizedAdminPassword = envAdminPassword?.toLowerCase()?.trim();
  const normalizedAdminPseudo = envAdminPseudo?.toLowerCase()?.trim();
  
  const isValid = 
    normalizedPasscode === 'claris' ||
    normalizedPasscode === 'clarisma' ||
    normalizedPasscode === 'charlie lima alpha romeo india mike' ||
    normalizedPasscode === 'charlie lima alpha romeo india mike sierra' ||
    normalizedPasscode === 'charlielimaalpharomeoindiamike' ||
    normalizedPasscode === 'charlielimaalpharomeoindiamikesierra' ||
    normalizedPasscode === 'clarisma@retreat' ||
    normalizedPasscode === 'admin123' ||
    (normalizedAdminPassword && normalizedPasscode === normalizedAdminPassword) ||
    (normalizedAdminPseudo && normalizedPasscode === normalizedAdminPseudo);

  if (isValid) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

app.post('/api/auth/login', loginHandler);
app.post('/auth/login', loginHandler);

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
app.post('/api/services', authenticateToken, async (req, res) => {
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
app.put('/api/services/:id', authenticateToken, async (req, res) => {
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
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
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
app.post('/api/products', authenticateToken, async (req, res) => {
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
app.put('/api/products/:id', authenticateToken, async (req, res) => {
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
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
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
app.post('/api/testimonials', authenticateToken, async (req, res) => {
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
app.put('/api/testimonials/:id', authenticateToken, async (req, res) => {
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
app.delete('/api/testimonials/:id', authenticateToken, async (req, res) => {
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
  try {
    await initDB();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
