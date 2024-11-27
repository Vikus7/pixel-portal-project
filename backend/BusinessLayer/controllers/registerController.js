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
                    nombre_usuario: nombreUsuario,  // Cambiado para coincidir con el formato de la DB
                    email: email,
                    foto_perfil: fotoPerfil || null
                });
            
                console.log('Respuesta de la base de datos:', dbResponse.data);
            
                if (!dbResponse.data.success) {
                    throw new Error(dbResponse.data.message || 'Error al crear usuario en la base de datos');
                }
            
                res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    user: {
                        uid: userRecord.uid,
                        email: userRecord.email,
                        displayName: nombreUsuario,
                        fotoPerfil: fotoPerfil || null
                    }
                });
            
            } catch (dbError) {
                console.error('Error completo al crear en DB:', dbError.response?.data || dbError);
                
                // Si falla la creación en DB, eliminar el usuario de Firebase
                if (userRecord?.uid) {
                    try {
                        await admin.auth().deleteUser(userRecord.uid);
                    } catch (deleteError) {
                        console.error('Error al eliminar usuario de Firebase:', deleteError);
                    }
                }
                throw new Error('Error al crear usuario en la base de datos: ' + (dbError.response?.data?.message || dbError.message));
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