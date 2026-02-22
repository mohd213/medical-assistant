const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-2026';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'الرجاء تسجيل الدخول أولاً'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'انتهت صلاحية الجلسة، الرجاء تسجيل الدخول مجدداً'
            });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;