// models/listaJuegosModel.js
const db = require('../config/dbJuegos');

class ListaJuegos {
  static async agregarJuegoALista({ usuario_id, juego_id }) {
    const [result] = await db.execute(
      'INSERT INTO listas_juegos (usuario_id, juego_id) VALUES (?, ?)',
      [usuario_id, juego_id]
    );
    return result.insertId;
  }

  static async obtenerJuegosPorUsuario(usuario_id) {
    const [rows] = await db.execute(
      `SELECT j.*
       FROM juego j
       INNER JOIN listas_juegos lj ON j.id = lj.juego_id
       WHERE lj.usuario_id = ?`,
      [usuario_id]
    );
    return rows;
  }
}

module.exports = ListaJuegos;
