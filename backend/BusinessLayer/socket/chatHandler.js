const admin = require('../config/firebase.config');

function chatHandler(io) {
    const connectedUsers = new Map(); // Almacena {socketId: userData}

    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        // Cuando un usuario se une al chat
        socket.on('joinChat', (userData) => {
            connectedUsers.set(socket.id, userData);
            io.emit('userJoined', {
                message: `${userData.username} se ha unido al chat`,
                timestamp: new Date()
            });
        });

        // Cuando se recibe un mensaje
        socket.on('globalMessage', (message) => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                io.emit('newMessage', {
                    username: user.username,
                    message: message,
                    timestamp: new Date()
                });
            }
        });

        // Cuando un usuario se desconecta
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                io.emit('userLeft', {
                    message: `${user.username} ha dejado el chat`,
                    timestamp: new Date()
                });
                connectedUsers.delete(socket.id);
            }
        });
    });
}

module.exports = chatHandler;