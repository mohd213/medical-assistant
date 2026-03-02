import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// =============================================
// استخدام المتغيرات من ملف .env
// =============================================
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'; // 30d من ملف .env

// =============================================
// تسجيل مستخدم جديد
// =============================================
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, specialization } = req.body;

        console.log('📝 محاولة تسجيل مستخدم جديد:', { email, firstname, lastname });

        // التحقق من وجود البريد الإلكتروني
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            console.log('❌ البريد الإلكتروني مستخدم بالفعل:', email);
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مستخدم بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔐 تم تشفير كلمة المرور');

        // إدخال المستخدم الجديد
        const [result] = await db.query(
            'INSERT INTO users (firstname, lastname, email, password, phone, specialization) VALUES (?, ?, ?, ?, ?, ?)',
            [firstname, lastname, email, hashedPassword, phone, specialization]
        );

        console.log('✅ تم إدخال المستخدم في قاعدة البيانات، ID:', result.insertId);

        // إنشاء JWT token - استخدام المتغيرات من .env
        const token = jwt.sign(
            { id: result.insertId, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        console.log('🔑 تم إنشاء التوكن بنجاح');

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
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔍 محاولة تسجيل دخول:', { email });

        // البحث عن المستخدم
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.log('❌ البريد غير موجود:', email);
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        const user = users[0];
        console.log('✅ المستخدم موجود:', user.email);
        console.log('👤 دور المستخدم:', user.role);

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('🔐 التحقق من كلمة المرور:', validPassword ? 'صحيحة' : 'خاطئة');

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        // إنشاء JWT token - استخدام المتغيرات من .env
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        console.log('🔑 تم إنشاء التوكن بنجاح');
        console.log('📦 التوكن:', token.substring(0, 20) + '...');

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                specialization: user.specialization,
                role: user.role
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
export const getProfile = async (req, res) => {
    try {
        console.log('🔍 محاولة جلب البروفايل...');
        console.log('👤 المستخدم من التوكن:', req.user);
        
        const userId = req.user.id;
        console.log('🆔 معرف المستخدم:', userId);

        const [users] = await db.query(
            'SELECT id, firstname, lastname, email, phone, specialization, role, profile_img FROM users WHERE id = ?',
            [userId]
        );

        console.log('📊 نتيجة البحث:', users);

        if (users.length === 0) {
            console.log('❌ المستخدم غير موجود');
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        console.log('✅ تم جلب البيانات بنجاح:', users[0]);
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

// =============================================
// تحديث الملف الشخصي
// =============================================
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, phone, specialization, password } = req.body;
        let profile_img = null;

        console.log('📝 محاولة تحديث الملف الشخصي للمستخدم:', userId);

        // إذا تم رفع صورة جديدة
        if (req.file) {
            profile_img = `/uploads/profiles/${req.file.filename}`;
            console.log('🖼️ تم رفع صورة جديدة:', profile_img);
        }

        // بناء جملة التحديث
        let updateQuery = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ?, specialization = ?';
        let queryParams = [firstname, lastname, email, phone, specialization];

        // إذا كان هناك كلمة مرور جديدة
        if (password) {
            console.log('🔐 جاري تغيير كلمة المرور');
            const hashedPassword = await bcrypt.hash(password, 10);
            updateQuery += ', password = ?';
            queryParams.push(hashedPassword);
        }

        // إذا كان هناك صورة جديدة
        if (profile_img) {
            updateQuery += ', profile_img = ?';
            queryParams.push(profile_img);
        }

        updateQuery += ' WHERE id = ?';
        queryParams.push(userId);

        // تنفيذ التحديث
        await db.query(updateQuery, queryParams);
        console.log('✅ تم تحديث البيانات في قاعدة البيانات');

        // جلب البيانات المحدثة
        const [users] = await db.query(
            'SELECT id, firstname, lastname, email, phone, specialization, profile_img FROM users WHERE id = ?',
            [userId]
        );

        console.log('📊 البيانات بعد التحديث:', users[0]);

        res.json({
            success: true,
            message: 'تم تحديث الملف الشخصي بنجاح',
            user: users[0]
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث الملف الشخصي:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// التحقق من وجود أدمن
// =============================================
export const checkAdminExists = async (req, res) => {
    try {
        const [admins] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
        );

        res.json({
            success: true,
            hasAdmin: admins[0].count > 0
        });

    } catch (error) {
        console.error('❌ خطأ في التحقق من وجود أدمن:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
};

// =============================================
// إعداد أول أدمن
// =============================================
export const setupFirstAdmin = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, specialization } = req.body;

        // التحقق من عدم وجود أدمن مسبقاً
        const [existingAdmins] = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
        );

        if (existingAdmins[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'يوجد مسؤول بالفعل. لا يمكن إنشاء مسؤول جديد بهذه الطريقة.'
            });
        }

        // التحقق من عدم استخدام البريد الإلكتروني
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مستخدم بالفعل'
            });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إدخال المستخدم كأدمن
        const [result] = await db.query(
            `INSERT INTO users 
            (firstname, lastname, email, password, phone, specialization, role) 
            VALUES (?, ?, ?, ?, ?, ?, 'admin')`,
            [firstname, lastname, email, hashedPassword, phone, specialization]
        );

        // إنشاء JWT token - استخدام المتغيرات من .env
        const token = jwt.sign(
            { id: result.insertId, email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المسؤول الأول بنجاح',
            user: {
                id: result.insertId,
                firstname,
                lastname,
                email,
                phone,
                specialization,
                role: 'admin'
            },
            token
        });

    } catch (error) {
        console.error('❌ خطأ في إعداد أول أدمن:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};