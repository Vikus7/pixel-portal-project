const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const MessageService = require('../services/messageService');

const socketConfig = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.user.username}`);

        socket.on('join_room', async (roomId) => {
            socket.join(roomId);
            const messages = await MessageService.getRoomMessages(roomId);
            socket.emit('room_history', messages);
        });

        socket.on('send_message', async (data) => {
            const messageData = {
                content: data.content,
                sender: socket.user,
                roomId: data.roomId
            };
            const savedMessage = await MessageService.createMessage(messageData);
            io.to(data.roomId).emit('new_message', savedMessage);
        });
    });
};

module.exports = socketConfig;