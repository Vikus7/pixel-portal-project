const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/user/:userId', gameController.getUserGames);  // Asegúrate que esta ruta coincida
router.post('/', gameController.addGame);
router.put('/:gameId', gameController.updateGame);
router.delete('/:userId/:gameId', gameController.deleteGame);

module.exports = router;