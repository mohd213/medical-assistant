const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.post('/forgot-password', forgotPasswordController.forgotPassword);
router.get('/verify-token/:token', forgotPasswordController.verifyToken);
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;