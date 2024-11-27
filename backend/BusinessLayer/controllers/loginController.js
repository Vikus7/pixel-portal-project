const admin = require('../config/firebase.config');

const loginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            // Validación de campos requeridos
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

                // En este punto el usuario existe
                res.status(200).json({
                    success: true,
                    message: 'Login exitoso',
                    user: {
                        uid: userRecord.uid,
                        email: userRecord.email,
                        displayName: userRecord.displayName
                    }
                });

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