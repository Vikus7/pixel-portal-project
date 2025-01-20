const db = require('../config/db');

const gameAccess = {
  getGamesByUser: async (userId) => {
    const [games] = await db.query(
      `SELECT j.* 
       FROM biypgq3fbzz9f3p2sfgs.juego j
       INNER JOIN biypgq3fbzz9f3p2sfgs.listas_juegos lj ON j.id = lj.juego_id
       WHERE lj.usuario_id = ?`,
      [userId]
    );
    return games;
  },

  createGame: async (gameData) => {
    try {
      console.log('Creando juego con datos:', gameData);
      
      // Validar datos antes de la inserción
      if (!gameData.nombre || !gameData.descripcion || !gameData.desarrollador || !gameData.plataformas) {
        throw new Error('Faltan datos requeridos para crear el juego');
      }
  
      const [result] = await db.query(
        'INSERT INTO biypgq3fbzz9f3p2sfgs.juego (nombre, portada, descripcion, desarrollador, plataformas) VALUES (?, ?, ?, ?, ?)',
        [
          gameData.nombre,
          gameData.portada || null,
          gameData.descripcion,
          gameData.desarrollador,
          gameData.plataformas
        ]
      );
      
      console.log('Resultado inserción:', result);
      return result.insertId;
    } catch (error) {
      console.error('Error en createGame de gameAccess:', error);
      throw error;
    }
  },
  
  associateGameWithUser: async (userId, gameId) => {
    try {
      console.log('Asociando juego', gameId, 'con usuario', userId);
      await db.query(
        'INSERT INTO biypgq3fbzz9f3p2sfgs.listas_juegos (usuario_id, juego_id) VALUES (?, ?)',
        [userId, gameId]
      );
      console.log('Asociación exitosa');
    } catch (error) {
      console.error('Error al asociar juego con usuario:', error);
      throw error;
    }
  },

  getGameById: async (gameId) => {
    try {
      const [games] = await db.query(
        'SELECT * FROM biypgq3fbzz9f3p2sfgs.juego WHERE id = ?',
        [gameId]
      );
      return games[0];
    } catch (error) {
      console.error('Error al obtener juego por ID:', error);
      throw error;
    }
  },

  updateGame: async (gameId, gameData) => {
    try {
      await db.query(
        'UPDATE biypgq3fbzz9f3p2sfgs.juego SET nombre = ?, portada = ?, descripcion = ?, desarrollador = ?, plataformas = ? WHERE id = ?',
        [
          gameData.nombre,
          gameData.portada || null,
          gameData.descripcion,
          gameData.desarrollador,
          gameData.plataformas,
          gameId
        ]
      );
    } catch (error) {
      console.error('Error al actualizar juego:', error);
      throw error;
    }
  },

  deleteGame: async (userId, gameId) => {
    try {
      await db.query(
        'DELETE FROM biypgq3fbzz9f3p2sfgs.listas_juegos WHERE usuario_id = ? AND juego_id = ?',
        [userId, gameId]
      );
      // Opcionalmente, podrías también eliminar el juego si no está asociado con otros usuarios
    } catch (error) {
      console.error('Error al eliminar juego:', error);
      throw error;
    }
  }
};

module.exports = gameAccess;