/**
 * المساعد الطبي - نظام التشخيص الذكي
 * @version 9.0 - نسخة مع باك إند آمن
 */

// ===== إخفاء شاشة التحميل =====
(function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('preloader-deactivate'), 300);
    }
})();

// ===== الكود الرئيسي =====
$(document).ready(function() {
    let isAnalyzing = false;

    $('#analyzeBtn').click(analyzeSymptoms);
    
    $('.symptom-tag').click(function() {
        const symptom = $(this).data('symptom');
        const $input = $('#symptomInput');
        const currentVal = $input.val();
        $input.val(currentVal ? `${currentVal} ${symptom}` : symptom);
        $(this).toggleClass('active');
    });

    $('#symptomInput').keypress(function(e) {
        if (e.which === 13) {
            e.preventDefault();
            analyzeSymptoms();
        }
    });

    async function analyzeSymptoms() {
        const symptoms = $('#symptomInput').val().trim();
        if (!symptoms) return showError('الرجاء إدخال الأعراض أولاً');
        if (isAnalyzing) return;

        toggleLoading(true);
        $('#resultsContainer').empty();

        try {
            // إرسال الأعراض إلى الباك إند
            const response = await axios.post('http://localhost:3000/api/ai/analyze', {
                symptoms: symptoms
            });

            const data = response.data;

            if (data.success && data.results.length > 0) {
                displayResults(data.results, data.source);
                showMessage(data.message);
            } else {
                showError(data.message || '❌ لم يتم العثور على نتائج. استشر طبيبك.');
            }
        } catch (error) {
            console.error('خطأ:', error);
            showError('حدث خطأ في الاتصال بالخادم. حاول مرة أخرى.');
        } finally {
            toggleLoading(false);
        }
    }

    // ===== عرض النتائج =====
    function displayResults(results, source) {
        const isLocal = source === 'local';
        const headerColor = isLocal ? '#28a745' : '#4260a0';
        const headerBg = isLocal ? '#28a745' : '#4260a0';
        const icon = isLocal ? '🏥' : '💊';
        const sourceText = isLocal ? 'قاعدة أمراض محلية' : 'FDA (إدارة الغذاء والدواء)';

        const html = results.map((r, i) => `
            <div class="card mb-3" style="border-right: 5px solid ${headerColor}; animation: slideUp 0.3s ${i * 0.1}s">
                <div class="card-header" style="background: ${headerBg}; color: white;">
                    <h5 class="mb-0">${icon} ${r.name} (${r.probability}%)</h5>
                </div>
                <div class="card-body">
                    <p><strong>الوصف:</strong> ${r.description}</p>
                    <p><strong>الأعراض:</strong> ${r.symptoms}</p>
                    <p><strong>العلاج:</strong> ${r.treatment}</p>
                    <p><strong>الأدوية:</strong> ${r.medications}</p>
                    <p><strong>نصيحة:</strong> ${r.advice}</p>
                    <small class="text-muted">🔬 ${sourceText}</small>
                </div>
            </div>
        `).join('');

        $('#resultsContainer').html(`
            <h4 class="mb-3">📋 نتائج التحليل</h4>
            ${html}
        `);
    }

    function toggleLoading(loading) {
        isAnalyzing = loading;
        $('#analyzeBtn').prop('disabled', loading);
        $('.btn-text').toggle(!loading);
        $('#loadingSpinner').toggleClass('d-none', !loading);
    }

    function showMessage(msg) {
        $('#errorMessage').removeClass('d-none alert-danger').addClass('alert-info')
            .html(`<i class="icofont-info-circle"></i> ${msg}`);
        setTimeout(() => $('#errorMessage').addClass('d-none'), 3000);
    }

    function showError(msg) {
        $('#errorMessage').removeClass('d-none alert-info').addClass('alert-danger')
            .html(`<i class="icofont-exclamation-circle"></i> ${msg}`);
        $('#errorMessage').removeClass('d-none');
        setTimeout(() => $('#errorMessage').addClass('d-none'), 4000);
    }
});