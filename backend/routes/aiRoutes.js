import express from 'express';
import { analyzeSymptoms } from '../controllers/aiController.js';

const router = express.Router();

// مسار تحليل الأعراض (يمكن استخدامه بدون مصادقة)
router.post('/analyze', analyzeSymptoms);

export default router;