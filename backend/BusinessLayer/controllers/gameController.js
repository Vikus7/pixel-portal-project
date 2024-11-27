const gameService = require('../services/gameService');
const admin = require('../config/firebase.config');

const gameController = {
    getUserGames: async (req, res) => {
        try {
            const userId = req.params.userId;
            const games = await gameService.getUserGames(userId);
            res.json({ success: true, games });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    addGame: async (req, res) => {
        try {
            const { gameData, userId } = req.body;
            const game = await gameService.addGame(gameData, userId);
            res.json({ success: true, game });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = gameController;