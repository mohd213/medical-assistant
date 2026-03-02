import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medical_assistant_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// اختبار الاتصال
(async () => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ اتصال قاعدة البيانات ناجح!');
    } catch (err) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message);
    }
})();

export default pool;