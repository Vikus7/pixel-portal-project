const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const chatController = require('../controllers/chatController');
const logger = require('../utils/logger');

// Middleware de autenticación
router.use(authMiddleware);

// Obtener mensajes de una sala con paginación
router.get('/messages/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        const result = await chatController.getMessages(roomId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        logger.error('Error in GET /messages/:roomId:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error retrieving messages'
        });
    }
});

// Obtener historial de mensajes con filtro de fechas
router.get('/messages/history/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const { startDate, endDate } = req.query;
        
        const messages = await chatController.getMessageHistory(roomId, startDate, endDate);
        res.json({
            success: true,
            messages
        });
    } catch (error) {
        logger.error('Error in GET /messages/history/:roomId:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error retrieving message history'
        });
    }
});

// Endpoint para guardar mensaje (aunque principalmente se use WebSocket)
router.post('/messages', async (req, res) => {
    try {
        const messageData = {
            content: req.body.content,
            sender: {
                id: req.user.id,
                username: req.user.username
            },
            roomId: req.body.roomId
        };
        
        const savedMessage = await chatController.saveMessage(messageData);
        res.status(201).json({
            success: true,
            message: savedMessage
        });
    } catch (error) {
        logger.error('Error in POST /messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving message'
        });
    }
});

module.exports = router;