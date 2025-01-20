const db = require('../config/db');

const userController = {
  getUserId: async (req, res) => {
    const { nombreUsuario, email } = req.body;

    try {
      const [users] = await db.query(
        'SELECT id FROM biypgq3fbzz9f3p2sfgs.usuario WHERE nombre_usuario = ? AND email = ?',
        [nombreUsuario, email]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'No se encontró el usuario.' });
      }
      res.json({ userId: users[0].id });
    } catch (error) {
      console.error('Error al obtener ID:', error);
      res.status(500).json({ message: 'Error al obtener el ID del usuario.' });
    }
  },

  createUser: async (req, res) => {
    const { nombre_usuario, email, foto_perfil } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO biypgq3fbzz9f3p2sfgs.usuario (nombre_usuario, email, foto_perfil) VALUES (?, ?, ?)',
        [nombre_usuario, email, foto_perfil]
      );
      
      res.status(201).json({
        success: true,
        userId: result.insertId
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al crear el usuario.' 
      });
    }
  }
};

module.exports = userController;