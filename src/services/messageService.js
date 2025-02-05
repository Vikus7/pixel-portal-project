const Message = require('../models/message');
const logger = require('../utils/logger');

class MessageService {
    // Crear un nuevo mensaje
    static async createMessage(messageData) {
        try {
            const message = new Message({
                content: messageData.content,
                sender: messageData.sender,
                roomId: messageData.roomId,
                timestamp: messageData.timestamp || new Date()
            });

            await message.save();
            logger.info(`Mensaje guardado con ID: ${message._id}`);
            return message;
        } catch (error) {
            logger.error('Error creando mensaje:', error);
            throw error;
        }
    }

    // Obtener mensajes de una sala
    static async getRoomMessages(roomId, page = 1, limit = 50) {
        try {
            const messages = await Message.find({ roomId })
                .sort({ timestamp: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();

            const total = await Message.countDocuments({ roomId });

            return {
                messages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error obteniendo mensajes:', error);
            throw error;
        }
    }

    // Obtener un mensaje específico
    static async getMessage(messageId) {
        try {
            return await Message.findById(messageId);
        } catch (error) {
            logger.error('Error obteniendo mensaje:', error);
            throw error;
        }
    }

    // Eliminar un mensaje
    static async deleteMessage(messageId) {
        try {
            return await Message.findByIdAndDelete(messageId);
        } catch (error) {
            logger.error('Error eliminando mensaje:', error);
            throw error;
        }
    }
}

module.exports = MessageService;