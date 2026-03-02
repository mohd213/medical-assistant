import db from '../config/database.js';

// =============================================
// إضافة عملية جديدة
// =============================================
export const addOperation = async (req, res) => {
    try {
        const { patient_name, operation_type, hospital, department, operation_date, operation_time, notes } = req.body;
        const userId = req.user.id;

        console.log('📝 إضافة عملية جديدة:', { patient_name, operation_type, hospital });

        const [result] = await db.query(
            `INSERT INTO operations 
            (user_id, patient_name, operation_type, hospital, department, operation_date, operation_time, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, patient_name, operation_type, hospital, department, operation_date, operation_time, notes || null]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة العملية بنجاح',
            operationId: result.insertId
        });

    } catch (error) {
        console.error('❌ خطأ في إضافة العملية:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// جلب جميع عمليات المستخدم
// =============================================
export const getOperations = async (req, res) => {
    try {
        const userId = req.user.id;

        const [operations] = await db.query(
            `SELECT * FROM operations 
             WHERE user_id = ? 
             ORDER BY operation_date DESC, created_at DESC`,
            [userId]
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
// جلب عملية محددة
// =============================================
export const getOperationById = async (req, res) => {
    try {
        const operationId = req.params.id;
        const userId = req.user.id;

        const [operations] = await db.query(
            'SELECT * FROM operations WHERE id = ? AND user_id = ?',
            [operationId, userId]
        );

        if (operations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'العملية غير موجودة'
            });
        }

        res.json({
            success: true,
            operation: operations[0]
        });

    } catch (error) {
        console.error('❌ خطأ في جلب العملية:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// تحديث عملية
// =============================================
export const updateOperation = async (req, res) => {
    try {
        const operationId = req.params.id;
        const userId = req.user.id;
        const { patient_name, operation_type, hospital, department, operation_date, operation_time, notes } = req.body;

        const [result] = await db.query(
            `UPDATE operations 
             SET patient_name = ?, operation_type = ?, hospital = ?, department = ?, 
                 operation_date = ?, operation_time = ?, notes = ?
             WHERE id = ? AND user_id = ?`,
            [patient_name, operation_type, hospital, department, operation_date, operation_time, notes, operationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'العملية غير موجودة أو لا تملك صلاحية التعديل'
            });
        }

        res.json({
            success: true,
            message: 'تم تحديث العملية بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تحديث العملية:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في الخادم: ' + error.message
        });
    }
};

// =============================================
// حذف عملية
// =============================================
export const deleteOperation = async (req, res) => {
    try {
        const operationId = req.params.id;
        const userId = req.user.id;

        const [result] = await db.query(
            'DELETE FROM operations WHERE id = ? AND user_id = ?',
            [operationId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'العملية غير موجودة أو لا تملك صلاحية الحذف'
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