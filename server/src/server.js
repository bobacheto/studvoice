const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Грешка при свързване с базата:', err);
  } else {
    console.log('✓ Свързано към SQLite базата');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT NOT NULL,
        school_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Votes (polls) table
    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        yes_count INTEGER DEFAULT 0,
        no_count INTEGER DEFAULT 0,
        created_by INTEGER,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(created_by) REFERENCES users(id)
      )
    `);

    // Vote responses table
    db.run(`
      CREATE TABLE IF NOT EXISTS vote_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vote_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        choice TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(vote_id, user_id),
        FOREIGN KEY(vote_id) REFERENCES votes(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Ideas table
    db.run(`
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        upvote_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(created_by) REFERENCES users(id)
      )
    `);

    // Idea upvotes table
    db.run(`
      CREATE TABLE IF NOT EXISTS idea_upvotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idea_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id),
        FOREIGN KEY(idea_id) REFERENCES ideas(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    console.log('✓ Таблиците са готови');
  });
}

// Routes
const authRoutes = require('./routes/auth');
const votesRoutes = require('./routes/votes');
const ideasRoutes = require('./routes/ideas');

app.use('/auth', authRoutes(db, JWT_SECRET));
app.use('/votes', votesRoutes(db));
app.use('/ideas', ideasRoutes(db));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Сървърът е стартиран на http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('❌ Грешка при затваряне на БД:', err);
    else console.log('✓ БД е затворена');
    process.exit(0);
  });
});

module.exports = { db };
