const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// التأكد من وجود مجلد رفع الصور
const uploadDir = path.join(__dirname, '../../frontend/uploads/blogs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 تم إنشاء مجلد رفع الصور:', uploadDir);
}

// إعداد multer لرفع الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'blog-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('الرجاء اختيار صورة بصيغة jpg, jpeg, png, gif فقط'));
        }
    }
});

// ========== المسارات العامة (لا تحتاج مصادقة) ==========
router.get('/all', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// ========== المسارات المحمية (تحتاج مصادقة) ==========
router.post('/', authenticateToken, upload.single('image'), blogController.addBlog);
router.get('/', authenticateToken, blogController.getMyBlogs);
router.put('/:id', authenticateToken, upload.single('image'), blogController.updateBlog);
router.delete('/:id', authenticateToken, blogController.deleteBlog);

module.exports = router;