const chatService = require('../services/chatService');

function chatHandler(io) {
    // Almacenar usuarios conectados
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        // Manejar cuando un usuario se une al chat
        socket.on('join', (userData) => {
            const { userId, username } = userData;
            connectedUsers.set(socket.id, { userId, username });
            
            // Notificar a todos que un usuario se unió
            io.emit('userJoined', {
                username,
                message: `${username} se ha unido al chat`
            });
        });

        // Manejar mensajes privados
        socket.on('privateMessage', async (data) => {
            const { to, message } = data;
            const sender = connectedUsers.get(socket.id);

            if (sender) {
                // Guardar mensaje en el servicio
                await chatService.saveMessage({
                    from: sender.userId,
                    to,
                    message,
                    timestamp: new Date()
                });

                // Enviar mensaje al destinatario
                const recipientSocket = Array.from(connectedUsers.entries())
                    .find(([_, user]) => user.userId === to);

                if (recipientSocket) {
                    io.to(recipientSocket[0]).emit('privateMessage', {
                        from: sender.username,
                        message
                    });
                }
            }
        });

        // Manejar mensajes globales
        socket.on('globalMessage', async (message) => {
            const sender = connectedUsers.get(socket.id);
            if (sender) {
                // Guardar mensaje global
                await chatService.saveGlobalMessage({
                    from: sender.userId,
                    message,
                    timestamp: new Date()
                });

                // Enviar a todos los usuarios
                io.emit('globalMessage', {
                    from: sender.username,
                    message
                });
            }
        });

        // Manejar cuando un usuario está escribiendo
        socket.on('typing', (isTyping) => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                socket.broadcast.emit('userTyping', {
                    username: user.username,
                    isTyping
                });
            }
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                io.emit('userLeft', {
                    username: user.username,
                    message: `${user.username} ha dejado el chat`
                });
                connectedUsers.delete(socket.id);
            }
        });
    });
}

module.exports = chatHandler;