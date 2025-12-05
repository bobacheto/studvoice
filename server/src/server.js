require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import utilities
const db = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const ideaRoutes = require('./routes/ideas');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        school_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Votes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        optionYes TEXT DEFAULT 'Да',
        optionNo TEXT DEFAULT 'Не',
        countYes INTEGER DEFAULT 0,
        countNo INTEGER DEFAULT 0,
        userId INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Vote responses table
    await db.run(`
      CREATE TABLE IF NOT EXISTS vote_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vote_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        choice TEXT NOT NULL CHECK(choice IN ('yes', 'no')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(vote_id, user_id),
        FOREIGN KEY (vote_id) REFERENCES votes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Ideas table
    await db.run(`
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        userId INTEGER NOT NULL,
        author TEXT DEFAULT 'Анонимен',
        status TEXT DEFAULT 'pending',
        upvotes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Idea upvotes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS idea_upvotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idea_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id),
        FOREIGN KEY (idea_id) REFERENCES ideas(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✓ Database tables initialized');
  } catch (err) {
    console.error('✗ Database initialization error:', err);
    process.exit(1);
  }
}

// Routes
app.use('/auth', authRoutes);
app.use('/votes', voteRoutes);
app.use('/ideas', ideaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await db.connect();
    
    // Initialize database tables
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log('✓ Database connected and ready');
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await db.close();
  process.exit(0);
});
