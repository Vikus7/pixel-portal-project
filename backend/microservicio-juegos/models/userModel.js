// models/userModel.js
const db = require('../config/dbJuegos');

class User {
  static async create({ user, email }) {
    const [result] = await db.execute(
      'INSERT INTO user (user, email) VALUES (?, ?)',
      [user, email]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = User;
