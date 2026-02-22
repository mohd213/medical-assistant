// frontend/js/api.js

const API_URL = 'http://localhost:3000/api';

// دالة مساعدة للطلبات مع المصادقة
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'حدث خطأ');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}