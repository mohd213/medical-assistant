import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// الحصول على __dirname في ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// استيراد المسارات
import userRoutes from './routes/userRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import operationRoutes from './routes/operationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import forgotPasswordRoutes from './routes/forgotPasswordRoutes.js';

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

export default app;