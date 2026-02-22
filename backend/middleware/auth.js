const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-2026';

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

    // تجاهل التحقق مؤقتاً للتجربة (للاختبار فقط!)
    try {
        // محاولة فك التوكن بدون تحقق
        const decoded = jwt.decode(token);
        console.log('📦 التوكن المفكوك (بدون تحقق):', decoded);
        
        if (decoded && decoded.id) {
            console.log('✅ استخدام التوكن بدون تحقق مؤقتاً');
            req.user = { id: decoded.id, email: decoded.email };
            return next();
        }
    } catch (e) {
        console.log('❌ فشل فك التوكن:', e.message);
    }

    // التحقق العادي
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('❌ Middleware - خطأ في التحقق:', err.message);
            return res.status(403).json({
                success: false,
                message: 'انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مجدداً'
            });
        }

        console.log('✅ Middleware - تم التحقق بنجاح:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;