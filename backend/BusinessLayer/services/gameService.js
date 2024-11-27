const axios = require('axios');

const DATA_LAYER_URL = 'http://localhost:3000/api'; // URL de la capa de Acceso a datos

const gameService = {
    getUserGames: async (userId) => {
        try {
            const response = await axios.get(`${DATA_LAYER_URL}/user/${userId}/games`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener juegos del usuario');
        }
    },

    addGame: async (gameData, userId) => {
        try {
            const response = await axios.post(`${DATA_LAYER_URL}/games`, {
                ...gameData,
                userId
            });
            return response.data;
        } catch (error) {
            throw new Error('Error al agregar juego');
        }
    }
};

module.exports = gameService;