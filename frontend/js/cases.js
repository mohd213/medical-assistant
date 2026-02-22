// frontend/js/cases.js

// جلب جميع حالات المتابعة
async function fetchCases() {
    try {
        const result = await apiRequest('/cases');
        if (result.success) {
            displayCases(result.data);
        }
    } catch (error) {
        console.error('خطأ في جلب الحالات:', error);
    }
}

// عرض الحالات في الصفحة
function displayCases(cases) {
    const container = $('#accordion');
    container.empty();
    
    cases.forEach((caseItem, index) => {
        const html = `
            <div class="card">
                <div class="card-header" id="heading${index}">
                    <h5 class="mb-0">
                        <p class="mb-0" data-toggle="collapse" data-target="#collapse${index}">
                            <span class="ml-2">حالة: </span> ${caseItem.name}
                        </p>
                        <div class="edit-icon">
                            <a href="./add-case.html?id=${caseItem.id}"><i class="icofont-ui-edit"></i></a>
                        </div>
                    </h5>
                </div>
                <div id="collapse${index}" class="collapse" data-parent="#accordion">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-6"><p><span>الاسم: </span>${caseItem.name}</p></div>
                            <div class="col-lg-6"><p><span>العمر: </span>${caseItem.age}</p></div>
                            <div class="col-lg-6"><p><span>الجنس: </span>${caseItem.gender}</p></div>
                            <div class="col-lg-6"><p><span>المرض: </span>${caseItem.sick}</p></div>
                            <div class="col-lg-6"><p><span>الدواء: </span>${caseItem.medicine}</p></div>
                            <div class="col-lg-6"><p><span>العملية: </span>${caseItem.surgery || 'لا يوجد'}</p></div>
                            <div class="col-lg-6"><p><span>نسبة التشافي: </span>${caseItem.healing}%</p></div>
                            <div class="col-12"><p><span>ملاحظات: </span>${caseItem.notes || ''}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.append(html);
    });
}

// إضافة حالة جديدة
async function addCase(caseData) {
    try {
        const result = await apiRequest('/cases', 'POST', caseData);
        if (result.success) {
            alert('تم إضافة الحالة بنجاح');
            window.location.href = './follow-up.html';
        }
    } catch (error) {
        alert('حدث خطأ في إضافة الحالة');
    }
}

// تحديث حالة
async function updateCase(id, caseData) {
    try {
        const result = await apiRequest(`/cases/${id}`, 'PUT', caseData);
        if (result.success) {
            alert('تم تحديث الحالة بنجاح');
            window.location.href = './follow-up.html';
        }
    } catch (error) {
        alert('حدث خطأ في تحديث الحالة');
    }
}

// جلب حالة محددة للتعديل
async function fetchCaseForEdit(id) {
    try {
        const result = await apiRequest(`/cases/${id}`);
        if (result.success) {
            const caseItem = result.data;
            $('input[name="name"]').val(caseItem.name);
            $('input[name="age"]').val(caseItem.age);
            $('input[name="sick"]').val(caseItem.sick);
            $('input[name="medicine"]').val(caseItem.medicine);
            $('input[name="surgery"]').val(caseItem.surgery);
            $('input[name="healing"]').val(caseItem.healing);
            $('textarea[name="notes"]').val(caseItem.notes);
            
            if (caseItem.gender === 'ذكر') {
                $('.nice-select .current').text('ذكر');
            } else if (caseItem.gender === 'أنثى') {
                $('.nice-select .current').text('أنثى');
            }
        }
    } catch (error) {
        console.error('خطأ في جلب الحالة:', error);
    }
}