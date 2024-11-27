const admin = require('../config/firebase.config');

const registerController = {
    register: async (req, res) => {
        try {
            const { 
                email, 
                password, 
                nombreUsuario
            } = req.body;
            
            // Validación de campos requeridos
            if (!email || !password || !nombreUsuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios'
                });
            }

            // Validación de formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato del correo electrónico no es válido'
                });
            }

            // Validación de longitud de contraseña
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            // Validación de nombre de usuario
            if (nombreUsuario.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario debe tener al menos 3 caracteres'
                });
            }

            // Verificar si el nombre de usuario ya existe
            const userList = await admin.auth().listUsers();
            const userExists = userList.users.find(
                user => user.displayName === nombreUsuario
            );

            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }

            // Crear usuario en Firebase Auth
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: nombreUsuario
            });

            // Actualizar perfil del usuario
            await admin.auth().updateUser(userRecord.uid, {
                displayName: nombreUsuario
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: nombreUsuario
                }
            });

        } catch (error) {
            // Manejar errores específicos de Firebase
            let errorMessage = 'Error al registrar usuario';

            if (error.code === 'auth/email-already-exists') {
                errorMessage = 'El correo electrónico ya está registrado';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido';
            } else if (error.code === 'auth/invalid-password') {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'La contraseña es demasiado débil';
            }

            console.error('Error en el registro:', error);
            res.status(400).json({
                success: false,
                message: errorMessage,
                error: error.code
            });
        }
    }
};

module.exports = registerController;