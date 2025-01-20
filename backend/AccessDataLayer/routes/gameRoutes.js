const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/users/:userId/games', gameController.getUserGames);
router.post('/games', gameController.createGame);
router.put('/games/:gameId', gameController.updateGame);
router.delete('/games/:userId/:gameId', gameController.deleteGame);

module.exports = router;