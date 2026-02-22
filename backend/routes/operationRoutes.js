const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');
const authenticateToken = require('../middleware/auth');

// جميع المسارات محمية (تحتاج مصادقة)
router.post('/', authenticateToken, operationController.addOperation);
router.get('/', authenticateToken, operationController.getOperations);
router.get('/:id', authenticateToken, operationController.getOperationById);
router.put('/:id', authenticateToken, operationController.updateOperation);
router.delete('/:id', authenticateToken, operationController.deleteOperation);

module.exports = router;