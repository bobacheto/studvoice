const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get all ideas
  router.get('/', (req, res) => {
    db.all(
      'SELECT id, title, description, status, upvote_count, created_at FROM ideas WHERE status IN (?, ?) ORDER BY created_at DESC',
      ['approved', 'pending'],
      (err, ideas) => {
        if (err) {
          return res.status(500).json({ error: 'Грешка при изтегляне' });
        }
        res.json(ideas || []);
      }
    );
  });

  // Create idea
  router.post('/create', (req, res) => {
    const { title, description, userId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Заглавието е задължително' });
    }

    db.run(
      'INSERT INTO ideas (title, description, created_by, status) VALUES (?, ?, ?, ?)',
      [title, description || '', userId || 1, 'approved'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Грешка при създаване' });
        }
        res.status(201).json({
          id: this.lastID,
          title,
          description,
          status: 'approved',
          upvote_count: 0,
          message: 'Идеята е успешно създадена'
        });
      }
    );
  });

  // Upvote idea
  router.post('/:id/upvote', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    // Check if user already upvoted
    db.get(
      'SELECT id FROM idea_upvotes WHERE idea_id = ? AND user_id = ?',
      [id, userId || 1],
      (err, existing) => {
        if (existing) {
          return res.status(409).json({ error: 'Вече сте подкрепили тази идея' });
        }

        // Record upvote
        db.run(
          'INSERT INTO idea_upvotes (idea_id, user_id) VALUES (?, ?)',
          [id, userId || 1],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Грешка при подкрепа' });
            }

            // Update upvote count
            db.run(
              'UPDATE ideas SET upvote_count = upvote_count + 1 WHERE id = ?',
              [id],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Грешка при обновяване' });
                }
                res.json({ message: 'Вашата подкрепа е регистрирана' });
              }
            );
          }
        );
      }
    );
  });

  return router;
};
