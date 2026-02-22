// ===== إعدادات عامة =====
const API_URL = 'http://localhost:3000/api';

// ===== التحقق من تسجيل الدخول =====
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    
    // الصفحات التي تحتاج تسجيل دخول
    const protectedPages = [
        'home.html', 'blogs.html', 'operations.html', 
        'patient.html', 'follow-up.html', 'add-case.html', 
        'edit-profile.html', 'contact.html'
    ];
    
    if (protectedPages.includes(currentPage) && !token) {
        window.location.href = '/html/login/login.html';
        return false;
    }
    return token;
}

// ===== طلبات API =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method,
        headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'حدث خطأ');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        alert(error.message);
        return null;
    }
}

// ===== تسجيل الخروج =====
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/html/login/login.html';
}

// ===== تحديث معلومات المستخدم =====
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.firstname) {
        $('.avatar .name span').text(`${user.firstname} ${user.lastname || ''}`);
    }
}

// ===== تهيئة الصفحة =====
$(document).ready(function() {
    // تفعيل المكتبات
    if ($.fn.niceSelect) $('select').niceSelect();
    if ($.fn.datepicker) $("#datepicker").datepicker();
    
    // التحقق من تسجيل الدخول
    checkAuth();
    
    // تحديث معلومات المستخدم
    updateUserInfo();
    
    // ربط زر تسجيل الخروج
    $('a[href="./login/login.html"]').click(function(e) {
        e.preventDefault();
        logout();
    });
});

// ===== إخفاء شاشة التحميل بشكل مؤكد =====
$(document).ready(function() {
    // إخفاء فوري
    $('.preloader').fadeOut(300);
    
    // إخفاء قسري بعد 1 ثانية
    setTimeout(function() {
        $('.preloader').fadeOut(200);
    }, 1000);
});

// عند تحميل الصفحة بالكامل
$(window).on('load', function() {
    $('.preloader').fadeOut(200);
});