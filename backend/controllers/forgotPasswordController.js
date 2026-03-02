import db from '../config/database.js';
import bcrypt from 'bcrypt';

// =============================================
// طلب إعادة تعيين كلمة المرور
// =============================================
export const forgotPassword = async (req, res) => {
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

        // رابط إعادة التعيين (يحمل البريد في الرابط)
        const resetLink = `http://localhost:3000/html/login/reset-password.html?email=${encodeURIComponent(email)}`;

        res.json({
            success: true,
            message: '✅ تم إنشاء رابط إعادة التعيين',
            resetLink: resetLink
        });

    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
};

// =============================================
// إعادة تعيين كلمة المرور
// =============================================
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // التحقق من وجود البريد
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'البريد الإلكتروني غير موجود'
            });
        }

        // تشفير كلمة المرور الجديدة
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // تحديث كلمة المرور
        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        res.json({
            success: true,
            message: '✅ تم تغيير كلمة المرور بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
};