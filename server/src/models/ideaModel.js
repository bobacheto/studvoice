const db = require('../utils/db');

class IdeaModel {
  async createIdea(title, description = '', userId, author = 'Анонимен') {
    const sql = `INSERT INTO ideas (title, description, userId, author, status) VALUES (?, ?, ?, ?, 'pending')`;
    const res = await db.run(sql, [title, description, userId, author]);
    return res.id;
  }

  async getAllIdeas(statuses = ['approved', 'pending']) {
    const placeholders = statuses.map(() => '?').join(',');
    const sql = `SELECT * FROM ideas WHERE status IN (${placeholders}) ORDER BY created_at DESC`;
    return await db.all(sql, statuses);
  }

  async getIdeaById(id) {
    return await db.get('SELECT * FROM ideas WHERE id = ?', [id]);
  }

  async addUpvote(ideaId, userId) {
    await db.run('INSERT INTO idea_upvotes (idea_id, user_id) VALUES (?, ?)', [ideaId, userId]);
    await db.run('UPDATE ideas SET upvotes = upvotes + 1 WHERE id = ?', [ideaId]);
  }

  async userHasUpvoted(ideaId, userId) {
    const row = await db.get('SELECT id FROM idea_upvotes WHERE idea_id = ? AND user_id = ?', [ideaId, userId]);
    return !!row;
  }
}

module.exports = new IdeaModel();
