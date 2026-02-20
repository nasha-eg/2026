
import express from 'express';
import cors from 'cors';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

let db: any;

// Initialize SQLite Database
async function initDB() {
  try {
    db = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database');
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name_ar TEXT, name_en TEXT,
        description_ar TEXT, description_en TEXT,
        images TEXT, category TEXT, price TEXT
      );
      
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title_ar TEXT, title_en TEXT,
        content_ar TEXT, content_en TEXT,
        image TEXT, date TEXT
      );

      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        url TEXT, title_ar TEXT, title_en TEXT, category TEXT
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        author TEXT, rating INTEGER,
        comment_ar TEXT, comment_en TEXT, avatar TEXT
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT, email TEXT, msg TEXT, date TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        phone TEXT, whatsapp TEXT, logo TEXT,
        address_ar TEXT, address_en TEXT,
        heroTitle_ar TEXT, heroTitle_en TEXT,
        heroSub_ar TEXT, heroSub_en TEXT, heroImage TEXT
      );
    `);

    // Check if settings exist, if not insert default
    const settings = await db.get('SELECT * FROM settings WHERE id = 1');
    if (!settings) {
      await db.run(`
        INSERT INTO settings (id, phone, whatsapp, logo, address_ar, address_en, heroTitle_ar, heroTitle_en, heroSub_ar, heroSub_en, heroImage)
        VALUES (1, '01000187892', '201000187892', '', 'Damietta', 'Damietta', 'Capital Charcoal', 'Capital Charcoal', 'Quality', 'Quality', '')
      `);
    }

    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM products');
    const products = rows.map((r: any) => ({
      id: r.id,
      name: { ar: r.name_ar, en: r.name_en },
      description: { ar: r.description_ar, en: r.description_en },
      images: JSON.parse(r.images || '[]'),
      category: r.category,
      price: r.price
    }));
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const products = req.body;
    await db.run('DELETE FROM products');
    for (const p of products) {
      await db.run(
        'INSERT INTO products (id, name_ar, name_en, description_ar, description_en, images, category, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.name.ar, p.name.en, p.description.ar, p.description.en, JSON.stringify(p.images), p.category, p.price]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM articles');
    const articles = rows.map((r: any) => ({
      id: r.id,
      title: { ar: r.title_ar, en: r.title_en },
      content: { ar: r.content_ar, en: r.content_en },
      image: r.image,
      date: r.date
    }));
    res.json(articles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const articles = req.body;
    await db.run('DELETE FROM articles');
    for (const a of articles) {
      await db.run(
        'INSERT INTO articles (id, title_ar, title_en, content_ar, content_en, image, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [a.id, a.title.ar, a.title.en, a.content.ar, a.content.en, a.image, a.date]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM gallery');
    const gallery = rows.map((r: any) => ({
      id: r.id,
      url: r.url,
      title: { ar: r.title_ar, en: r.title_en },
      category: r.category
    }));
    res.json(gallery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const items = req.body;
    await db.run('DELETE FROM gallery');
    for (const i of items) {
      await db.run(
        'INSERT INTO gallery (id, url, title_ar, title_en, category) VALUES (?, ?, ?, ?, ?)',
        [i.id, i.url, i.title.ar, i.title.en, i.category]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM reviews');
    const reviews = rows.map((r: any) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: { ar: r.comment_ar, en: r.comment_en },
      avatar: r.avatar
    }));
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const reviews = req.body;
    await db.run('DELETE FROM reviews');
    for (const r of reviews) {
      await db.run(
        'INSERT INTO reviews (id, author, rating, comment_ar, comment_en, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        [r.id, r.author, r.rating, r.comment.ar, r.comment.en, r.avatar]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM inquiries ORDER BY date DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiries = req.body;
    await db.run('DELETE FROM inquiries');
    for (const i of inquiries) {
      await db.run(
        'INSERT INTO inquiries (id, name, email, msg, date) VALUES (?, ?, ?, ?, ?)',
        [i.id, i.name, i.email, i.msg, i.date]
      );
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const r = await db.get('SELECT * FROM settings WHERE id = 1');
    if (!r) return res.json({});
    res.json({
      phone: r.phone,
      whatsapp: r.whatsapp,
      logo: r.logo,
      address: { ar: r.address_ar, en: r.address_en },
      heroTitle: { ar: r.heroTitle_ar, en: r.heroTitle_en },
      heroSub: { ar: r.heroSub_ar, en: r.heroSub_en },
      heroImage: r.heroImage
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const s = req.body;
    await db.run('DELETE FROM settings');
    await db.run(
      'INSERT INTO settings (id, phone, whatsapp, logo, address_ar, address_en, heroTitle_ar, heroTitle_en, heroSub_ar, heroSub_en, heroImage) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [s.phone, s.whatsapp, s.logo, s.address.ar, s.address.en, s.heroTitle.ar, s.heroTitle.en, s.heroSub.ar, s.heroSub.en, s.heroImage]
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware for development
async function setupVite() {
  await initDB();
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
