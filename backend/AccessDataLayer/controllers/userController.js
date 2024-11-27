const db = require('../config/db');

const getUserGames = async (req, res) => {
  const { userId } = req.params;

  try {
    const [games] = await db.query('SELECT * FROM games WHERE userId = ?', [userId]);
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
    const [users] = await db.query('SELECT id FROM users WHERE nombreUsuario = ? AND email = ?', [nombreUsuario, email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No se encontró el usuario.' });
    }
    res.json({ userId: users[0].id });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el ID del usuario.' });
  }
};

const createUser = async (req, res) => {
  const { nombre_usuario, email, foto_perfil } = req.body;  // Cambiado para coincidir con el formato

  try {
    console.log('Intentando crear usuario:', { nombre_usuario, email, foto_perfil });

    const [results] = await db.query(
      'INSERT INTO usuario (nombre_usuario, email, foto_perfil) VALUES (?, ?, ?)', 
      [nombre_usuario, email, foto_perfil]
    );
    
    console.log('Usuario creado:', results);
    
    res.status(201).json({ 
      success: true,
      message: 'Usuario creado exitosamente.',
      userId: results.insertId 
    });
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear el usuario.',
      error: {
        message: err.message,
        code: err.code,
        sqlMessage: err.sqlMessage
      }
    });
  }
};

const createGame = async (req, res) => {
  const { nombreJuego, descripcion } = req.body;

  try {
    const [results] = await db.query('INSERT INTO games (nombreJuego, descripcion) VALUES (?, ?)', [nombreJuego, descripcion]);
    res.status(201).json({ message: 'Juego creado exitosamente.', gameId: results.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el juego.', error: err });
  }
};

const associateGameWithUser = async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    await db.query('INSERT INTO user_games (userId, gameId) VALUES (?, ?)', [userId, gameId]);
    res.status(201).json({ message: 'Juego asociado al usuario exitosamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al asociar el juego con el usuario.', error: err });
  }
};

module.exports = { getUserGames, getUserId, createUser, createGame, associateGameWithUser };