const mysql = require('mysql2/promise');

// Configuración de conexión al servidor externo
const pool = mysql.createPool({
  host: 'biypgq3fbzz9f3p2sfgs-mysql.services.clever-cloud.com', // Dirección del servidor externo
  user: 'u1xr9hccodr7uovq',             // Usuario de la base de datos
  password: 'e0r60FW5XgFASXRJF4Tq',      // Contraseña del usuario
  database: 'biypgq3fbzz9f3p2sfgs',  // Nombre de la base de datos
  port: 3306,                     // Puerto de la base de datos (por defecto es 3306 para MySQL)
  waitForConnections: true,
  connectionLimit: 10,            // Número máximo de conexiones
  queueLimit: 0
});

module.exports = pool;
