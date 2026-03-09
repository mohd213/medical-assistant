// ===== التحقق من عدم تكرار التعريف =====
if (typeof window.API_URL === "undefined") {
  window.API_URL = "http://localhost:3000/api";
}

// =============================================
// نظام الإشعارات المتطور - بديل alert
// =============================================

// إضافة CSS مرة واحدة فقط
(function addNotificationStyles() {
  if (document.getElementById("notification-system-styles")) return;

  const styles = `
        <style id="notification-system-styles">
            /* أنيميشنات الإشعارات */
            @keyframes slideDown {
                from {
                    top: 50px;
                    opacity: 0;
                    transform: translateX(-50%) scale(0.8);
                }
                to {
                    top: 100px;
                    opacity: 1;
                    transform: translateX(-50%) scale(1);
                }
            }
            
            @keyframes slideOut {
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            /* تنسيقات الإشعارات */
            .notification-toast {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                padding: 16px 30px;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 999999;
                display: flex;
                align-items: center;
                gap: 12px;
                font-family: 'Tajawal', sans-serif;
                direction: rtl;
                min-width: 300px;
                max-width: 500px;
                animation: slideDown 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                border: 1px solid rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
            }
            
            .notification-toast i {
                font-size: 24px;
            }
            
            .notification-toast .message {
                flex: 1;
                font-size: 15px;
                font-weight: 500;
            }
            
            .notification-toast .close-btn {
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                font-size: 18px;
            }
            
            .notification-toast .close-btn:hover {
                opacity: 1;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #28a745, #20c997);
                border-right: 5px solid #fff;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #dc3545, #ff6b6b);
                border-right: 5px solid #fff;
            }
            
            .notification-warning {
                background: linear-gradient(135deg, #ffc107, #fd7e14);
                border-right: 5px solid #fff;
                color: #333;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #17a2b8, #0dcaf0);
                border-right: 5px solid #fff;
            }
            
            /* مودال التأكيد */
            .confirm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                backdrop-filter: blur(5px);
                z-index: 999998;
                animation: fadeIn 0.2s ease;
            }
            
            .confirm-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-secondary, white);
                border-radius: 20px;
                box-shadow: 0 30px 60px rgba(0,0,0,0.3);
                z-index: 999999;
                width: 90%;
                max-width: 400px;
                direction: rtl;
                animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                overflow: hidden;
            }
            
            .confirm-header {
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid var(--border-color, #f0f0f0);
            }
            
            .confirm-header i {
                font-size: 50px;
                margin-bottom: 10px;
            }
            
            .confirm-header.warning i { color: #ffc107; }
            .confirm-header.danger i { color: #dc3545; }
            .confirm-header.info i { color: #17a2b8; }
            
            .confirm-header h3 {
                margin: 0;
                color: var(--text-primary, #2c3e50);
                font-size: 20px;
                font-weight: 600;
            }
            
            .confirm-body {
                padding: 20px;
                text-align: center;
                color: var(--text-secondary, #7f8c8d);
                font-size: 15px;
                line-height: 1.6;
            }
            
            .confirm-footer {
                padding: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
                border-top: 1px solid var(--border-color, #f0f0f0);
            }
            
            .confirm-btn {
                padding: 10px 30px;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Tajawal', sans-serif;
                font-size: 14px;
            }
            
            .confirm-btn.confirm {
                background: #4260a0;
                color: white;
            }
            
            .confirm-btn.confirm:hover {
                background: #2c3e6b;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(66,96,160,0.3);
            }
            
            .confirm-btn.cancel {
                background: #e9ecef;
                color: #7f8c8d;
            }
            
            .confirm-btn.cancel:hover {
                background: #dee2e6;
            }
            
            .confirm-btn.danger {
                background: #dc3545;
                color: white;
            }
            
            .confirm-btn.danger:hover {
                background: #bb2d3b;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(220,53,69,0.3);
            }
            
            /* مودال الإدخال */
            .prompt-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-secondary, white);
                border-radius: 20px;
                box-shadow: 0 30px 60px rgba(0,0,0,0.3);
                z-index: 999999;
                width: 90%;
                max-width: 450px;
                direction: rtl;
                animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                overflow: hidden;
            }
            
            .prompt-header {
                padding: 20px;
                background: linear-gradient(135deg, #4260a0, #2c3e6b);
                color: white;
                text-align: center;
            }
            
            .prompt-header i {
                font-size: 40px;
                margin-bottom: 10px;
            }
            
            .prompt-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
            }
            
            .prompt-body {
                padding: 25px;
            }
            
            .prompt-body p {
                color: var(--text-secondary, #7f8c8d);
                margin-bottom: 15px;
                font-size: 14px;
            }
            
            .prompt-input {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid var(--border-color, #e1e1e1);
                border-radius: 10px;
                font-family: 'Tajawal', sans-serif;
                font-size: 15px;
                transition: all 0.3s;
                margin-bottom: 5px;
                background-color: var(--input-bg, white);
                color: var(--text-primary, #2c3e50);
            }
            
            .prompt-input:focus {
                border-color: #4260a0;
                outline: none;
                box-shadow: 0 0 0 3px rgba(66,96,160,0.1);
            }
            
            .prompt-footer {
                padding: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
                border-top: 1px solid var(--border-color, #f0f0f0);
            }
            
            @media (max-width: 768px) {
                .notification-toast {
                    min-width: auto;
                    width: 90%;
                    padding: 12px 20px;
                }
            }
        </style>
    `;

  document.head.insertAdjacentHTML("beforeend", styles);
})();

// =============================================
// الوضع الليلي - Dark Mode
// =============================================

// التحقق من الوضع المحفوظ
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

// تحديث الأيقونة في جميع الصفحات
function updateAllThemeIcons(theme) {
  const headerIcon = document.getElementById("theme-toggle-header");
  if (headerIcon) {
    const icon = headerIcon.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "icofont-sun" : "icofont-moon";
    }
  }
  $(".theme-icon").each(function () {
    $(this).toggleClass("icofont-moon icofont-sun");
  });
}

// دالة تبديل الوضع
function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  updateAllThemeIcons(newTheme);

  if (window.msg) {
    msg.success(
      newTheme === "dark" ? "تم تفعيل الوضع الليلي" : "تم تفعيل الوضع النهاري",
    );
  }
}

// إضافة زر التبديل إلى القائمة
function addThemeToggleToHeader() {
  if (document.getElementById("theme-toggle-header")) return;

  const navMenu = document.querySelector(".header .main-menu .nav.menu");
  if (!navMenu) return;

  const li = document.createElement("li");
  li.className = "theme-toggle-header";
  li.id = "theme-toggle-header";
  li.setAttribute("title", "تغيير المظهر");
  li.setAttribute("onclick", "toggleTheme()");

  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const icon = document.createElement("i");
  icon.className = currentTheme === "dark" ? "icofont-sun" : "icofont-moon";
  li.appendChild(icon);

  const notificationItem = navMenu.querySelector(".notification-list");
  if (notificationItem) {
    navMenu.insertBefore(li, notificationItem);
  } else {
    navMenu.appendChild(li);
  }
}

// =============================================
// نظام قائمة البرغر (Burger Menu) للموبايل
// =============================================
function initMobileMenu() {
  if ($('.header').length === 0) return;

  // إضافة أيقونة البرغر إذا لم تكن موجودة
  if ($('.burger-icon').length === 0) {
    const burgerIcon = $('<div class="burger-icon"><i class="icofont-navigation-menu"></i></div>');
    $('.header .header-inner').append(burgerIcon);
  }

  const $burger = $('.burger-icon');
  const $nav = $('.header .header-inner .main-menu .nav');

  // إزالة أي مستمعات قديمة
  $burger.off('click').on('click', function(e) {
    e.stopPropagation();
    $nav.toggleClass('open');
  });

  // معالجة القوائم المنسدلة في الموبايل
  $('.header .header-inner .main-menu .nav > li:has(.dropdown) > a').off('click.mobile').on('click.mobile', function(e) {
    if ($(window).width() <= 991) {
      e.preventDefault();
      e.stopPropagation();
      $(this).closest('li').find('.dropdown').toggleClass('show-dropdown');
    }
  });

  // إغلاق القائمة عند النقر خارجها
  $(document).off('click.menu').on('click.menu', function(event) {
    if ($(window).width() <= 991 && $nav.hasClass('open')) {
      if (!$(event.target).closest('.burger-icon, .nav').length) {
        $nav.removeClass('open');
        $('.dropdown.show-dropdown').removeClass('show-dropdown');
      }
    }
  });

  // عند تغيير حجم الشاشة
  $(window).off('resize.menu').on('resize.menu', function() {
    if ($(window).width() > 991) {
      $nav.removeClass('open');
      $('.dropdown.show-dropdown').removeClass('show-dropdown');
    }
  });
}

// =============================================
// نظام الإشعارات
// =============================================
if (typeof window.showToast === "undefined") {
  window.showToast = function (message, type = "success", duration = 3000) {
    const oldToast = document.querySelector(".notification-toast");
    if (oldToast) oldToast.remove();

    const icons = {
      success: "icofont-check-circled",
      error: "icofont-exclamation-circle",
      warning: "icofont-warning",
      info: "icofont-info-circle",
    };

    const toast = document.createElement("div");
    toast.className = `notification-toast notification-${type}`;
    toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span class="message">${message}</span>
            <i class="icofont-close-line close-btn"></i>
        `;

    document.body.appendChild(toast);

    toast.querySelector(".close-btn").addEventListener("click", () => {
      toast.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "slideOut 0.3s ease forwards";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  };

  window.showConfirm = function (options) {
    const {
      title = "تأكيد",
      message = "هل أنت متأكد؟",
      type = "warning",
      confirmText = "نعم",
      cancelText = "إلغاء",
      onConfirm,
      onCancel,
    } = options;

    document
      .querySelectorAll(".confirm-overlay, .confirm-modal")
      .forEach((el) => el.remove());

    const icons = {
      warning: "icofont-warning",
      danger: "icofont-exclamation-circle",
      info: "icofont-info-circle",
    };

    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";

    const modal = document.createElement("div");
    modal.className = "confirm-modal";
    modal.innerHTML = `
            <div class="confirm-header ${type}">
                <i class="${icons[type]}"></i>
                <h3>${title}</h3>
            </div>
            <div class="confirm-body">
                <p>${message}</p>
            </div>
            <div class="confirm-footer">
                <button class="confirm-btn ${type === "danger" ? "danger" : "confirm"}" id="confirmYes">${confirmText}</button>
                <button class="confirm-btn cancel" id="confirmNo">${cancelText}</button>
            </div>
        `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById("confirmYes").addEventListener("click", () => {
      overlay.remove();
      modal.remove();
      if (onConfirm) onConfirm();
    });

    document.getElementById("confirmNo").addEventListener("click", () => {
      overlay.remove();
      modal.remove();
      if (onCancel) onCancel();
    });

    overlay.addEventListener("click", () => {
      overlay.remove();
      modal.remove();
      if (onCancel) onCancel();
    });
  };

  window.showPrompt = function (options) {
    const {
      title = "إدخال بيانات",
      message = "",
      placeholder = "أدخل القيمة...",
      defaultValue = "",
      confirmText = "حفظ",
      cancelText = "إلغاء",
      onConfirm,
      onCancel,
    } = options;

    document
      .querySelectorAll(".confirm-overlay, .prompt-modal")
      .forEach((el) => el.remove());

    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";

    const modal = document.createElement("div");
    modal.className = "prompt-modal";
    modal.innerHTML = `
            <div class="prompt-header">
                <i class="icofont-pencil-alt-5"></i>
                <h3>${title}</h3>
            </div>
            <div class="prompt-body">
                ${message ? `<p>${message}</p>` : ""}
                <input type="text" class="prompt-input" id="promptInput" placeholder="${placeholder}" value="${defaultValue}">
            </div>
            <div class="prompt-footer">
                <button class="confirm-btn confirm" id="promptConfirm">${confirmText}</button>
                <button class="confirm-btn cancel" id="promptCancel">${cancelText}</button>
            </div>
        `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const input = document.getElementById("promptInput");
    input.focus();
    input.select();

    document.getElementById("promptConfirm").addEventListener("click", () => {
      const value = input.value;
      overlay.remove();
      modal.remove();
      if (onConfirm) onConfirm(value);
    });

    document.getElementById("promptCancel").addEventListener("click", () => {
      overlay.remove();
      modal.remove();
      if (onCancel) onCancel();
    });

    overlay.addEventListener("click", () => {
      overlay.remove();
      modal.remove();
      if (onCancel) onCancel();
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        document.getElementById("promptConfirm").click();
      }
    });
  };

  window.msg = {
    success: (text) => showToast(text, "success"),
    error: (text) => showToast(text, "error"),
    warning: (text) => showToast(text, "warning"),
    info: (text) => showToast(text, "info"),
    confirm: (message, onYes, onNo) =>
      showConfirm({
        message: message,
        onConfirm: onYes,
        onCancel: onNo,
      }),
    prompt: (message, onConfirm, defaultValue = "") =>
      showPrompt({
        message: message,
        onConfirm: onConfirm,
        defaultValue: defaultValue,
      }),
  };
}

// =============================================
// دوال عرض الأخطاء بشكل منظم
// =============================================

window.showValidationErrors = function (errors) {
  $(".validation-error").remove();

  if (!errors || Object.keys(errors).length === 0) return;

  Object.keys(errors).forEach((field) => {
    const errorMessages = errors[field];
    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      const input = $(`[name="${field}"], #${field}, .${field}`);
      if (input.length) {
        input.addClass("is-invalid");

        const errorDiv =
          $(`<div class="validation-error text-danger mt-1" style="font-size: 13px;">
                    <i class="icofont-exclamation-circle ml-1"></i>
                    ${errorMessages.join("<br>")}
                </div>`);

        input.after(errorDiv);

        input.on("input change", function () {
          $(this).removeClass("is-invalid");
          $(this)
            .next(".validation-error")
            .fadeOut(300, function () {
              $(this).remove();
            });
        });
      }
    }
  });

  if (window.msg) {
    msg.error("يرجى تصحيح الأخطاء في النموذج");
  }
};

window.clearValidationErrors = function () {
  $(".is-invalid").removeClass("is-invalid");
  $(".validation-error").remove();
};

window.validateField = function (field, value, validatorFn) {
  const result = validatorFn(value);
  const input = $(`[name="${field}"], #${field}`);

  input.removeClass("is-invalid");
  input.next(".validation-error").remove();

  if (!result.valid && result.errors.length > 0) {
    input.addClass("is-invalid");

    const errorDiv =
      $(`<div class="validation-error text-danger mt-1" style="font-size: 13px;">
            <i class="icofont-exclamation-circle ml-1"></i>
            ${result.errors[0]}
        </div>`);

    input.after(errorDiv);
  }

  return result;
};

// إضافة CSS للأخطاء
(function addValidationStyles() {
  if (document.getElementById("validation-styles")) return;

  const styles = `
        <style id="validation-styles">
            .is-invalid {
                border-color: #dc3545 !important;
                background-color: rgba(220, 53, 69, 0.05) !important;
            }
            
            .is-invalid:focus {
                box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25) !important;
            }
            
            .validation-error {
                animation: slideDown 0.3s ease;
                padding-right: 10px;
            }
            
            [data-theme="dark"] .is-invalid {
                background-color: rgba(220, 53, 69, 0.15) !important;
            }
            
            [data-theme="dark"] .validation-error {
                color: #ff8b8b !important;
            }
        </style>
    `;

  document.head.insertAdjacentHTML("beforeend", styles);
})();

// =============================================
// دوال مساعدة
// =============================================
if (typeof window.checkAuth === "undefined") {
  window.checkAuth = function () {
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname.split("/").pop();

    const protectedPages = [
      "home.html",
      "blogs.html",
      "operations.html",
      "patient.html",
      "follow-up.html",
      "add-case.html",
      "edit-profile.html",
      "contact.html",
      "admin.html",
    ];

    if (protectedPages.includes(currentPage) && !token) {
      window.location.href = "/html/login/login.html";
      return false;
    }
    return token;
  };
}

if (typeof window.logout === "undefined") {
  window.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/html/login/login.html";
  };
}

if (typeof window.updateUserInfo === "undefined") {
  window.updateUserInfo = function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.firstname) {
      $(".avatar .name span").text(`${user.firstname} ${user.lastname || ""}`);

      if (user.profile_img) {
        $(".avatar .img img").attr("src", ".." + user.profile_img);
      }

      $("#sidebarName").text(`${user.firstname} ${user.lastname || ""}`);

      if (user.profile_img && $("#sidebarImage").length) {
        $("#sidebarImage").attr("src", ".." + user.profile_img);
      }
    }
  };
}

// ===== تهيئة الصفحة =====
$(document).ready(function () {
  // تفعيل المكتبات
  if ($.fn.niceSelect) $("select").niceSelect();
  if ($.fn.datepicker) $("#datepicker").datepicker();

  // تطبيق الوضع المحفوظ
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // إضافة زر الوضع الليلي
  addThemeToggleToHeader();

  // تهيئة قائمة البرغر للموبايل
  initMobileMenu();

  // التحقق من تسجيل الدخول
  if (typeof checkAuth === "function") checkAuth();

  // تحديث معلومات المستخدم
  if (typeof updateUserInfo === "function") updateUserInfo();

  // ربط زر تسجيل الخروج
  $('a[href="./login/login.html"]').click(function (e) {
    e.preventDefault();
    if (typeof logout === "function") logout();
  });

  // إخفاء شاشة التحميل
  $(".preloader").fadeOut(300);
});

$(window).on("load", function () {
  $(".preloader").fadeOut(200);
  // إعادة تهيئة قائمة البرغر بعد تحميل الصفحة بالكامل
  initMobileMenu();
});