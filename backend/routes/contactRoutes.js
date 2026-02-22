const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authenticateToken = require('../middleware/auth');

// ========== مسار عام (لا يحتاج مصادقة) ==========
router.post('/', contactController.sendMessage);

// ========== مسارات محمية (تحتاج مصادقة) ==========
router.get('/my-messages', authenticateToken, contactController.getUserMessages);

// ========== مسارات المسؤول (سنستخدمها لاحقاً) ==========
// router.get('/all', authenticateToken, checkAdmin, contactController.getAllMessages);
// router.put('/:id', authenticateToken, checkAdmin, contactController.updateMessageStatus);

module.exports = router;