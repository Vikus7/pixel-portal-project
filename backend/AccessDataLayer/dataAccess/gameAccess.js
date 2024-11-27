const pool = require('../config/db');

const getGamesByUser = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          usuario.id AS usuario_id,
          usuario.nombre_usuario,
          juego.id AS juego_id,
          juego.nombre AS juego_nombre,
          juego.portada AS juego_portada,
          juego.descripcion AS juego_descripcion,
          juego.desarrollador AS juego_desarrollador,
          juego.plataformas AS juego_plataformas
       FROM 
          listas_juegos
       JOIN 
          usuario ON listas_juegos.usuario_id = usuario.id
       JOIN 
          juego ON listas_juegos.juego_id = juego.id
       WHERE 
          usuario.id = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener los juegos del usuario:', error);
    throw error;
  }
};

const getUserIdFromDB = async (nombreUsuario, email) => {
  try {
    console.log('Parámetros recibidos para la consulta:', { nombreUsuario, email }); // Depuración

    const [rows] = await pool.query(
      `SELECT id FROM usuario WHERE nombre_usuario = ? AND email = ? LIMIT 1`,
      [nombreUsuario, email]
    );

    console.log('Resultado de la consulta:', rows); // Depuración
    return rows.length > 0 ? rows[0].id : null; // Devuelve el ID o null si no se encuentra
  } catch (error) {
    console.error('Error al consultar el ID del usuario:', error);
    throw error;
  }
};


module.exports = { getGamesByUser,getUserIdFromDB };

