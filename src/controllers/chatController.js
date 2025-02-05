const Message = require('../models/message');
const logger = require('../utils/logger');

// Controladores para mensajes
const getMessages = async (roomId, page = 1, limit = 50) => {
    try {
        const messages = await Message.find({ roomId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await Message.countDocuments({ roomId });

        return {
            messages,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total
            }
        };
    } catch (error) {
        logger.error('Error getting messages:', error);
        throw error;
    }
};

// Controlador para guardar mensajes
const saveMessage = async (messageData) => {
    try {
        const message = new Message({
            content: messageData.content,
            sender: messageData.sender,
            roomId: messageData.roomId,
            timestamp: new Date()
        });

        await message.save();
        return message;
    } catch (error) {
        logger.error('Error saving message:', error);
        throw error;
    }
};

// Controlador para obtener historial
const getMessageHistory = async (roomId, startDate, endDate) => {
    try {
        const query = {
            roomId,
            timestamp: {}
        };

        if (startDate) {
            query.timestamp.$gte = new Date(startDate);
        }
        if (endDate) {
            query.timestamp.$lte = new Date(endDate);
        }

        return await Message.find(query)
            .sort({ timestamp: -1 })
            .exec();
    } catch (error) {
        logger.error('Error getting message history:', error);
        throw error;
    }
};

module.exports = {
    getMessages,
    saveMessage,
    getMessageHistory
};