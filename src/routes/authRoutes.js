const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Rotas de Registro
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

module.exports = router;
