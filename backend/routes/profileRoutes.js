import express from 'express';
import * as profileController from '../controllers/profileController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// جميع المسارات محمية (تحتاج مصادقة)
router.use(authenticateToken);

// ===== المؤهلات العلمية =====
router.get('/qualifications', profileController.getQualifications);
router.post('/qualifications', profileController.addQualification);
router.put('/qualifications/:id', profileController.updateQualification);
router.delete('/qualifications/:id', profileController.deleteQualification);

// ===== الخبرات العملية =====
router.get('/experiences', profileController.getExperiences);
router.post('/experiences', profileController.addExperience);
router.put('/experiences/:id', profileController.updateExperience);
router.delete('/experiences/:id', profileController.deleteExperience);

// ===== الملف الشخصي الكامل =====
router.get('/full', profileController.getFullProfile);

export default router;