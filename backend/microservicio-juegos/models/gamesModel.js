// models/gameModel.js
const db = require('../config/dbJuegos');

class Game {
  static async create({ nombre, portada, descripcion, desarrollador, plataformas }) {
    const [result] = await db.execute(
      'INSERT INTO juego (nombre, portada, descripcion, desarrollador, plataformas) VALUES (?, ?, ?, ?, ?)',
      [nombre, portada, descripcion, desarrollador, plataformas]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM juego');
    return rows;
  }
}

module.exports = Game;
