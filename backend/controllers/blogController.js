const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// =============================================
// إضافة مدونة جديدة مع صورة
// =============================================
const addBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;
        let imagePath = null;

        console.log('📝 إضافة مدونة جديدة:', { title, userId });

        // إذا تم رفع صورة
        if (req.file) {
            imagePath = `/uploads/blogs/${req.file.filename}`;
            console.log('🖼️ تم رفع صورة:', imagePath);
        }

        const [result] = await db.query(
            'INSERT INTO blogs (user_id, title, content, image) VALUES (?, ?, ?, ?)',
            [userId, title, content, imagePath]
        );

        console.log('✅ تم إضافة المدونة بنجاح، ID:', result.insertId);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المدونة بنجاح',
            blogId: result.insertId,
            image: imagePath
        });

    } catch (error) {
        console.error('❌ خطأ في إضافة المدونة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع مدونات المستخدم
// =============================================
const getMyBlogs = async (req, res) => {
    try {
        const userId = req.user.id;

        const [blogs] = await db.query(
            `SELECT * FROM blogs 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );

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
// جلب جميع المدونات (للصفحة الرئيسية)
// =============================================
const getAllBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(
            `SELECT blogs.*, users.firstname, users.lastname 
             FROM blogs 
             JOIN users ON blogs.user_id = users.id 
             ORDER BY blogs.created_at DESC`
        );

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
// جلب مدونة محددة
// =============================================
const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;

        const [blogs] = await db.query(
            `SELECT blogs.*, users.firstname, users.lastname 
             FROM blogs 
             JOIN users ON blogs.user_id = users.id 
             WHERE blogs.id = ?`,
            [blogId]
        );

        if (blogs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المدونة غير موجودة'
            });
        }

        res.json({
            success: true,
            blog: blogs[0]
        });

    } catch (error) {
        console.error('❌ خطأ في جلب المدونة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث مدونة مع صورة
// =============================================
const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const { title, content } = req.body;
        let imagePath = null;

        // جلب المدونة القديمة
        const [oldBlog] = await db.query(
            'SELECT image FROM blogs WHERE id = ? AND user_id = ?',
            [blogId, userId]
        );

        if (oldBlog.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المدونة غير موجودة أو لا تملك صلاحية التعديل'
            });
        }

        // إذا تم رفع صورة جديدة
        if (req.file) {
            imagePath = `/uploads/blogs/${req.file.filename}`;
            
            // حذف الصورة القديمة إذا وجدت
            if (oldBlog[0].image) {
                const oldImagePath = path.join(__dirname, '../../frontend', oldBlog[0].image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('🗑️ تم حذف الصورة القديمة:', oldImagePath);
                }
            }
        }

        // بناء query التحديث
        let query = 'UPDATE blogs SET title = ?, content = ?';
        let params = [title, content];

        if (imagePath) {
            query += ', image = ?';
            params.push(imagePath);
        }

        query += ' WHERE id = ? AND user_id = ?';
        params.push(blogId, userId);

        const [result] = await db.query(query, params);

        res.json({
            success: true,
            message: 'تم تحديث المدونة بنجاح',
            image: imagePath
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث المدونة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف مدونة مع صورتها
// =============================================
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;

        // جلب المدونة للحصول على الصورة
        const [blog] = await db.query(
            'SELECT image FROM blogs WHERE id = ? AND user_id = ?',
            [blogId, userId]
        );

        if (blog.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'المدونة غير موجودة أو لا تملك صلاحية الحذف'
            });
        }

        // حذف الصورة إذا وجدت
        if (blog[0].image) {
            const imagePath = path.join(__dirname, '../../frontend', blog[0].image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log('🗑️ تم حذف الصورة:', imagePath);
            }
        }

        // حذف المدونة
        const [result] = await db.query(
            'DELETE FROM blogs WHERE id = ? AND user_id = ?',
            [blogId, userId]
        );

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

module.exports = {
    addBlog,
    getMyBlogs,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};