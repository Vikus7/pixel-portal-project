const express = require('express');
const { getUserGames } = require('../controllers/userController');
const { getUserId } = require('../controllers/userController');

const router = express.Router();

// Ruta para obtener los juegos de un usuario
router.get('/users/:userId/games', getUserGames);
// Ruta para obtener el ID del usuario
router.post('/users/id', getUserId);

module.exports = router;
