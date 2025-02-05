const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const socketConfig = require('./config/socket');
const logger = require('./utils/logger');

// Load environment variables
require('dotenv').config();

// Initialize express
const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
    origin: '*',
    credentials: true
}));

// Socket.IO setup with CORS
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize WebSocket
socketConfig(io);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Chat service is running' });
});

// Debug route to check messages
app.get('/api/debug/messages', async (req, res) => {
    try {
        const Message = require('./models/message');
        const messages = await Message.find()
            .sort({ timestamp: -1 })
            .limit(20);
        
        res.json({
            success: true,
            count: messages.length,
            messages: messages
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});