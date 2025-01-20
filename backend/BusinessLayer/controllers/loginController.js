const admin = require('../config/firebase.config');
const axios = require('axios'); // Agregar esta importación

const loginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario y la contraseña son requeridos'
                });
            }

            try {
                // Buscar usuario por nombre de usuario
                const userList = await admin.auth().listUsers();
                const userRecord = userList.users.find(
                    user => user.displayName === username
                );

                if (!userRecord) {
                    return res.status(401).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    });
                }

                try {
                    // Obtener ID de la base de datos
                    const dbResponse = await axios.post('http://localhost:3000/api/users/id', {
                        nombreUsuario: username,
                        email: userRecord.email
                    });

                    // En este punto el usuario existe y tenemos su ID de la DB
                    res.status(200).json({
                        success: true,
                        message: 'Login exitoso',
                        user: {
                            uid: userRecord.uid,
                            email: userRecord.email,
                            displayName: userRecord.displayName,
                            dbId: dbResponse.data.userId
                        }
                    });
                } catch (dbError) {
                    // Si hay error al obtener el ID, aún permitimos el login
                    console.error('Error al obtener ID de DB:', dbError);
                    res.status(200).json({
                        success: true,
                        message: 'Login exitoso',
                        user: {
                            uid: userRecord.uid,
                            email: userRecord.email,
                            displayName: userRecord.displayName
                        }
                    });
                }

            } catch (error) {
                console.error('Error al buscar usuario:', error);
                return res.status(401).json({
                    success: false,
                    message: 'Error en la autenticación'
                });
            }

        } catch (error) {
            console.error('Error en login:', error);
            res.status(401).json({
                success: false,
                message: 'Error en el servidor durante la autenticación'
            });
        }
    }
};

module.exports = loginController;