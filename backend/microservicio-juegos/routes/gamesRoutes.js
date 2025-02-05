// routes/authRoutes.js
const express = require('express');
const { addUser, addGame, getUserGames, addGameToUserList } = require('../controllers/juegosController');

const router = express.Router();

router.post('/addUser', addUser);
router.post('/addGame', addGame);
router.post('/addGameToUserList', addGameToUserList);
router.post('/getGames', getUserGames);


module.exports = router;