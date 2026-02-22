const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// ========== المسارات العامة (لا تحتاج مصادقة) ==========
router.post('/register', userController.register);
router.post('/login', userController.login);

// ========== المسارات المحمية (تحتاج مصادقة) ==========
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;