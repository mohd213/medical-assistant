const db = require('../config/database');

// =============================================
// التحقق من أن المستخدم مسؤول
// =============================================
const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [users] = await db.query(
            'SELECT role FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0 || users[0].role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'غير مصرح بالوصول. أنت لست مسؤولاً'
            });
        }

        next();
    } catch (error) {
        console.error('❌ خطأ في التحقق من الصلاحيات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم'
        });
    }
};

// =============================================
// جلب إحصائيات الموقع
// =============================================
const getStats = async (req, res) => {
    try {
        // عدد المستخدمين
        const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
        
        // عدد المدونات
        const [blogsCount] = await db.query('SELECT COUNT(*) as count FROM blogs');
        
        // عدد حالات المتابعة
        const [casesCount] = await db.query('SELECT COUNT(*) as count FROM follow_up_cases');
        
        // عدد العمليات
        const [operationsCount] = await db.query('SELECT COUNT(*) as count FROM operations');
        
        // عدد رسائل الدعم
        const [messagesCount] = await db.query('SELECT COUNT(*) as count FROM contact_messages');
        
        // عدد الرسائل الجديدة
        const [newMessagesCount] = await db.query('SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"');

        res.json({
            success: true,
            stats: {
                users: usersCount[0].count,
                blogs: blogsCount[0].count,
                cases: casesCount[0].count,
                operations: operationsCount[0].count,
                messages: messagesCount[0].count,
                newMessages: newMessagesCount[0].count
            }
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع رسائل الدعم
// =============================================
const getAllMessages = async (req, res) => {
    try {
        const [messages] = await db.query(
            `SELECT cm.*, u.firstname, u.lastname 
             FROM contact_messages cm
             LEFT JOIN users u ON cm.user_id = u.id
             ORDER BY cm.created_at DESC`
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
// تحديث حالة الرسالة والرد عليها
// =============================================
const updateMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        const { status, admin_reply } = req.body;

        await db.query(
            'UPDATE contact_messages SET status = ?, admin_reply = ? WHERE id = ?',
            [status, admin_reply, messageId]
        );

        res.json({
            success: true,
            message: 'تم تحديث الرسالة بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث الرسالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف رسالة
// =============================================
const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;

        await db.query('DELETE FROM contact_messages WHERE id = ?', [messageId]);

        res.json({
            success: true,
            message: 'تم حذف الرسالة بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في حذف الرسالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع المستخدمين
// =============================================
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, firstname, lastname, email, phone, specialization, role, 
             DATE_FORMAT(created_at, '%Y-%m-%d') as created_at 
             FROM users ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error('❌ خطأ في جلب المستخدمين:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تغيير صلاحية المستخدم
// =============================================
const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

        res.json({
            success: true,
            message: 'تم تحديث صلاحية المستخدم بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث صلاحية المستخدم:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف مستخدم
// =============================================
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            message: 'تم حذف المستخدم بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في حذف المستخدم:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

module.exports = {
    checkAdmin,
    getStats,
    getAllMessages,
    updateMessage,
    deleteMessage,
    getAllUsers,
    changeUserRole,
    deleteUser
};