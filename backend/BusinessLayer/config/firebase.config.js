const admin = require('firebase-admin');
require('dotenv').config();

// Necesitarás descargar este archivo desde Firebase Console
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;