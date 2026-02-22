const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// استيراد المسارات
const userRoutes = require('./routes/userRoutes');
const caseRoutes = require('./routes/caseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const operationRoutes = require('./routes/operationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));

// استخدام المسارات
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/password', forgotPasswordRoutes);
// مسار تجريبي للتحقق
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API المساعد الطبي يعمل بنجاح',
        status: 'active',
        version: '1.0.0'
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل على: http://localhost:${PORT}`);
});