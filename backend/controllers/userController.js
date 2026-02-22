const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-2026';

// =============================================
// تسجيل مستخدم جديد
// =============================================
const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, specialization } = req.body;

        // التحقق من وجود البريد الإلكتروني
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مستخدم بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إدخال المستخدم الجديد
        const [result] = await db.query(
            'INSERT INTO users (firstname, lastname, email, password, phone, specialization) VALUES (?, ?, ?, ?, ?, ?)',
            [firstname, lastname, email, hashedPassword, phone, specialization]
        );

        // إنشاء JWT token
        const token = jwt.sign(
            { id: result.insertId, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح',
            user: {
                id: result.insertId,
                firstname,
                lastname,
                email,
                phone,
                specialization
            },
            token
        });

    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تسجيل الدخول
// =============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // البحث عن المستخدم
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        const user = users[0];

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        // إنشاء JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                specialization: user.specialization
            },
            token
        });

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// الحصول على بيانات المستخدم الحالي
// =============================================
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            'SELECT id, firstname, lastname, email, phone, specialization FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الملف الشخصي:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};