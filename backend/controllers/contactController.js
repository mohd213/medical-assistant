const db = require('../config/database');

// =============================================
// إرسال رسالة دعم فني
// =============================================
const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        let userId = null;
        
        // إذا كان المستخدم مسجل الدخول، نأخذ معرفه
        if (req.user) {
            userId = req.user.id;
        }

        // التحقق من الحقول المطلوبة
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء ملء جميع الحقول'
            });
        }

        // حفظ الرسالة في قاعدة البيانات
        const [result] = await db.query(
            'INSERT INTO contact_messages (user_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
            [userId, name, email, subject, message]
        );

        // هنا يمكن إضافة كود لإرسال إشعار عبر البريد الإلكتروني (اختياري)

        res.status(201).json({
            success: true,
            message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
            messageId: result.insertId
        });

    } catch (error) {
        console.error('❌ خطأ في إرسال الرسالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب رسائل المستخدم الحالي (للمستخدم)
// =============================================
const getUserMessages = async (req, res) => {
    try {
        const userId = req.user.id;

        const [messages] = await db.query(
            `SELECT * FROM contact_messages 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            messages: messages
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الرسائل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع الرسائل (للمسؤول - سنستخدمها لاحقاً)
// =============================================
const getAllMessages = async (req, res) => {
    try {
        const [messages] = await db.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            messages: messages
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الرسائل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث حالة الرسالة (للمسؤول)
// =============================================
const updateMessageStatus = async (req, res) => {
    try {
        const messageId = req.params.id;
        const { status, admin_reply } = req.body;

        await db.query(
            'UPDATE contact_messages SET status = ?, admin_reply = ? WHERE id = ?',
            [status, admin_reply, messageId]
        );

        res.json({
            success: true,
            message: 'تم تحديث حالة الرسالة'
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث الرسالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

module.exports = {
    sendMessage,
    getUserMessages,
    getAllMessages,
    updateMessageStatus
};