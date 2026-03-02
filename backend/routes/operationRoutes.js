import express from 'express';
import * as operationController from '../controllers/operationController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// جميع المسارات محمية (تحتاج مصادقة)
router.post('/', authenticateToken, operationController.addOperation);
router.get('/', authenticateToken, operationController.getOperations);
router.get('/:id', authenticateToken, operationController.getOperationById);
router.put('/:id', authenticateToken, operationController.updateOperation);
router.delete('/:id', authenticateToken, operationController.deleteOperation);

export default router;