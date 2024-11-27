const express = require('express');
const { getUserGames } = require('../controllers/userController');

const router = express.Router();

// Ruta para obtener los juegos de un usuario
router.get('/users/:userId/games', getUserGames);

module.exports = router;
