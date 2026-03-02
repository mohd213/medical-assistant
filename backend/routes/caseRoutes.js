import express from 'express';
import * as caseController from '../controllers/caseController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// جميع المسارات محمية (تحتاج مصادقة)
router.post('/', authenticateToken, caseController.addCase);
router.get('/', authenticateToken, caseController.getCases);
router.get('/:id', authenticateToken, caseController.getCaseById);
router.put('/:id', authenticateToken, caseController.updateCase);
router.delete('/:id', authenticateToken, caseController.deleteCase);

export default router;