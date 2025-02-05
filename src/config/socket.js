const logger = require('../utils/logger');
const MessageService = require('../services/messageService');

const socketConfig = (io) => {
    io.on('connection', (socket) => {
        logger.info('Nueva conexión de socket establecida');

        // Unirse a una sala
        socket.on('join_room', async (data) => {
            try {
                logger.info('Usuario intentando unirse a sala:', data);
                const { roomId } = data;
                
                socket.join(roomId);
                logger.info(`Usuario unido a sala: ${roomId}`);

                // Cargar historial de mensajes
                const history = await MessageService.getRoomMessages(roomId, 1, 50);
                socket.emit('room_history', history);

                // Notificar a otros usuarios
                socket.to(roomId).emit('user_joined', {
                    user: socket.user?.username || 'Anónimo',
                    timestamp: new Date()
                });

            } catch (error) {
                logger.error('Error en join_room:', error);
                socket.emit('error', { message: 'Error al unirse a la sala' });
            }
        });

        // Manejar mensajes
        socket.on('send_message', async (data) => {
            try {
                logger.info('Mensaje recibido:', data);
                
                // Crear el mensaje
                const messageData = {
                    content: data.content,
                    sender: {
                        id: socket.user?.id || 'anonymous',
                        username: socket.user?.username || 'Anónimo'
                    },
                    roomId: data.roomId,
                    timestamp: new Date()
                };

                // Guardar en la base de datos
                const savedMessage = await MessageService.createMessage(messageData);
                logger.info('Mensaje guardado:', savedMessage);

                // Emitir a todos en la sala
                io.to(data.roomId).emit('new_message', savedMessage);

            } catch (error) {
                logger.error('Error al enviar mensaje:', error);
                socket.emit('error', { message: 'Error al enviar el mensaje' });
            }
        });

        socket.on('disconnect', () => {
            logger.info('Usuario desconectado');
        });
    });
};

module.exports = socketConfig;