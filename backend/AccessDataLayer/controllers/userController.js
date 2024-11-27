const gameAccess = require('../dataAccess/gameAccess');

const getUserGames = async (req, res) => {
  const { userId } = req.params;

  try {
    const games = await gameAccess.getGamesByUser(userId);
    if (games.length === 0) {
      return res.status(404).json({ message: 'No se encontraron juegos para este usuario.' });
    }
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los juegos del usuario.' });
  }
};

const getUserId = async (req, res) => {
  const { nombreUsuario, email } = req.body;

  try {
    const userId = await gameAccess.getUserIdFromDB(nombreUsuario, email);
    if (!userId) {
      return res.status(404).json({ message: 'No se encontró el usuario.' });
    }
    res.json({ userId });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ID del usuario.' });
  }
}

module.exports = { getUserGames , getUserId };
