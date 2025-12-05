const db = require('../utils/db');

class UserModel {
  async createUser(email, username, password, schoolCode = null) {
    const sql = `INSERT INTO users (email, username, password, school_code) VALUES (?, ?, ?, ?)`;
    const res = await db.run(sql, [email, username, password, schoolCode]);
    return res.id;
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await db.get(sql, [email]);
  }

  async getUserById(id) {
    const sql = 'SELECT id, email, username, school_code, created_at FROM users WHERE id = ?';
    return await db.get(sql, [id]);
  }

  async emailExists(email) {
    const row = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    return !!row;
  }

  async usernameExists(username) {
    const row = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    return !!row;
  }
}

module.exports = new UserModel();
