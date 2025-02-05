const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Middleware para rutas HTTP
const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Token not provided.' 
            });
        }

        try {
            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Agregar la información del usuario al request
            req.user = {
                id: decoded.userId,
                username: decoded.username,
                email: decoded.email
            };
            
            next();
        } catch (error) {
            logger.error('Token verification failed:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token.' 
            });
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error in authentication.' 
        });
    }
};

// Middleware para WebSocket
const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            next(new Error('Authentication token not provided'));
            return;
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardar la información del usuario en el socket
        socket.user = {
            id: decoded.userId,
            username: decoded.username,
            email: decoded.email
        };

        logger.info(`Socket authenticated for user: ${decoded.username}`);
        next();
    } catch (error) {
        logger.error('Socket authentication failed:', error);
        next(new Error('Authentication failed'));
    }
};

module.exports = {
    authMiddleware,
    socketAuthMiddleware
};