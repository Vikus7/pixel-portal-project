const axios = require('axios');

const DATA_LAYER_URL = 'http://localhost:3000/api';

const gameService = {
  getUserGames: async (userId) => {
    try {
      console.log('Obteniendo juegos para usuario:', userId);
      const response = await axios.get(`${DATA_LAYER_URL}/users/${userId}/games`);
      return response.data;
    } catch (error) {
      console.error('Error en gameService.getUserGames:', error);
      throw error;
    }
  },

  addGame: async (gameData) => {
    try {
      console.log('Datos recibidos en gameService:', gameData);
      const response = await axios.post(`${DATA_LAYER_URL}/games`, gameData);
      return response.data;
    } catch (error) {
      console.error('Error en gameService.addGame:', error);
      throw error;
    }
  }
};

module.exports = gameService;