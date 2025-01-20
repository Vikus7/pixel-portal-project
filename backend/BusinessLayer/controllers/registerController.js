const admin = require('../config/firebase.config');
const axios = require('axios'); // Agregar esta importación

const registerController = {
    register: async (req, res) => {
        let userRecord = null; // Mover la declaración aquí para que esté en el scope correcto
        
        try {
            const { 
                email, 
                password, 
                nombreUsuario,
                fotoPerfil
            } = req.body;
            
            // Validaciones existentes...

            // Crear usuario en Firebase Auth
            userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: nombreUsuario
            });

            // Actualizar perfil del usuario en Firebase
            await admin.auth().updateUser(userRecord.uid, {
                displayName: nombreUsuario
            });

            try {
                // Crear usuario en la base de datos MySQL
                const dbResponse = await axios.post('http://localhost:3000/api/users', {
                    nombre_usuario: nombreUsuario,
                    email: email,
                    foto_perfil: fotoPerfil || null
                });

                const userId = dbResponse.data.userId;

                res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    user: {
                        uid: userRecord.uid,
                        email: userRecord.email,
                        displayName: nombreUsuario,
                        dbId: userId,
                        fotoPerfil: fotoPerfil || null
                    }
                });

            } catch (dbError) {
                // Si falla la creación en DB, eliminar el usuario de Firebase
                await admin.auth().deleteUser(userRecord.uid);
                throw new Error('Error al crear usuario en la base de datos');
            }

        } catch (error) {
            console.error('Error en el registro:', error);
            
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

            res.status(400).json({
                success: false,
                message: error.message || errorMessage,
                error: error.code
            });
        }
    }
};

module.exports = registerController;