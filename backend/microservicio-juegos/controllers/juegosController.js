// controllers/juegosController.js
const User = require('../models/userModel');
const Game = require('../models/gamesModel');
const db = require('../config/dbJuegos');

const ListaJuegos = require('../models/listaJuegosModel');

const juegosController = {

    async addUser(req, res) {
        try {
          const { user, email } = req.body;
    
          // Verificar si el usuario ya existe por email
          let usuario = await User.findByEmail(email);
    
          if (!usuario) {
            // Si no existe, crear nuevo usuario
            const userId = await User.create({ user, email });
            usuario = { id: userId, user, email };
          }
    
          res.status(200).json({ message: 'Sesión iniciada correctamente', usuario });
        } catch (error) {
          res.status(500).json({ message: 'Error al iniciar sesión', error });
        }
      },
  /**
   * Agregar un nuevo juego a la base de datos
   */
  async addGame(req, res) {
    try {
      const { nombre, portada, descripcion, desarrollador, plataformas } = req.body;
      const juegoId = await Game.create({ nombre, portada, descripcion, desarrollador, plataformas });

      res.status(201).json({ message: 'Juego agregado correctamente', juegoId });
    } catch (error) {
      res.status(500).json({ message: 'Error al agregar juego', error });
    }
  },

  /**
   * Agregar un juego a la lista del usuario autenticado
   */
  async addGameToUserList(req, res) {
    try {
      const { email, juego_nombre } = req.body;

        // Obtener el ID del usuario a partir de su email
        const [userRows] = await db.execute(
            `SELECT id FROM user WHERE email = ?`, 
            [email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = userRows[0].id;

        // Obtener el ID del juego a partir de su nombre
        const [gameRows] = await db.execute(
            `SELECT id FROM juego WHERE nombre = ?`, 
            [juego_nombre]
        );

        if (gameRows.length === 0) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }

        const juego_id = gameRows[0].id;



      const juegos = await Game.findAll();
      const juegoExiste = juegos.some(juego => juego.id === juego_id);
      if (!juegoExiste) return res.status(404).json({ message: 'Juego no encontradooo' });

      await ListaJuegos.agregarJuegoALista({ usuario_id, juego_id });

      res.status(201).json({ message: 'Juego agregado a la lista del usuario' });
    } catch (error) {
      res.status(500).json({ message: 'Error al agregar juego a la lista', error });
    }
  },

  /**
   * Obtener los juegos de la lista del usuario
   */
  async getUserGames(req, res) {
    try {
        // Obtener el email desde el cuerpo de la solicitud (JSON)
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El email es obligatorio' });
        }

        // Consultar el ID del usuario a partir de su email
        const [userRows] = await db.execute(
            `SELECT id FROM user WHERE email = ?`, 
            [email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = userRows[0].id;

        // Obtener los juegos del usuario utilizando su ID
        const juegos = await ListaJuegos.obtenerJuegosPorUsuario(usuario_id);

        res.json({ juegos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los juegos del usuario' });
    }

  }
};

module.exports = juegosController;
