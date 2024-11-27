const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const passwordRecoveryController = require('../controllers/passwordRecoveryController');

router.post('/login', loginController.login);
router.post('/register', registerController.register);
router.post('/verify-email', passwordRecoveryController.verifyEmail);        // Cambio aquí
router.post('/update-password', passwordRecoveryController.updatePassword);

module.exports = router;