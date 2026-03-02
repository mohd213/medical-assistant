import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// جميع مسارات المسؤول تحتاج مصادقة وتحقق من صلاحية المسؤول
router.use(authenticateToken);
router.use(adminController.checkAdmin);

// ================== لوحة التحكم الأساسية ==================
router.get('/stats', adminController.getStats);

// ================== إدارة الرسائل ==================
router.get('/messages', adminController.getAllMessages);
router.put('/messages/:id', adminController.updateMessage);
router.delete('/messages/:id', adminController.deleteMessage);

// ================== إدارة المستخدمين ==================
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

// ================== صلاحيات إضافية للأدمن ==================

// إدارة المدونات
router.get('/blogs', adminController.getAllBlogs);
router.delete('/blogs/:id', adminController.deleteAnyBlog);

// إدارة العمليات
router.get('/operations', adminController.getAllOperations);
router.delete('/operations/:id', adminController.deleteAnyOperation);

// إدارة حالات المتابعة
router.get('/follow-up-cases', adminController.getAllFollowUpCases);
router.delete('/follow-up-cases/:id', adminController.deleteAnyFollowUpCase);

// تحليلات ونشاط المستخدمين
router.get('/users/:id/activity', adminController.getUserActivity);
router.delete('/users/:id/wipe-data', adminController.wipeUserData);

export default router;