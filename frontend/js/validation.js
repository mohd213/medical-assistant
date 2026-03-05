// =============================================
// نظام التحقق المتقدم - Advanced Validation System
// =============================================

window.Validator = {
    // ===== التحقق من البريد الإلكتروني =====
    email: function(email) {
        const errors = [];
        
        if (!email || email.trim() === '') {
            errors.push('البريد الإلكتروني مطلوب');
        } else {
            email = email.trim();
            if (email.length > 100) {
                errors.push('البريد الإلكتروني طويل جداً (الحد الأقصى 100 حرف)');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('صيغة البريد الإلكتروني غير صحيحة (مثال: user@example.com)');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            value: email?.trim() || ''
        };
    },

    // ===== التحقق من كلمة المرور =====
    password: function(password, options = {}) {
        const errors = [];
        const {
            minLength = 6,
            maxLength = 50,
            requireNumber = true
        } = options;

        if (!password) {
            errors.push('كلمة المرور مطلوبة');
        } else {
            if (password.length < minLength) {
                errors.push(`كلمة المرور قصيرة جداً (يجب أن تكون ${minLength} أحرف على الأقل)`);
            }
            if (password.length > maxLength) {
                errors.push(`كلمة المرور طويلة جداً (الحد الأقصى ${maxLength} حرف)`);
            }
            if (requireNumber && !/\d/.test(password)) {
                errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            value: password || ''
        };
    },

    // ===== تأكيد كلمة المرور =====
    confirmPassword: function(password, confirmPassword) {
        const errors = [];
        
        if (password !== confirmPassword) {
            errors.push('كلمة المرور غير متطابقة');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // ===== التحقق من الاسم =====
    name: function(name, fieldName = 'الاسم', options = {}) {
        const errors = [];
        const {
            minLength = 2,
            maxLength = 50,
            arabicOnly = false
        } = options;

        if (!name || name.trim() === '') {
            errors.push(`${fieldName} مطلوب`);
        } else {
            name = name.trim();
            if (name.length < minLength) {
                errors.push(`${fieldName} قصير جداً (يجب أن يكون ${minLength} أحرف على الأقل)`);
            }
            if (name.length > maxLength) {
                errors.push(`${fieldName} طويل جداً (الحد الأقصى ${maxLength} حرف)`);
            }
            if (arabicOnly && !/^[\u0600-\u06FF\s]+$/.test(name)) {
                errors.push(`${fieldName} يجب أن يحتوي على أحرف عربية فقط`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            value: name?.trim() || ''
        };
    },

    // ===== التحقق من رقم الهاتف =====
    phone: function(phone) {
        const errors = [];
        
        if (!phone || phone.trim() === '') {
            errors.push('رقم الهاتف مطلوب');
        } else {
            phone = phone.trim();
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            
            if (cleanPhone.length < 10) {
                errors.push('رقم الهاتف قصير جداً (يجب أن يكون 10 أرقام على الأقل)');
            }
            if (cleanPhone.length > 15) {
                errors.push('رقم الهاتف طويل جداً (الحد الأقصى 15 رقم)');
            }
            
            const palestineRegex = /^(00970|\+970|970|05)[0-9]{8,9}$/;
            if (!palestineRegex.test(cleanPhone) && !palestineRegex.test(phone)) {
                errors.push('رقم الهاتف غير صحيح (مثال: 059xxxxxxx أو +970xxxxxxx)');
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            value: phone?.trim() || ''
        };
    },

    // ===== التحقق من النص =====
    text: function(text, fieldName = 'النص', options = {}) {
        const errors = [];
        const {
            minLength = 1,
            maxLength = 1000,
            required = true
        } = options;

        if (required && (!text || text.trim() === '')) {
            errors.push(`${fieldName} مطلوب`);
        } else if (text) {
            text = text.trim();
            if (text.length < minLength) {
                errors.push(`${fieldName} قصير جداً (يجب أن يكون ${minLength} أحرف على الأقل)`);
            }
            if (text.length > maxLength) {
                errors.push(`${fieldName} طويل جداً (الحد الأقصى ${maxLength} حرف)`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            value: text?.trim() || ''
        };
    },

    // ===== التحقق من الاختيار =====
    select: function(value, fieldName = 'الحقل', options = []) {
        const errors = [];
        
        if (!value) {
            errors.push(`الرجاء اختيار ${fieldName}`);
        } else if (options.length > 0 && !options.includes(value)) {
            errors.push(`قيمة ${fieldName} غير صحيحة`);
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            value: value
        };
    },

    // ===== التحقق من التاريخ =====
    date: function(date, options = {}) {
        const errors = [];
        const { required = true, futureOnly = false, pastOnly = false } = options;
        
        if (!date && required) {
            errors.push('التاريخ مطلوب');
        } else if (date) {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (isNaN(selectedDate.getTime())) {
                errors.push('صيغة التاريخ غير صحيحة');
            } else if (futureOnly && selectedDate < today) {
                errors.push('يجب أن يكون التاريخ في المستقبل');
            } else if (pastOnly && selectedDate > today) {
                errors.push('يجب أن يكون التاريخ في الماضي');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            value: date || ''
        };
    },

    // ===== التحقق من المستخدم =====
    user: function(data, isRegistration = true) {
        const errors = {};
        
        const firstnameCheck = this.name(data.firstname, 'الاسم الأول', { minLength: 2, arabicOnly: true });
        if (!firstnameCheck.valid) errors.firstname = firstnameCheck.errors;
        
        const lastnameCheck = this.name(data.lastname, 'الاسم الأخير', { minLength: 2, arabicOnly: true });
        if (!lastnameCheck.valid) errors.lastname = lastnameCheck.errors;
        
        const emailCheck = this.email(data.email);
        if (!emailCheck.valid) errors.email = emailCheck.errors;
        
        if (isRegistration) {
            const passwordCheck = this.password(data.password, { minLength: 6, requireNumber: true });
            if (!passwordCheck.valid) errors.password = passwordCheck.errors;
        }
        
        const phoneCheck = this.phone(data.phone);
        if (!phoneCheck.valid) errors.phone = phoneCheck.errors;
        
        const specializationCheck = this.select(data.specialization, 'التخصص', [
            'باطني', 'أنف وأذن وحنجرة', 'جلدية', 'قلب وأوعية دموية', 'جهاز هضمي', 'كلى', 'نفسي'
        ]);
        if (!specializationCheck.valid) errors.specialization = specializationCheck.errors;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            data: {
                firstname: firstnameCheck.value,
                lastname: lastnameCheck.value,
                email: emailCheck.value,
                phone: phoneCheck.value,
                specialization: specializationCheck.value,
                password: data.password
            }
        };
    },

    // ===== التحقق من حالة المتابعة =====
    followUpCase: function(data) {
        const errors = {};
        
        const patientCheck = this.text(data.patient_name, 'اسم المريض', { minLength: 2, maxLength: 100 });
        if (!patientCheck.valid) errors.patient_name = patientCheck.errors;
        
        const ageCheck = data.age ? { valid: true } : { valid: false, errors: ['العمر مطلوب'] };
        if (data.age && (data.age < 0 || data.age > 150)) {
            ageCheck.valid = false;
            ageCheck.errors = ['العمر يجب أن يكون بين 0 و 150 سنة'];
        }
        if (!ageCheck.valid) errors.age = ageCheck.errors;
        
        const genderCheck = this.select(data.gender, 'الجنس', ['ذكر', 'أنثى']);
        if (!genderCheck.valid) errors.gender = genderCheck.errors;
        
        const diseaseCheck = this.text(data.disease, 'المرض', { minLength: 2, maxLength: 500 });
        if (!diseaseCheck.valid) errors.disease = diseaseCheck.errors;
        
        const medicineCheck = this.text(data.medicine, 'الدواء', { minLength: 2, maxLength: 500 });
        if (!medicineCheck.valid) errors.medicine = medicineCheck.errors;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            data: {
                patient_name: patientCheck.value,
                age: data.age,
                gender: genderCheck.value,
                disease: diseaseCheck.value,
                medicine: medicineCheck.value,
                surgery: data.surgery,
                notes: data.notes
            }
        };
    },

    // ===== التحقق من العملية =====
    operation: function(data) {
        const errors = {};
        
        // التحقق من اسم المريض
        const patientCheck = this.text(data.patient_name, 'اسم المريض', { minLength: 2, maxLength: 100 });
        if (!patientCheck.valid) errors.patient_name = patientCheck.errors;
        
        // التحقق من نوع العملية
        const typeCheck = this.text(data.operation_type, 'نوع العملية', { minLength: 2, maxLength: 200 });
        if (!typeCheck.valid) errors.operation_type = typeCheck.errors;
        
        // التحقق من اسم المستشفى
        const hospitalCheck = this.text(data.hospital, 'اسم المستشفى', { minLength: 2, maxLength: 200 });
        if (!hospitalCheck.valid) errors.hospital = hospitalCheck.errors;
        
        // التحقق من التاريخ
        const dateCheck = this.date(data.operation_date, { required: true, futureOnly: true });
        if (!dateCheck.valid) errors.operation_date = dateCheck.errors;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            data: {
                patient_name: patientCheck.value,
                operation_type: typeCheck.value,
                hospital: hospitalCheck.value,
                department: data.department || '',
                operation_date: dateCheck.value,
                operation_time: data.operation_time || '',
                notes: data.notes || ''
            }
        };
    },

    // ===== التحقق من رسالة الدعم الفني =====
    contactMessage: function(data) {
        const errors = {};
        
        const nameCheck = this.name(data.name, 'الاسم', { minLength: 2 });
        if (!nameCheck.valid) errors.name = nameCheck.errors;
        
        const emailCheck = this.email(data.email);
        if (!emailCheck.valid) errors.email = emailCheck.errors;
        
        const subjectCheck = this.text(data.subject, 'الموضوع', { minLength: 3, maxLength: 200 });
        if (!subjectCheck.valid) errors.subject = subjectCheck.errors;
        
        const messageCheck = this.text(data.message, 'الرسالة', { minLength: 10, maxLength: 2000 });
        if (!messageCheck.valid) errors.message = messageCheck.errors;
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            data: {
                name: nameCheck.value,
                email: emailCheck.value,
                subject: subjectCheck.value,
                message: messageCheck.value
            }
        };
    },

    // ===== الدالة الجديدة: التحقق من المدونة =====
    blog: function(data) {
        const errors = {};
        
        // التحقق من عنوان المقال
        if (!data.title || data.title.trim() === '') {
            errors.title = ['عنوان المقال مطلوب'];
        } else {
            const title = data.title.trim();
            if (title.length < 3) {
                errors.title = ['عنوان المقال قصير جداً (يجب أن يكون 3 أحرف على الأقل)'];
            }
            if (title.length > 200) {
                errors.title = ['عنوان المقال طويل جداً (الحد الأقصى 200 حرف)'];
            }
        }
        
        // التحقق من محتوى المقال
        if (!data.content || data.content.trim() === '') {
            errors.content = ['محتوى المقال مطلوب'];
        } else {
            const content = data.content.trim();
            if (content.length < 10) {
                errors.content = ['محتوى المقال قصير جداً (يجب أن يكون 10 أحرف على الأقل)'];
            }
            if (content.length > 5000) {
                errors.content = ['محتوى المقال طويل جداً (الحد الأقصى 5000 حرف)'];
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors: errors,
            data: {
                title: data.title?.trim() || '',
                content: data.content?.trim() || ''
            }
        };
    }
};