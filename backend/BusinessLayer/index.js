const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const chatHandler = require('./socket/chatHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173", // URL de tu frontend
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas HTTP
app.use('/api/auth', authRoutes);

// Configuración de WebSocket
chatHandler(io);

server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});