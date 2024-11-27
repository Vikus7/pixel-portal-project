const admin = require('../config/firebase.config');

const passwordRecoveryController = {
    verifyEmail: async (req, res) => {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico es requerido'
                });
            }

            try {
                // Verificar si el correo existe en Firebase
                const userRecord = await admin.auth().getUserByEmail(email);
                
                res.status(200).json({
                    success: true,
                    message: 'Correo verificado exitosamente',
                    uid: userRecord.uid
                });

            } catch (error) {
                return res.status(404).json({
                    success: false,
                    message: 'El correo electrónico no está registrado'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error en el servidor'
            });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { uid, newPassword } = req.body;

            if (!uid || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'UID y nueva contraseña son requeridos'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            try {
                await admin.auth().updateUser(uid, {
                    password: newPassword
                });

                res.status(200).json({
                    success: true,
                    message: 'Contraseña actualizada exitosamente'
                });
            } catch (error) {
                console.error('Error al actualizar contraseña:', error);
                res.status(400).json({
                    success: false,
                    message: 'Error al actualizar la contraseña'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error en el servidor'
            });
        }
    }
};

module.exports = passwordRecoveryController;