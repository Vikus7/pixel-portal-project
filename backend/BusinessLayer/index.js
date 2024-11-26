const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'BusinessLayer está funcionando' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});