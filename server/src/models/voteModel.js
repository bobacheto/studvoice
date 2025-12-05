const db = require('../utils/db');

class VoteModel {
  async createVote(question, optionYes = 'Да', optionNo = 'Не', userId) {
    const sql = `INSERT INTO votes (question, optionYes, optionNo, userId, status) VALUES (?, ?, ?, ?, 'approved')`;
    const res = await db.run(sql, [question, optionYes, optionNo, userId]);
    return res.id;
  }

  async getAllVotes(status = 'approved') {
    const sql = 'SELECT * FROM votes WHERE status = ? ORDER BY created_at DESC';
    return await db.all(sql, [status]);
  }

  async getVoteById(id) {
    return await db.get('SELECT * FROM votes WHERE id = ?', [id]);
  }

  async addVote(voteId, userId, choice) {
    await db.run('INSERT INTO vote_responses (vote_id, user_id, choice) VALUES (?, ?, ?)', [voteId, userId, choice]);
    const field = choice === 'yes' ? 'countYes' : 'countNo';
    await db.run(`UPDATE votes SET ${field} = ${field} + 1 WHERE id = ?`, [voteId]);
  }

  async userHasVoted(voteId, userId) {
    const row = await db.get('SELECT id FROM vote_responses WHERE vote_id = ? AND user_id = ?', [voteId, userId]);
    return !!row;
  }
}

module.exports = new VoteModel();
