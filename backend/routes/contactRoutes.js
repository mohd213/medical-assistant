import express from 'express';
import * as contactController from '../controllers/contactController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// ========== مسار عام (لا يحتاج مصادقة) ==========
router.post('/', contactController.sendMessage);

// ========== مسارات محمية (تحتاج مصادقة) ==========
router.get('/my-messages', authenticateToken, contactController.getUserMessages);

// ========== مسارات المسؤول (سنستخدمها لاحقاً) ==========
// router.get('/all', authenticateToken, checkAdmin, contactController.getAllMessages);
// router.put('/:id', authenticateToken, checkAdmin, contactController.updateMessageStatus);

export default router;