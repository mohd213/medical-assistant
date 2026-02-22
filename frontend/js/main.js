$(document).ready(function () {
    // Nice Select JS
    if ($('select').length) {
        $('select').niceSelect();
    }

    // Date Picker JS
    if ($("#datepicker").length) {
        $("#datepicker").datepicker();
    }

    // التحقق من تسجيل الدخول
    const token = localStorage.getItem('token');
    if (token) {
        $('.guest-menu').hide();
        $('.user-menu').show();
    } else {
        $('.guest-menu').show();
        $('.user-menu').hide();
    }
    
    // معالجة رفع الصور
    $('#photo-upload').change(function (event) {
        var fileName = $(this).val().split('\\').pop();
        $(this).siblings('label').text(fileName);
    });

    // تحديث صورة الملف الشخصي
    const inputElement = $("#file-upload");
    const imageElement = $("#profile-image");
    
    if (inputElement.length && imageElement.length) {
        inputElement.on("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    imageElement.attr("src", reader.result);
                };
            }
        });

        $("#upload-button").on("click", function () {
            inputElement.click();
        });
    }
});

// إخفاء الـ Preloader بشكل قسري
$(document).ready(function() {
    $('.preloader').fadeOut(300);
});

$(window).on('load', function() {
    $('.preloader').fadeOut(200);
});