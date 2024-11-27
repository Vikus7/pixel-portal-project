const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rutas existentes
router.get('/users/:userId/games', userController.getUserGames);
router.post('/users/id', userController.getUserId);

// Nuevas rutas
router.post('/users', userController.createUser);
router.post('/games', userController.createGame);
router.post('/games/user-association', userController.associateGameWithUser);

module.exports = router;