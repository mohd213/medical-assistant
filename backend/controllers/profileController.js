import db from '../config/database.js';

// =============================================
// جلب المؤهلات العلمية للمستخدم
// =============================================
export const getQualifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [qualifications] = await db.query(
            'SELECT * FROM qualifications WHERE user_id = ? ORDER BY end_year DESC, start_year DESC',
            [userId]
        );
        
        res.json({
            success: true,
            qualifications: qualifications
        });
        
    } catch (error) {
        console.error('❌ خطأ في جلب المؤهلات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// إضافة مؤهل علمي
// =============================================
export const addQualification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { university, degree, field, start_year, end_year } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO qualifications (user_id, university, degree, field, start_year, end_year) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, university, degree, field, start_year, end_year]
        );
        
        res.status(201).json({
            success: true,
            message: 'تم إضافة المؤهل العلمي بنجاح',
            id: result.insertId
        });
        
    } catch (error) {
        console.error('❌ خطأ في إضافة المؤهل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث مؤهل علمي
// =============================================
export const updateQualification = async (req, res) => {
    try {
        const userId = req.user.id;
        const qualId = req.params.id;
        const { university, degree, field, start_year, end_year } = req.body;
        
        const [result] = await db.query(
            'UPDATE qualifications SET university = ?, degree = ?, field = ?, start_year = ?, end_year = ? WHERE id = ? AND user_id = ?',
            [university, degree, field, start_year, end_year, qualId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'المؤهل غير موجود أو لا تملك صلاحية التعديل'
            });
        }
        
        res.json({
            success: true,
            message: 'تم تحديث المؤهل العلمي بنجاح'
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحديث المؤهل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف مؤهل علمي
// =============================================
export const deleteQualification = async (req, res) => {
    try {
        const userId = req.user.id;
        const qualId = req.params.id;
        
        const [result] = await db.query(
            'DELETE FROM qualifications WHERE id = ? AND user_id = ?',
            [qualId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'المؤهل غير موجود أو لا تملك صلاحية الحذف'
            });
        }
        
        res.json({
            success: true,
            message: 'تم حذف المؤهل العلمي بنجاح'
        });
        
    } catch (error) {
        console.error('❌ خطأ في حذف المؤهل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب الخبرات العملية للمستخدم
// =============================================
export const getExperiences = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [experiences] = await db.query(
            'SELECT * FROM experiences WHERE user_id = ? ORDER BY end_year DESC, start_year DESC',
            [userId]
        );
        
        res.json({
            success: true,
            experiences: experiences
        });
        
    } catch (error) {
        console.error('❌ خطأ في جلب الخبرات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// إضافة خبرة عملية
// =============================================
export const addExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const { place, position, department, start_year, end_year, current } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO experiences (user_id, place, position, department, start_year, end_year, current) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, place, position, department, start_year, end_year, current || false]
        );
        
        res.status(201).json({
            success: true,
            message: 'تم إضافة الخبرة العملية بنجاح',
            id: result.insertId
        });
        
    } catch (error) {
        console.error('❌ خطأ في إضافة الخبرة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث خبرة عملية
// =============================================
export const updateExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const expId = req.params.id;
        const { place, position, department, start_year, end_year, current } = req.body;
        
        const [result] = await db.query(
            'UPDATE experiences SET place = ?, position = ?, department = ?, start_year = ?, end_year = ?, current = ? WHERE id = ? AND user_id = ?',
            [place, position, department, start_year, end_year, current || false, expId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'الخبرة غير موجودة أو لا تملك صلاحية التعديل'
            });
        }
        
        res.json({
            success: true,
            message: 'تم تحديث الخبرة العملية بنجاح'
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحديث الخبرة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف خبرة عملية
// =============================================
export const deleteExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const expId = req.params.id;
        
        const [result] = await db.query(
            'DELETE FROM experiences WHERE id = ? AND user_id = ?',
            [expId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'الخبرة غير موجودة أو لا تملك صلاحية الحذف'
            });
        }
        
        res.json({
            success: true,
            message: 'تم حذف الخبرة العملية بنجاح'
        });
        
    } catch (error) {
        console.error('❌ خطأ في حذف الخبرة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب كل شيء (لصفحة الملف الشخصي)
// =============================================
export const getFullProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [qualifications] = await db.query(
            'SELECT * FROM qualifications WHERE user_id = ? ORDER BY end_year DESC, start_year DESC',
            [userId]
        );
        
        const [experiences] = await db.query(
            'SELECT * FROM experiences WHERE user_id = ? ORDER BY end_year DESC, start_year DESC',
            [userId]
        );
        
        res.json({
            success: true,
            qualifications: qualifications,
            experiences: experiences
        });
        
    } catch (error) {
        console.error('❌ خطأ في جلب الملف الشخصي:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};