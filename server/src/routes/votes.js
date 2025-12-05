const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Get all votes
  router.get('/', (req, res) => {
    db.all(
      'SELECT id, title, description, yes_count, no_count, created_at FROM votes WHERE status = ? ORDER BY created_at DESC',
      ['approved'],
      (err, votes) => {
        if (err) {
          return res.status(500).json({ error: 'Грешка при изтегляне' });
        }
        res.json(votes || []);
      }
    );
  });

  // Create vote
  router.post('/create', (req, res) => {
    const { title, description, userId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Заглавието е задължително' });
    }

    db.run(
      'INSERT INTO votes (title, description, created_by, status) VALUES (?, ?, ?, ?)',
      [title, description || '', userId || null, 'approved'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Грешка при създаване' });
        }
        res.status(201).json({
          id: this.lastID,
          title,
          description,
          yes_count: 0,
          no_count: 0,
          message: 'Гласуването е създадено'
        });
      }
    );
  });

  // Vote on poll
  router.post('/:id/vote', (req, res) => {
    const { id } = req.params;
    const { choice, userId } = req.body;

    if (!choice || !['yes', 'no'].includes(choice)) {
      return res.status(400).json({ error: 'choice трябва да е yes или no' });
    }

    // Check if user already voted
    db.get(
      'SELECT id FROM vote_responses WHERE vote_id = ? AND user_id = ?',
      [id, userId || 1],
      (err, existing) => {
        if (existing) {
          return res.status(409).json({ error: 'Вече сте гласували' });
        }

        // Record vote
        db.run(
          'INSERT INTO vote_responses (vote_id, user_id, choice) VALUES (?, ?, ?)',
          [id, userId || 1, choice],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Грешка при гласуване' });
            }

            // Update counts
            const column = choice === 'yes' ? 'yes_count' : 'no_count';
            db.run(
              `UPDATE votes SET ${column} = ${column} + 1 WHERE id = ?`,
              [id],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Грешка при обновяване' });
                }
                res.json({ message: 'Вашият глас е отчетен' });
              }
            );
          }
        );
      }
    );
  });

  return router;
};
