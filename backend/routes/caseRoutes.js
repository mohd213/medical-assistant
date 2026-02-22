const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const authenticateToken = require('../middleware/auth');

// جميع المسارات محمية (تحتاج مصادقة)
router.post('/', authenticateToken, caseController.addCase);
router.get('/', authenticateToken, caseController.getCases);
router.get('/:id', authenticateToken, caseController.getCaseById);
router.put('/:id', authenticateToken, caseController.updateCase);
router.delete('/:id', authenticateToken, caseController.deleteCase);

module.exports = router;