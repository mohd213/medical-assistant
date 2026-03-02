import db from '../config/database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================
// التحقق من أن المستخدم مسؤول
// =============================================
export const checkAdmin = async (req, res, next) => {
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
export const getStats = async (req, res) => {
    try {
        const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [blogsCount] = await db.query('SELECT COUNT(*) as count FROM blogs');
        const [casesCount] = await db.query('SELECT COUNT(*) as count FROM follow_up_cases');
        const [operationsCount] = await db.query('SELECT COUNT(*) as count FROM operations');
        const [messagesCount] = await db.query('SELECT COUNT(*) as count FROM contact_messages');
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
export const getAllMessages = async (req, res) => {
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
export const updateMessage = async (req, res) => {
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
export const deleteMessage = async (req, res) => {
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
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, firstname, lastname, email, phone, specialization, role, 
             DATE_FORMAT(created_at, '%Y-%m-%d') as created_at,
             profile_img
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
export const changeUserRole = async (req, res) => {
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
export const deleteUser = async (req, res) => {
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

// ================== صلاحيات جديدة للأدمن ==================

// =============================================
// 1. جلب جميع المدونات
// =============================================
export const getAllBlogs = async (req, res) => {
    try {
        const { user_id, search } = req.query;
        
        let query = `
            SELECT blogs.*, users.firstname, users.lastname, users.email 
            FROM blogs 
            JOIN users ON blogs.user_id = users.id 
            WHERE 1=1
        `;
        let params = [];

        if (user_id) {
            query += ' AND blogs.user_id = ?';
            params.push(user_id);
        }

        if (search) {
            query += ' AND (blogs.title LIKE ? OR blogs.content LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY blogs.created_at DESC';

        const [blogs] = await db.query(query, params);

        res.json({
            success: true,
            blogs: blogs
        });

    } catch (error) {
        console.error('❌ خطأ في جلب المدونات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 2. حذف أي مدونة (مع الصورة)
// =============================================
export const deleteAnyBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        const [blog] = await db.query(
            'SELECT image FROM blogs WHERE id = ?',
            [blogId]
        );

        if (blog.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المدونة غير موجودة'
            });
        }

        if (blog[0].image) {
            const imagePath = path.join(__dirname, '../../frontend', blog[0].image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('🗑️ تم حذف الصورة:', imagePath);
            }
        }

        await db.query('DELETE FROM blogs WHERE id = ?', [blogId]);

        res.json({
            success: true,
            message: 'تم حذف المدونة بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في حذف المدونة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 3. جلب جميع العمليات
// =============================================
export const getAllOperations = async (req, res) => {
    try {
        const [operations] = await db.query(
            `SELECT operations.*, users.firstname, users.lastname 
             FROM operations 
             JOIN users ON operations.user_id = users.id 
             ORDER BY operations.operation_date DESC`
        );

        res.json({
            success: true,
            operations: operations
        });

    } catch (error) {
        console.error('❌ خطأ في جلب العمليات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 4. حذف أي عملية
// =============================================
export const deleteAnyOperation = async (req, res) => {
    try {
        const operationId = req.params.id;

        const [result] = await db.query(
            'DELETE FROM operations WHERE id = ?',
            [operationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'العملية غير موجودة'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف العملية بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في حذف العملية:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 5. جلب جميع حالات المتابعة
// =============================================
export const getAllFollowUpCases = async (req, res) => {
    try {
        const [cases] = await db.query(
            `SELECT follow_up_cases.*, users.firstname, users.lastname 
             FROM follow_up_cases 
             JOIN users ON follow_up_cases.user_id = users.id 
             ORDER BY follow_up_cases.created_at DESC`
        );

        res.json({
            success: true,
            cases: cases
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الحالات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 6. حذف أي حالة متابعة
// =============================================
export const deleteAnyFollowUpCase = async (req, res) => {
    try {
        const caseId = req.params.id;

        const [result] = await db.query(
            'DELETE FROM follow_up_cases WHERE id = ?',
            [caseId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'الحالة غير موجودة'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف الحالة بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في حذف الحالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 7. نظرة عامة على نشاط المستخدم
// =============================================
export const getUserActivity = async (req, res) => {
    try {
        const userId = req.params.id;

        const [blogsCount] = await db.query(
            'SELECT COUNT(*) as count FROM blogs WHERE user_id = ?',
            [userId]
        );

        const [operationsCount] = await db.query(
            'SELECT COUNT(*) as count FROM operations WHERE user_id = ?',
            [userId]
        );

        const [casesCount] = await db.query(
            'SELECT COUNT(*) as count FROM follow_up_cases WHERE user_id = ?',
            [userId]
        );

        const [lastActivity] = await db.query(
            `SELECT 'blog' as type, created_at FROM blogs WHERE user_id = ?
             UNION ALL
             SELECT 'operation' as type, created_at FROM operations WHERE user_id = ?
             UNION ALL
             SELECT 'case' as type, created_at FROM follow_up_cases WHERE user_id = ?
             ORDER BY created_at DESC LIMIT 1`,
            [userId, userId, userId]
        );

        res.json({
            success: true,
            activity: {
                blogs: blogsCount[0].count,
                operations: operationsCount[0].count,
                cases: casesCount[0].count,
                lastActive: lastActivity[0]?.created_at || null
            }
        });

    } catch (error) {
        console.error('❌ خطأ في جلب نشاط المستخدم:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// 8. مسح بيانات مستخدم بالكامل
// =============================================
export const wipeUserData = async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        const userId = req.params.id;
        
        await connection.beginTransaction();

        const [blogs] = await connection.query(
            'SELECT image FROM blogs WHERE user_id = ?',
            [userId]
        );

        for (const blog of blogs) {
            if (blog.image) {
                const imagePath = path.join(__dirname, '../../frontend', blog.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        await connection.query('DELETE FROM blogs WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM operations WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM follow_up_cases WHERE user_id = ?', [userId]);
        await connection.query('DELETE FROM contact_messages WHERE user_id = ?', [userId]);

        await connection.commit();

        res.json({
            success: true,
            message: 'تم مسح جميع بيانات المستخدم بنجاح'
        });

    } catch (error) {
        await connection.rollback();
        console.error('❌ خطأ في مسح بيانات المستخدم:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    } finally {
        connection.release();
    }
};