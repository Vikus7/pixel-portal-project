const gameService = require('../services/gameService');

const gameController = {
  addGame: async (req, res) => {
    try {
      console.log('Datos recibidos en gameController:', req.body);
      const game = await gameService.addGame(req.body);
      res.json({ success: true, game });
    } catch (error) {
      console.error('Error en addGame:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al crear juego'
      });
    }
  },

  getUserGames: async (req, res) => {
    try {
      console.log('Recibiendo petición de juegos para usuario:', req.params.userId);
      const games = await gameService.getUserGames(req.params.userId);
      console.log('Juegos encontrados:', games);
      res.json({ success: true, games });
    } catch (error) {
      console.error('Error en getUserGames:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error al obtener juegos' 
      });
    }
  },

  updateGame: async (req, res) => {
    try {
      const game = await gameService.updateGame(req.params.gameId, req.body);
      res.json({ success: true, game });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteGame: async (req, res) => {
    try {
      await gameService.deleteGame(req.params.userId, req.params.gameId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = gameController;