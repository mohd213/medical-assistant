const db = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// =============================================
// إعدادات البريد الإلكتروني (استخدم بريدك الحقيقي)
// =============================================
const transporter = nodemailer.createTransport({
    service: 'gmail', // أو 'hotmail', 'yahoo', إلخ
    auth: {
        user: 'your-email@gmail.com', // 🔴 استبدل ببريدك
        pass: 'your-app-password'     // 🔴 استبدل بكلمة مرور التطبيق
    }
});

// =============================================
// طلب إعادة تعيين كلمة المرور (إرسال رابط)
// =============================================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // التحقق من وجود البريد الإلكتروني
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'البريد الإلكتروني غير مسجل في النظام'
            });
        }

        // إنشاء رمز فريد
        const token = crypto.randomBytes(32).toString('hex');
        
        // تحديد وقت انتهاء الصلاحية (1 ساعة)
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        // حذف أي رموز سابقة لنفس البريد
        await db.query('DELETE FROM password_resets WHERE email = ?', [email]);

        // حفظ الرمز في قاعدة البيانات
        await db.query(
            'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
            [email, token, expiresAt]
        );

        // رابط إعادة التعيين
        const resetLink = `http://localhost:3000/html/reset-password.html?token=${token}`;

        // إعداد البريد الإلكتروني
        const mailOptions = {
            from: 'your-email@gmail.com', // 🔴 استبدل ببريدك
            to: email,
            subject: '🔐 إعادة تعيين كلمة المرور - المساعد الطبي',
            html: `
                <div style="font-family: 'Tajawal', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="http://localhost:3000/img/logo.png" alt="المساعد الطبي" style="width: 80px;">
                        <h2 style="color: #4260a0;">المساعد الطبي</h2>
                    </div>
                    
                    <h3 style="color: #2c3e50;">مرحباً بك 👋</h3>
                    
                    <p style="color: #34495e; line-height: 1.8; margin-bottom: 25px;">
                        لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في المساعد الطبي.
                        إذا كنت أنت من طلب ذلك، يمكنك النقر على الرابط أدناه لإنشاء كلمة مرور جديدة:
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetLink}" style="background: #4260a0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block;">
                            🔐 إعادة تعيين كلمة المرور
                        </a>
                    </div>
                    
                    <p style="color: #7f8c8d; font-size: 14px; margin-top: 25px;">
                        هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.
                    </p>
                    
                    <hr style="border: 1px solid #f0f0f0; margin: 25px 0;">
                    
                    <p style="color: #95a5a6; font-size: 12px; text-align: center;">
                        © 2026 المساعد الطبي - جميع الحقوق محفوظة
                    </p>
                </div>
            `
        };

        // إرسال البريد الإلكتروني
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
        });

    } catch (error) {
        console.error('❌ خطأ في طلب إعادة تعيين كلمة المرور:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// التحقق من صحة الرمز
// =============================================
const verifyToken = async (req, res) => {
    try {
        const { token } = req.params;

        const [resets] = await db.query(
            'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
            [token]
        );

        if (resets.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'الرابط غير صالح أو منتهي الصلاحية'
            });
        }

        res.json({
            success: true,
            message: 'الرابط صالح',
            email: resets[0].email
        });

    } catch (error) {
        console.error('❌ خطأ في التحقق من الرمز:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// إعادة تعيين كلمة المرور
// =============================================
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // التحقق من الرمز
        const [resets] = await db.query(
            'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
            [token]
        );

        if (resets.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'الرابط غير صالح أو منتهي الصلاحية'
            });
        }

        const { email } = resets[0];

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // تحديث كلمة المرور
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        // حذف جميع رموز إعادة التعيين لهذا البريد
        await db.query('DELETE FROM password_resets WHERE email = ?', [email]);

        res.json({
            success: true,
            message: 'تم إعادة تعيين كلمة المرور بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في إعادة تعيين كلمة المرور:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

module.exports = {
    forgotPassword,
    verifyToken,
    resetPassword
};