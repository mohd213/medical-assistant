const jwt = require('jsonwebtoken');
require('dotenv').config(); // <-- أضف هذا السطر

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-2026';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Middleware - التحقق من التوكن:', token ? 'موجود' : 'غير موجود');

    if (!token) {
        console.log('❌ Middleware - لا يوجد توكن');
        return res.status(401).json({
            success: false,
            message: 'الرجاء تسجيل الدخول أولاً'
        });
    }

    // ✅ التحقق الصحيح من التوكن
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('❌ Middleware - خطأ في التحقق:', err.message);
            
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({
                    success: false,
                    message: 'انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مجدداً'
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({
                    success: false,
                    message: 'توكن غير صالح، الرجاء تسجيل الدخول مجدداً'
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'خطأ في المصادقة، الرجاء تسجيل الدخول مجدداً'
                });
            }
        }

        console.log('✅ Middleware - تم التحقق بنجاح:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;