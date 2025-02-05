// app.js
const express = require('express');
const dotenv = require('dotenv');
const gamesRoutes = require('./routes/gamesRoutes');
const cors = require('cors');


dotenv.config();

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', // Permite solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
  }));


app.use(express.json());

app.use('/api/games', gamesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});