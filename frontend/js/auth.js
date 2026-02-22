// frontend/js/auth.js

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/html/login/login.html';
        return false;
    }
    return true;
}

// عرض اسم المستخدم
function displayUserName() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.firstname && user.lastname) {
        $('.name span').text(user.firstname + ' ' + user.lastname);
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/html/login/login.html';
}

// التحقق من الصفحات المحمية
$(document).ready(function() {
    const protectedPages = ['home.html', 'add-case.html', 'blogs.html', 'contact.html', 'edit-profile.html', 'follow-up.html', 'operations.html', 'patient.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        if (!checkAuth()) return;
        displayUserName();
    }
    
    // ربط زر تسجيل الخروج
    $('a[href="./login/login.html"]').parent('li').on('click', function(e) {
        e.preventDefault();
        logout();
    });
});