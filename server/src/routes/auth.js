const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (db, JWT_SECRET) => {
  const router = express.Router();

  // Register
  router.post('/register', (req, res) => {
    const { email, password, username, school_code } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password и username са задължителни' });
    }

    const query = `
      INSERT INTO users (email, password, username, school_code)
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [email, password, username, school_code || ''], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Този имейл вече е регистриран' });
        }
        return res.status(500).json({ error: 'Грешка при регистрация' });
      }

      const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({
        token,
        userId: this.lastID,
        username,
        message: 'Успешна регистрация'
      });
    });
  });

  // Login
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и password са задължителни' });
    }

    db.get(
      'SELECT id, email, username, password FROM users WHERE email = ?',
      [email],
      (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Грешка при вход' });
        }

        if (!user || user.password !== password) {
          return res.status(401).json({ error: 'Невалидни данни' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
          token,
          userId: user.id,
          username: user.username,
          email: user.email,
          message: 'Успешен вход'
        });
      }
    );
  });

  return router;
};
