import db from '../config/database.js';

// =============================================
// إضافة حالة متابعة جديدة
// =============================================
export const addCase = async (req, res) => {
    try {
        const { patient_name, age, gender, disease, medicine, surgery, healing_rate, notes } = req.body;
        const userId = req.user.id; // من التوكن

        const [result] = await db.query(
            `INSERT INTO follow_up_cases 
            (user_id, patient_name, age, gender, disease, medicine, surgery, healing_rate, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, patient_name, age, gender, disease, medicine, surgery, healing_rate, notes]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة الحالة بنجاح',
            caseId: result.insertId
        });

    } catch (error) {
        console.error('❌ خطأ في إضافة الحالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع حالات المستخدم
// =============================================
export const getCases = async (req, res) => {
    try {
        const userId = req.user.id;

        const [cases] = await db.query(
            `SELECT * FROM follow_up_cases 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
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
// جلب حالة محددة
// =============================================
export const getCaseById = async (req, res) => {
    try {
        const caseId = req.params.id;
        const userId = req.user.id;

        const [cases] = await db.query(
            `SELECT * FROM follow_up_cases 
             WHERE id = ? AND user_id = ?`,
            [caseId, userId]
        );

        if (cases.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'الحالة غير موجودة'
            });
        }

        res.json({
            success: true,
            case: cases[0]
        });

    } catch (error) {
        console.error('❌ خطأ في جلب الحالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث حالة
// =============================================
export const updateCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        const userId = req.user.id;
        const { patient_name, age, gender, disease, medicine, surgery, healing_rate, notes } = req.body;

        const [result] = await db.query(
            `UPDATE follow_up_cases 
             SET patient_name = ?, age = ?, gender = ?, disease = ?, 
                 medicine = ?, surgery = ?, healing_rate = ?, notes = ?
             WHERE id = ? AND user_id = ?`,
            [patient_name, age, gender, disease, medicine, surgery, healing_rate, notes, caseId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'الحالة غير موجودة أو لا تملك صلاحية التعديل'
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث الحالة بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث الحالة:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف حالة
// =============================================
export const deleteCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        const userId = req.user.id;

        const [result] = await db.query(
            'DELETE FROM follow_up_cases WHERE id = ? AND user_id = ?',
            [caseId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'الحالة غير موجودة أو لا تملك صلاحية الحذف'
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