const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/auth');

// جميع مسارات المسؤول تحتاج مصادقة وتحقق من صلاحية المسؤول
router.use(authenticateToken);
router.use(adminController.checkAdmin);

// لوحة التحكم
router.get('/stats', adminController.getStats);

// إدارة الرسائل
router.get('/messages', adminController.getAllMessages);
router.put('/messages/:id', adminController.updateMessage);
router.delete('/messages/:id', adminController.deleteMessage);

// إدارة المستخدمين
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;