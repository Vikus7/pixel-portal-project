const db = require('../config/db');

const gameController = {
  getUserGames: async (req, res) => {
    const { userId } = req.params;
    
    try {
      const [games] = await db.query(
        `SELECT j.* 
         FROM biypgq3fbzz9f3p2sfgs.juego j
         INNER JOIN biypgq3fbzz9f3p2sfgs.listas_juegos lj ON j.id = lj.juego_id
         WHERE lj.usuario_id = ?`,
        [userId]
      );
      
      res.json({
        success: true,
        games: games.length > 0 ? games : []
      });
    } catch (error) {
      console.error('Error al obtener juegos:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error al obtener juegos'
      });
    }
  },

  createGame: async (req, res) => {
    try {
      console.log('Datos recibidos para crear juego:', req.body);
      
      const { nombre, descripcion, desarrollador, plataformas, portada, userId } = req.body;
  
      // Validación de datos
      if (!nombre || !descripcion || !desarrollador || !plataformas || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para crear el juego'
        });
      }
  
      // Crear el juego
      const [gameResult] = await db.query(
        'INSERT INTO biypgq3fbzz9f3p2sfgs.juego (nombre, portada, descripcion, desarrollador, plataformas) VALUES (?, ?, ?, ?, ?)',
        [nombre, portada, descripcion, desarrollador, plataformas]
      );
      
      const gameId = gameResult.insertId;
  
      // Crear la relación usuario-juego
      await db.query(
        'INSERT INTO biypgq3fbzz9f3p2sfgs.listas_juegos (usuario_id, juego_id) VALUES (?, ?)',
        [userId, gameId]
      );
  
      const [newGame] = await db.query(
        'SELECT * FROM biypgq3fbzz9f3p2sfgs.juego WHERE id = ?',
        [gameId]
      );
  
      res.status(201).json({
        success: true,
        game: newGame[0]
      });
    } catch (error) {
      console.error('Error detallado al crear juego:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el juego',
        error: error.message
      });
    }
  },

  updateGame: async (req, res) => {
    try {
      const { gameId } = req.params;
      const data = req.body;

      await db.query(
        'UPDATE biypgq3fbzz9f3p2sfgs.juego SET nombre = ?, portada = ?, descripcion = ?, desarrollador = ?, plataformas = ? WHERE id = ?',
        [data.nombre, data.portada || null, data.descripcion, data.desarrollador, data.plataformas, gameId]
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar juego' });
    }
  },

  deleteGame: async (req, res) => {
    try {
      const { userId, gameId } = req.params;
      await db.query(
        'DELETE FROM biypgq3fbzz9f3p2sfgs.listas_juegos WHERE usuario_id = ? AND juego_id = ?',
        [userId, gameId]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar juego' });
    }
  }
};

module.exports = gameController;