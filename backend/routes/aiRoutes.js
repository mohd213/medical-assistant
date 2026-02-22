const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// مسار تحليل الأعراض (يمكن استخدامه بدون مصادقة)
router.post('/analyze', aiController.analyzeSymptoms);

module.exports = router;