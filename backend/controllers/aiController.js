const axios = require('axios');

// ===== إعدادات APIs =====
const APIS = {
    translate: 'https://api.mymemory.translated.net/get',
    openFDA: {
        url: 'https://api.fda.gov/drug/event.json',
        key: '5qpdeD3i6hvw84SfjQhHdYQZEpq7RUQarzrVmk10'
    }
};

// =============================================
// قاعدة بيانات محلية موسعة - 44 مرض
// =============================================
const LOCAL_DISEASES = [
    // ========== أمراض الجهاز التنفسي ==========
    {
        id: 1,
        keywords: ['صداع', 'حمى', 'سعال', 'زكام', 'رشح', 'عطس', 'بلغم', 'احتقان'],
        name: 'نزلة برد | Common Cold',
        category: 'جهاز تنفسي',
        description: 'عدوى فيروسية تصيب الجهاز التنفسي العلوي.',
        symptoms: 'صداع، حمى، سعال، عطس، احتقان بالأنف، رشح.',
        treatment: 'راحة تامة، سوائل دافئة، مسكنات، خافضات حرارة.',
        medications: 'باراسيتامول - ايبوبروفين - مضادات هيستامين',
        advice: 'اشرب سوائل كثيرة. استشر طبيبك إذا استمرت الحمى لأكثر من 3 أيام.'
    },
    {
        id: 2,
        keywords: ['حمى', 'قشعريرة', 'سعال', 'بلغم', 'صدر', 'تنفس', 'نهجان', 'ألم صدر'],
        name: 'التهاب رئوي | Pneumonia',
        category: 'جهاز تنفسي',
        description: 'عدوى في الأكياس الهوائية للرئة.',
        symptoms: 'حمى عالية، قشعريرة، سعال مع بلغم أصفر أو أخضر، ألم صدر، ضيق تنفس.',
        treatment: 'مضادات حيوية، راحة تامة، سوائل، خافضات حرارة، أكسجين إذا لزم.',
        medications: 'أموكسيسيلين - أزيثروميسين - ليفوفلوكساسين',
        advice: '⚠️ حالة خطيرة. راجع الطبيب فوراً. أكمل المضاد الحيوي كاملة.'
    },
    {
        id: 3,
        keywords: ['ربو', 'صدر', 'نهجان', 'كحة', 'صفير', 'تنفس', 'حساسية', 'ضيق'],
        name: 'الربو الشعبي | Asthma',
        category: 'جهاز تنفسي',
        description: 'مرض التهابي مزمن في الشعب الهوائية.',
        symptoms: 'صفير أثناء التنفس، كحة، ضيق صدر، نهجان خاصة بالليل أو الصباح.',
        treatment: 'موسعات شعب، بخاخات، كورتيزون استنشاقي، تجنب المهيجات.',
        medications: 'فينتولين - سيريتايد - بلميكورت',
        advice: 'تجنب المهيجات (الغبار، الدخان، الروائح). احمل البخاخ دائماً.'
    },
    {
        id: 4,
        keywords: ['تهاب', 'لوز', 'حلق', 'حمى', 'بلع', 'صديد', 'ألم'],
        name: 'التهاب اللوزتين | Tonsillitis',
        category: 'جهاز تنفسي',
        description: 'التهاب في اللوزتين بسبب فيروس أو بكتيريا.',
        symptoms: 'ألم شديد في الحلق، صعوبة بلع، حمى، احمرار اللوزتين مع صديد.',
        treatment: 'مضادات حيوية، مسكنات، غرغرة بماء دافئ وملح، راحة.',
        medications: 'أموكسيسيلين - بنسلين - ايبوبروفين',
        advice: 'اشرب سوائل باردة. استشر طبيب إذا تكرر الالتهاب.'
    },
    {
        id: 5,
        keywords: ['انفلونزا', 'حمى', 'آلام', 'جسم', 'تعب', 'كحة', 'صداع'],
        name: 'الإنفلونزا | Influenza',
        category: 'جهاز تنفسي',
        description: 'عدوى فيروسية حادة تصيب الجهاز التنفسي.',
        symptoms: 'حمى مفاجئة، آلام شديدة في الجسم والعضلات، صداع، تعب شديد، كحة.',
        treatment: 'راحة تامة، سوائل، خافضات حرارة، مضادات فيروسية.',
        medications: 'تاميفلو - باراسيتامول - ايبوبروفين',
        advice: 'الراحة التامة ضرورية. قد تستمر الأعراض لأسبوع.'
    },

    // ========== أمراض الجهاز الهضمي ==========
    {
        id: 6,
        keywords: ['غثيان', 'إسهال', 'تقيؤ', 'مغص', 'بطن', 'استفراغ', 'جفاف', 'ماء'],
        name: 'نزلة معوية | Gastroenteritis',
        category: 'جهاز هضمي',
        description: 'التهاب في المعدة والأمعاء بسبب عدوى فيروسية أو بكتيرية.',
        symptoms: 'غثيان، إسهال مائي، تقيؤ، مغص، حمى خفيفة، جفاف.',
        treatment: 'تعويض سوائل، راحة، غذاء خفيف، مضادات إسهال.',
        medications: 'محلول معالجة الجفاف - أوندانسيترون - لوبيراميد',
        advice: 'اشرب سوائل كثيرة. راجع طبيبك إذا استمر الإسهال لأكثر من يومين.'
    },
    {
        id: 7,
        keywords: ['قرحة', 'معدة', 'حرقة', 'حموضة', 'ألم', 'جوع', 'طعام'],
        name: 'قرحة المعدة | Gastric Ulcer',
        category: 'جهاز هضمي',
        description: 'تقرح في بطانة المعدة بسبب جرثومة المعدة أو مسكنات.',
        symptoms: 'ألم في أعلى البطن، يزيد مع الجوع ويخف مع الطعام، حموضة، غثيان.',
        treatment: 'مثبطات الحموضة، مضادات حيوية للجرثومة، تجنب المهيجات.',
        medications: 'أوميبرازول - أموكسيسيلين - كلاريثروميسين',
        advice: 'تجنب المسكنات والأطعمة الحارة. التزم بالعلاج كاملاً.'
    },
    {
        id: 8,
        keywords: ['قولون', 'انتفاخ', 'غازات', 'إمساك', 'إسهال', 'بطن', 'عصبي'],
        name: 'القولون العصبي | IBS',
        category: 'جهاز هضمي',
        description: 'اضطراب وظيفي في القولون يزداد مع التوتر.',
        symptoms: 'انتفاخ، غازات، آلام بطن متقطعة، إمساك أو إسهال بالتناوب.',
        treatment: 'تغيير نمط الحياة، تجنب التوتر، ألياف، مضادات تشنج.',
        medications: 'ميبيفيرين - سيميثيكون - بروبيوتيك',
        advice: 'تجنب التوتر والقلق. حدد الأطعمة التي تهيج القولون وتجنبها.'
    },
    {
        id: 9,
        keywords: ['مرارة', 'حوصلة', 'ألم', 'يمين', 'بطن', 'دهون', 'غثيان'],
        name: 'التهاب المرارة | Cholecystitis',
        category: 'جهاز هضمي',
        description: 'التهاب في المرارة بسبب حصوات أو عدوى.',
        symptoms: 'ألم حاد في أعلى البطن جهة اليمين، غثيان، تقيؤ، حمى.',
        treatment: 'مضادات حيوية، مسكنات، استئصال المرارة جراحياً.',
        medications: 'سيبروفلوكساسين - مترونيدازول',
        advice: '⚠️ حالة طارئة. راجع الطبيب فوراً. تجنب الأطعمة الدسمة.'
    },
    {
        id: 10,
        keywords: ['كبد', 'يرقان', 'اصفرار', 'تعب', 'بول داكن', 'غثيان'],
        name: 'التهاب الكبد الفيروسي | Hepatitis',
        category: 'جهاز هضمي',
        description: 'التهاب فيروسي في خلايا الكبد.',
        symptoms: 'يرقان (اصفرار الجلد والعينين)، تعب شديد، بول داكن، غثيان.',
        treatment: 'راحة، سوائل، تجنب الكحول، مضادات فيروسية.',
        medications: 'سوفوسبوفير - انتيكافير - إنترفيرون',
        advice: 'تابع وظائف الكبد بانتظام. تجنب أي دواء بدون استشارة.'
    },
    {
        id: 11,
        keywords: ['بنكرياس', 'ألم', 'ظهر', 'بطن', 'غثيان', 'قيء', 'حمى'],
        name: 'التهاب البنكرياس | Pancreatitis',
        category: 'جهاز هضمي',
        description: 'التهاب حاد في البنكرياس بسبب حصوات أو كحول.',
        symptoms: 'ألم شديد في أعلى البطن يمتد للظهر، غثيان، قيء، حمى.',
        treatment: 'صيام مؤقت، سوائل وريدية، مسكنات قوية.',
        medications: 'مسكنات أفيونية - إنزيمات بنكرياس',
        advice: '⚠️ حالة طارئة. ممنوع الأكل أو الشرب حتى استشارة الطبيب.'
    },

    // ========== أمراض القلب والدورة الدموية ==========
    {
        id: 12,
        keywords: ['ألم صدر', 'ضيق نفس', 'تعرق', 'دوخة', 'غثيان', 'خفقان', 'ذراع'],
        name: 'ذبحة صدرية | Angina',
        category: 'قلب وأوعية',
        description: 'نقص تدفق الدم والأكسجين إلى عضلة القلب.',
        symptoms: 'ألم أو ضغط في الصدر، ضيق تنفس، تعرق، دوخة، ألم في الذراع الأيسر.',
        treatment: 'راحة فورية، أكسجين، موسعات شرايين، قسطرة.',
        medications: 'نتروجليسرين - أسبرين - ميتوبرولول',
        advice: '⚠️ استشر طبيب فوراً. إذا استمر الألم أكثر من 5 دقائق، اطلب إسعافاً.'
    },
    {
        id: 13,
        keywords: ['جلطة', 'قلب', 'ألم صدر', 'تعرق', 'غثيان', 'نهجان'],
        name: 'احتشاء عضلة القلب | Heart Attack',
        category: 'قلب وأوعية',
        description: 'موت جزء من عضلة القلب بسبب انسداد شريان تاجي.',
        symptoms: 'ألم صدري شديد، تعرق بارد، غثيان، ضيق تنفس، خوف من الموت.',
        treatment: '⚠️ طارئ! أسبرين، أكسجين، قسطرة عاجلة، مسيلات دم.',
        medications: 'أسبرين - كلوبيدوجريل - هيبارين',
        advice: '⚠️ حالة طارئة جداً! اطلب الإسعاف فوراً. لا تنتظر.'
    },
    {
        id: 14,
        keywords: ['ضغط', 'دم', 'دوخة', 'صداع', 'تعب', 'رؤية'],
        name: 'ارتفاع ضغط الدم | Hypertension',
        category: 'قلب وأوعية',
        description: 'ارتفاع قوة دفع الدم على جدران الشرايين.',
        symptoms: 'قد لا تظهر أعراض، أو صداع، دوخة، تعب، عدم وضوح الرؤية.',
        treatment: 'حمية قليلة الملح، أدوية خافضة للضغط، رياضة.',
        medications: 'أملوديبين - كابتوبريل - لوسارتان',
        advice: 'تجنب الملح والدهون. قس ضغطك بانتظام. التزم بالعلاج مدى الحياة.'
    },
    {
        id: 15,
        keywords: ['فشل', 'قلب', 'نهجان', 'تورم', 'قدم', 'كاحل', 'سوائل'],
        name: 'فشل القلب الاحتقاني | CHF',
        category: 'قلب وأوعية',
        description: 'ضعف عضلة القلب عن ضخ الدم بكفاءة.',
        symptoms: 'نهجان مع الجهد أو الاستلقاء، تورم القدمين والكاحلين، تعب.',
        treatment: 'مدرات بول، أدوية لتقوية القلب، حمية قليلة الملح.',
        medications: 'فوروسيميد - ديجوكسين - سبيرونولاكتون',
        advice: 'قلل الملح. راقب وزنك يومياً. استشر طبيبك بانتظام.'
    },

    // ========== أمراض الجلد ==========
    {
        id: 16,
        keywords: ['حكة', 'هرش', 'طفح', 'احمرار', 'جلد', 'جرب', 'بثور'],
        name: 'حساسية جلدية | Skin Allergy',
        category: 'جلدية',
        description: 'تفاعل تحسسي يسبب حكة واحمرار في الجلد.',
        symptoms: 'حكة شديدة، احمرار، طفح جلدي، جفاف، تقشر.',
        treatment: 'مضادات هيستامين، كريمات مرطبة، كورتيزون موضعي، تجنب المسبب.',
        medications: 'سيتريزين - لوراتادين - كريم هيدروكورتيزون',
        advice: 'تجنب حك الجلد. استشر طبيب جلدية إذا استمرت الأعراض.'
    },
    {
        id: 17,
        keywords: ['صدفية', 'قشور', 'فضي', 'بقع', 'حمراء', 'ركبة', 'كوع'],
        name: 'الصدفية | Psoriasis',
        category: 'جلدية',
        description: 'مرض مناعي ذاتي يسبب تكاثر سريع لخلايا الجلد.',
        symptoms: 'بقع حمراء مغطاة بقشور فضية، غالباً في الركبتين والأكواع وفروة الرأس.',
        treatment: 'كريمات كورتيزون، علاج ضوئي، أدوية مثبطة للمناعة.',
        medications: 'كلوبيتاسول - ميثوتريكسات - أداليموماب',
        advice: 'تجنب التوتر. رطب الجلد دائماً. الصدفية مرض مزمن يحتاج متابعة.'
    },
    {
        id: 18,
        keywords: ['حب', 'شباب', 'بثور', 'دهون', 'وجه', 'رؤوس', 'سوداء'],
        name: 'حب الشباب | Acne',
        category: 'جلدية',
        description: 'التهاب في بصيلات الشعر والغدد الدهنية.',
        symptoms: 'بثور، رؤوس سوداء وبيضاء، حبوب في الوجه والصدر والظهر.',
        treatment: 'منظفات لطيفة، كريمات موضعية، مضادات حيوية، رواكيوتان.',
        medications: 'بنزويل بيروكسايد - أدابالين - دوكسيسيكلين',
        advice: 'لا تعصر الحبوب. نظف البشرة بلطف. تجنب الأطعمة الدهنية.'
    },
    {
        id: 19,
        keywords: ['اكزيما', 'جفاف', 'حكة', 'تشقق', 'التهاب', 'جلد'],
        name: 'الإكزيما | Eczema',
        category: 'جلدية',
        description: 'التهاب مزمن في الجلد يسبب حكة وجفاف.',
        symptoms: 'جفاف شديد، حكة، احمرار، تشقق الجلد، خاصة في ثنايا الجسم.',
        treatment: 'مرطبات قوية، كريمات كورتيزون، مضادات هيستامين.',
        medications: 'كريم يوريا - هيدروكورتيزون - تاكروليموس',
        advice: 'رطب الجلد يومياً. تجنب الصابون القاسي والمواد المهيجة.'
    },
    {
        id: 20,
        keywords: ['فطريات', 'قدم', 'رياضي', 'حكة', 'تشقق', 'أصابع'],
        name: 'فطريات القدم | Athlete\'s Foot',
        category: 'جلدية',
        description: 'عدوى فطرية تصيب القدم خاصة بين الأصابع.',
        symptoms: 'حكة، حرقة، تشقق وتقشر الجلد بين الأصابع، رائحة.',
        treatment: 'كريمات مضادة للفطريات، بودرة، تجفيف القدم جيداً.',
        medications: 'كلوتريمازول - ميكونازول - تيربينافين',
        advice: 'جفف قدمك جيداً. ارتد أحذية قطنية. غير الجوارب يومياً.'
    },
    {
        id: 21,
        keywords: ['هربس', 'قرحة', 'باردة', 'فم', 'شفة', 'بثور', 'ألم'],
        name: 'الهربس الفموي | Herpes',
        category: 'جلدية',
        description: 'عدوى فيروسية تسبب بثوراً مؤلمة حول الفم.',
        symptoms: 'بثور صغيرة مؤلمة حول الفم، حكة، حرقة، تظهر عند الإجهاد.',
        treatment: 'كريمات مضادة للفيروسات، مسكنات، تجنب لمس البثور.',
        medications: 'أسيكلوفير - فالاسيكلوفير',
        advice: 'ينتقل باللمس. تجنب التقبيل أثناء ظهور البثور.'
    },
    {
        id: 22,
        keywords: ['ثعلبة', 'شعر', 'تساقط', 'بقع', 'صلع', 'فروة'],
        name: 'الثعلبة | Alopecia',
        category: 'جلدية',
        description: 'مرض مناعي يسبب تساقط الشعر في بقع دائرية.',
        symptoms: 'بقع دائرية خالية من الشعر في فروة الرأس أو اللحية.',
        treatment: 'كريمات كورتيزون، حقن موضعية، مينوكسيديل.',
        medications: 'مينوكسيديل - كريم كلوبيتاسول',
        advice: 'معظم الحالات تتحسن تلقائياً. العلاج طويل ويحتاج صبر.'
    },

    // ========== أمراض السكري والغدد ==========
    {
        id: 23,
        keywords: ['سكر', 'بول', 'عطش', 'جوع', 'تعب', 'وزن', 'نزول'],
        name: 'السكري | Diabetes',
        category: 'غدد صماء',
        description: 'ارتفاع مستوى السكر في الدم بسبب مشكلة في الأنسولين.',
        symptoms: 'عطش شديد، كثرة التبول، جوع شديد، تعب، فقدان وزن، تشوش الرؤية.',
        treatment: 'حمية غذائية، أدوية، أنسولين، رياضة منتظمة.',
        medications: 'ميتفورمين - جليكلازيد - أنسولين',
        advice: 'تابع مستوى السكر بانتظام. التزم بالحمية والعلاج مدى الحياة.'
    },
    {
        id: 24,
        keywords: ['غدة', 'درقية', 'نشاط', 'وزن', 'عصبية', 'خفقان', 'عرق'],
        name: 'فرط نشاط الغدة الدرقية | Hyperthyroidism',
        category: 'غدد صماء',
        description: 'إفراط الغدة الدرقية في إفراز الهرمونات.',
        symptoms: 'فقدان وزن، خفقان، عصبية، تعرق، رعشة، قلق.',
        treatment: 'أدوية مثبطة، يود مشع، جراحة.',
        medications: 'كاربيمازول - بروبانولول',
        advice: 'تجنب الكافيين. التزم بالعلاج بانتظام.'
    },
    {
        id: 25,
        keywords: ['درقية', 'كسل', 'خمول', 'وزن', 'زيادة', 'برد', 'شعر'],
        name: 'قصور الغدة الدرقية | Hypothyroidism',
        category: 'غدد صماء',
        description: 'نقص إفراز الغدة الدرقية للهرمونات.',
        symptoms: 'تعب، زيادة وزن، حساسية للبرد، جفاف الجلد، تساقط شعر، إمساك.',
        treatment: 'تعويض هرموني يومي مدى الحياة.',
        medications: 'ليفوثيروكسين',
        advice: 'العلاج مدى الحياة. تابع الهرمونات بانتظام مع طبيبك.'
    },

    // ========== أمراض الجهاز العصبي ==========
    {
        id: 26,
        keywords: ['صداع', 'نصفي', 'غثيان', 'ضوء', 'صوت', 'عين', 'خفقان'],
        name: 'الصداع النصفي | Migraine',
        category: 'عصبي',
        description: 'اضطراب عصبي يسبب صداعاً نابضاً في جانب الرأس.',
        symptoms: 'صداع نابض في جهة واحدة، غثيان، حساسية للضوء والصوت، قد يسبقه هالة.',
        treatment: 'راحة في غرفة مظلمة، مسكنات، أدوية وقائية.',
        medications: 'سوماتريبتان - ايبوبروفين - بروبرانولول',
        advice: 'تجنب مسببات الصداع (الضوء الساطع، الضوضاء، بعض الأطعمة).'
    },
    {
        id: 27,
        keywords: ['صداع', 'توتر', 'ضغط', 'رقبة', 'اكتاف', 'إجهاد'],
        name: 'صداع التوتر | Tension Headache',
        category: 'عصبي',
        description: 'أكثر أنواع الصداع شيوعاً، بسبب توتر العضلات.',
        symptoms: 'ألم ضاغط خفيف إلى متوسط في الجبهة أو مؤخرة الرأس، شد في الرقبة.',
        treatment: 'مسكنات بسيطة، راحة، كمادات باردة، استرخاء.',
        medications: 'باراسيتامول - ايبوبروفين',
        advice: 'قلل التوتر والإجهاد. خذ قسطاً من الراحة.'
    },
    {
        id: 28,
        keywords: ['صرع', 'تشنجات', 'نوبات', 'غيبوبة', 'اهتزاز', 'فقدان وعي'],
        name: 'الصرع | Epilepsy',
        category: 'عصبي',
        description: 'اضطراب في النشاط الكهربائي للمخ يسبب نوبات متكررة.',
        symptoms: 'نوبات تشنج، فقدان وعي، حركات لا إرادية، ارتباك.',
        treatment: 'أدوية مضادة للصرع، تجنب مثيرات النوبات.',
        medications: 'كاربامازيبين - فالبروات - ليفيتيراسيتام',
        advice: 'تناول الأدوية بانتظام. تجنب قيادة السيارة إذا كانت النوبات غير مسيطر عليها.'
    },
    {
        id: 29,
        keywords: ['باركنسون', 'رعشة', 'يد', 'حركة', 'تيبس', 'مشي'],
        name: 'مرض باركنسون | Parkinson\'s',
        category: 'عصبي',
        description: 'مرض تنكسي عصبي يؤثر على الحركة.',
        symptoms: 'رعشة في اليدين، تيبس العضلات، بطء الحركة، مشاكل في التوازن.',
        treatment: 'أدوية تعويض الدوبامين، علاج طبيعي.',
        medications: 'ليفودوبا - براميبيكسول',
        advice: 'العلاج الطبيعي مهم جداً. استشر طبيب أعصاب بانتظام.'
    },

    // ========== أمراض المسالك البولية ==========
    {
        id: 30,
        keywords: ['بول', 'حرقة', 'تبول', 'متكرر', 'ألم', 'دم', 'حوض'],
        name: 'التهاب المسالك البولية | UTI',
        category: 'مسالك بولية',
        description: 'عدوى بكتيرية في أي جزء من الجهاز البولي.',
        symptoms: 'حرقة أثناء التبول، تبول متكرر، ألم في الحوض، بول عكر أو دموي.',
        treatment: 'مضادات حيوية، شرب ماء بكثرة، عصير توت بري.',
        medications: 'سيبروفلوكساسين - نيتروفورانتوين',
        advice: 'اشرب ماء كثيراً. نظف المنطقة جيداً. أكمل العلاج.'
    },
    {
        id: 31,
        keywords: ['حصوة', 'كلى', 'ألم', 'ظهر', 'جانب', 'بول', 'دم'],
        name: 'حصوات الكلى | Kidney Stones',
        category: 'مسالك بولية',
        description: 'رواسب صلبة تتكون في الكلى من المعادن والأملاح.',
        symptoms: 'ألم شديد في الخاصرة والظهر، غثيان، قيء، دم في البول.',
        treatment: 'شرب ماء، مسكنات، تفتيت الحصوات، جراحة إذا لزم.',
        medications: 'مسكنات قوية - تامسولوسين',
        advice: 'اشرب 3 لتر ماء يومياً. تجنب الأطعمة الغنية بالأوكسالات.'
    },
    {
        id: 32,
        keywords: ['بروستاتا', 'تبول', 'متكرر', 'ليلاً', 'ضعف', 'تقطير'],
        name: 'تضخم البروستاتا | BPH',
        category: 'مسالك بولية',
        description: 'تضخم حميد في غدة البروستاتا يحدث مع التقدم في العمر.',
        symptoms: 'تبول متكرر خاصة بالليل، ضعف تدفق البول، تقطير.',
        treatment: 'أدوية، قسطرة، جراحة في الحالات المتقدمة.',
        medications: 'تامسولوسين - فيناسترايد',
        advice: 'قلل السوائل قبل النوم. تجنب الكافيين والكحول.'
    },

    // ========== أمراض النساء ==========
    {
        id: 33,
        keywords: ['دورة', 'شهرية', 'آلام', 'بطن', 'ظهر', 'نزيف', 'غزير'],
        name: 'عسر الطمث | Dysmenorrhea',
        category: 'نساء',
        description: 'آلام شديدة تصاحب الدورة الشهرية.',
        symptoms: 'آلام في أسفل البطن والظهر، صداع، غثيان، إسهال قبل وأثناء الدورة.',
        treatment: 'مسكنات، كمادات دافئة، راحة، حبوب منع الحمل.',
        medications: 'ايبوبروفين - نابروكسين',
        advice: 'الراحة والكمادات الدافئة تفيد. استشيري طبيبتك إذا كان الألم شديداً.'
    },
    {
        id: 34,
        keywords: ['تكيس', 'مبيض', 'دورة', 'غير منتظمة', 'شعر', 'وزن', 'حبوب'],
        name: 'تكيس المبايض | PCOS',
        category: 'نساء',
        description: 'اضطراب هرموني شائع عند النساء في سن الإنجاب.',
        symptoms: 'دورة غير منتظمة، زيادة الوزن، ظهور حبوب، نمو شعر زائد.',
        treatment: 'تنظيم الهرمونات، خسارة الوزن، أدوية لتنشيط التبويض.',
        medications: 'ميتفورمين - حبوب منع الحمل',
        advice: 'خسارة 5% من الوزن تحسن الأعراض. استشيري طبيبة نساء.'
    },
    {
        id: 35,
        keywords: ['حمل', 'غثيان', 'صباح', 'قيء', 'دوار'],
        name: 'غثيان الحمل | Morning Sickness',
        category: 'نساء',
        description: 'غثيان وقيء يحدث في بداية الحمل.',
        symptoms: 'غثيان خاصة في الصباح، قيء، نفور من بعض الروائح والأطعمة.',
        treatment: 'تجنب الروائح المزعجة، وجبات صغيرة متكررة، زنجبيل.',
        medications: 'فيتامين ب6 - دوكسيلامين',
        advice: 'تجنب الأطعمة الدسمة. تناولي بسكويت مالح قبل النهوض من السرير.'
    },

    // ========== أمراض العيون ==========
    {
        id: 36,
        keywords: ['عين', 'احمرار', 'حكة', 'دماع', 'إفرازات', 'رؤية'],
        name: 'التهاب الملتحمة | Conjunctivitis',
        category: 'عيون',
        description: 'التهاب الغشاء الشفاف الذي يغطي العين.',
        symptoms: 'احمرار، حكة، إفرازات، دموع، شعور بوجود جسم غريب.',
        treatment: 'قطرات مضادة حيوية أو فيروسية، كمادات باردة.',
        medications: 'توبريكس - أوكولاك',
        advice: 'ينتقل بالعدوى. اغسل يديك جيداً. لا تلمس عينيك.'
    },
    {
        id: 37,
        keywords: ['ماء', 'أبيض', 'عتامة', 'رؤية', 'ضبابية', 'نور'],
        name: 'المياه البيضاء | Cataract',
        category: 'عيون',
        description: 'عتامة في عدسة العين تؤدي إلى ضعف النظر.',
        symptoms: 'رؤية ضبابية، حساسية للضوء، صعوبة في الرؤية الليلية، بهتان الألوان.',
        treatment: 'جراحة لاستبدال العدسة.',
        medications: 'لا يوجد دواء - الحل جراحي',
        advice: 'الجراحة آمنة وفعالة. استشر طبيب عيون عند تأثر الرؤية.'
    },
    {
        id: 38,
        keywords: ['زرق', 'جلوكوما', 'ضغط', 'عين', 'رؤية', 'ألم'],
        name: 'المياه الزرقاء | Glaucoma',
        category: 'عيون',
        description: 'ارتفاع ضغط العين الذي قد يؤدي لتلف العصب البصري.',
        symptoms: 'قد لا تظهر أعراض مبكرة، ثم فقدان مجال الرؤية الجانبي، ألم.',
        treatment: 'قطرات خافضة للضغط، ليزر، جراحة.',
        medications: 'تيمولول - لاتانوبروست',
        advice: 'الفحص الدوري ضروري بعد سن الأربعين. التزم بالعلاج مدى الحياة.'
    },

    // ========== أمراض نفسية ==========
    {
        id: 39,
        keywords: ['اكتئاب', 'حزن', 'تعب', 'نوم', 'شهية', 'يأس', 'انطواء'],
        name: 'الاكتئاب | Depression',
        category: 'نفسي',
        description: 'اضطراب مزاجي يسبب شعوراً دائماً بالحزن وفقدان الاهتمام.',
        symptoms: 'حزن مستمر، فقدان المتعة، اضطراب النوم والشهية، تعب، أفكار انتحارية.',
        treatment: 'علاج نفسي، مضادات اكتئاب، دعم اجتماعي.',
        medications: 'فلوكسيتين - سيرترالين - إسيتالوبرام',
        advice: '⚠️ اطلب المساعدة النفسية. لست وحدك. إذا كانت لديك أفكار انتحارية، اتصل بالطوارئ فوراً.'
    },
    {
        id: 40,
        keywords: ['قلق', 'توتر', 'خوف', 'عصبية', 'أرق', 'خفقان', 'رعشة'],
        name: 'اضطراب القلق | Anxiety Disorder',
        category: 'نفسي',
        description: 'قلق مفرط ومستمر يؤثر على الحياة اليومية.',
        symptoms: 'قلق دائم، أرق، صعوبة تركيز، توتر عضلي، خفقان، تعرق.',
        treatment: 'علاج سلوكي معرفي، أدوية مضادة للقلق، استرخاء.',
        medications: 'سيرترالين - باروكستين - ألبرازولام',
        advice: 'تمارين التنفس والاسترخاء مفيدة جداً. تجنب الكافيين.'
    },

    // ========== أمراض الروماتيزم والمفاصل ==========
    {
        id: 41,
        keywords: ['مفاصل', 'ألم', 'تورم', 'تيبس', 'ركبة', 'يد', 'حركة'],
        name: 'التهاب المفاصل | Arthritis',
        category: 'روماتيزم',
        description: 'التهاب في المفاصل يسبب ألماً وتيبساً.',
        symptoms: 'ألم وتورم في المفاصل، تيبس صباحي، صعوبة في الحركة.',
        treatment: 'مسكنات، مضادات التهاب، علاج طبيعي.',
        medications: 'ديكلوفيناك - ايبوبروفين - كورتيزون',
        advice: 'العلاج الطبيعي مهم. حافظ على وزن صحي لتخفيف الضغط على المفاصل.'
    },
    {
        id: 42,
        keywords: ['روماتويد', 'مفاصل', 'تورم', 'متماثل', 'يد', 'قدم', 'تيبس'],
        name: 'الروماتويد | Rheumatoid Arthritis',
        category: 'روماتيزم',
        description: 'مرض مناعي ذاتي يسبب التهاباً مزمناً في المفاصل.',
        symptoms: 'ألم وتورم في المفاصل الصغيرة (اليدين والقدمين)، تيبس صباحي لأكثر من ساعة.',
        treatment: 'أدوية مثبطة للمناعة، مضادات روماتيزم، علاج طبيعي.',
        medications: 'ميثوتريكسات - هيدروكسي كلوروكوين - أداليموماب',
        advice: 'مرض مزمن يحتاج متابعة مع طبيب روماتيزم. العلاج المبكر يمنع التشوهات.'
    },
    {
        id: 43,
        keywords: ['نقرس', 'مفصل', 'قدم', 'كبير', 'ألم', 'احمرار', 'حامض'],
        name: 'النقرس | Gout',
        category: 'روماتيزم',
        description: 'تراكم حمض البوليك في الدم وتكون بلورات في المفاصل.',
        symptoms: 'ألم شديد مفاجئ في إصبع القدم الكبير، احمرار، تورم، سخونة.',
        treatment: 'مضادات التهاب، أدوية خافضة لحمض البوليك، حمية.',
        medications: 'كولشيسين - الوبيورينول',
        advice: 'تجنب اللحوم الحمراء والمأكولات البحرية والكحول. اشرب ماء كثيراً.'
    },
    {
        id: 44,
        keywords: ['ذئبة', 'حمامية', 'طفح', 'وجه', 'مفاصل', 'تعب', 'كلى'],
        name: 'الذئبة الحمراء | Lupus',
        category: 'روماتيزم',
        description: 'مرض مناعي ذاتي يصيب أعضاء متعددة.',
        symptoms: 'طفح على شكل فراشة على الوجه، ألم مفاصل، تعب شديد، حمى.',
        treatment: 'كورتيزون، مثبطات مناعة، مضادات التهاب.',
        medications: 'بريدنيزولون - هيدروكسي كلوروكوين',
        advice: 'مرض مزمن يحتاج متابعة دقيقة. تجنب التعرض للشمس.'
    }
];

// =============================================
// ترجمة الكلمات باستخدام MyMemory API
// =============================================
const translateWords = async (words) => {
    try {
        const translatedWords = [];
        
        for (const word of words) {
            try {
                const response = await axios.get(APIS.translate, {
                    params: {
                        q: word,
                        langpair: 'ar|en'
                    },
                    timeout: 5000
                });
                
                if (response.data && response.data.responseData && response.data.responseData.translatedText) {
                    let translated = response.data.responseData.translatedText;
                    translatedWords.push(translated.toLowerCase());
                    console.log(`✅ ترجمة "${word}" -> "${translated}"`);
                } else {
                    translatedWords.push(word);
                    console.log(`⚠️ فشل ترجمة "${word}"، استخدمت كما هي`);
                }
            } catch (error) {
                console.log(`⚠️ خطأ في ترجمة "${word}":`, error.message);
                translatedWords.push(word);
            }
            
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        console.log('📝 الكلمات المترجمة:', translatedWords);
        return translatedWords.filter(w => w && w.length > 1);
        
    } catch (error) {
        console.log('⚠️ خطأ في الترجمة:', error.message);
        return words;
    }
};

// =============================================
// البحث في FDA
// =============================================
const searchFDA = async (keywords) => {
    try {
        if (!keywords || keywords.length === 0) return null;
        
        const cleanKeywords = keywords.map(k => k.replace(/[^\w\s]/gi, '')).filter(k => k.length > 1);
        
        if (cleanKeywords.length === 0) return null;
        
        const searchTerm = cleanKeywords.join('+');
        console.log('🔍 مصطلح بحث FDA:', searchTerm);
        
        const response = await axios.get(APIS.openFDA.url, {
            params: {
                search: `patient.reaction.reactionmeddrapt:${searchTerm}`,
                limit: 5,
                api_key: APIS.openFDA.key
            },
            timeout: 10000
        });

        if (response.data?.results?.length > 0) {
            console.log('✅ نتائج FDA:', response.data.results.length);
            return processFDAResults(response.data.results);
        } else {
            console.log('❌ لا توجد نتائج من FDA');
            return null;
        }

    } catch (error) {
        console.log('⚠️ خطأ في FDA:', error.message);
        return null;
    }
};

// =============================================
// معالجة نتائج FDA
// =============================================
const processFDAResults = (results) => {
    const drugMap = new Map();
    
    results.forEach(item => {
        const drug = item.patient?.drug?.[0]?.medicinalproduct;
        if (!drug) return;
        
        const reactions = item.patient?.reaction?.map(r => r.reactionmeddrapt).filter(Boolean) || [];
        
        if (!drugMap.has(drug)) {
            drugMap.set(drug, {
                reactions: new Set(),
                count: 0
            });
        }
        
        const entry = drugMap.get(drug);
        reactions.forEach(r => entry.reactions.add(r));
        entry.count++;
    });

    return Array.from(drugMap.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 4)
        .map(([drug, data]) => ({
            name: drug,
            probability: Math.min(60 + (data.count * 3), 85),
            description: `دواء ${drug} قد يسبب الأعراض المدخلة (${data.count} تقرير)`,
            symptoms: Array.from(data.reactions).slice(0, 5).join('، '),
            treatment: 'يعتمد على شدة الأعراض وتقييم الطبيب',
            medications: drug,
            advice: `⚠️ استشر طبيبك قبل إيقاف ${drug}`,
            source: 'FDA'
        }));
};

// =============================================
// البحث المحلي المتقدم
// =============================================
const searchLocalDB = (symptomWords) => {
    const results = [];
    
    LOCAL_DISEASES.forEach(disease => {
        let exactMatches = 0;
        let partialMatches = 0;
        const matchedKeywords = [];
        
        symptomWords.forEach(symptom => {
            disease.keywords.forEach(keyword => {
                // تطابق تام (الكلمة نفسها)
                if (symptom === keyword) {
                    exactMatches++;
                    matchedKeywords.push(keyword);
                }
                // تطابق جزئي (الكلمة تحتوي على الأخرى)
                else if (symptom.includes(keyword) || keyword.includes(symptom)) {
                    partialMatches++;
                    matchedKeywords.push(keyword);
                }
            });
        });
        
        const uniqueMatches = [...new Set(matchedKeywords)];
        const totalMatches = uniqueMatches.length;
        
        if (totalMatches > 0) {
            // نظام الحسبة المتطور
            // التطابق التام له وزن أكبر من التطابق الجزئي
            let score = (exactMatches * 1.5) + (partialMatches * 0.5);
            
            // نسبة الثقة بناءً على:
            // - عدد التطابقات
            // - وزن التطابقات
            // - نسبة التغطية (عدد الأعراض المدخلة)
            const coverage = totalMatches / symptomWords.length;
            const baseConfidence = 40;
            const matchBonus = Math.min(totalMatches * 12, 40);
            const coverageBonus = coverage * 15;
            
            let probability = Math.min(
                baseConfidence + matchBonus + coverageBonus,
                98
            );
            
            // تقريب النسبة لأقرب رقم صحيح
            probability = Math.round(probability);
            
            results.push({
                id: disease.id,
                name: disease.name,
                category: disease.category,
                probability: probability,
                description: disease.description,
                symptoms: disease.symptoms,
                treatment: disease.treatment,
                medications: disease.medications,
                advice: disease.advice,
                matchCount: totalMatches,
                exactMatches: exactMatches,
                partialMatches: partialMatches,
                matchedKeywords: uniqueMatches,
                coverage: coverage,
                score: score,
                source: 'local'
            });
        }
    });
    
    // ترتيب متقدم:
    // 1. حسب عدد التطابقات التامة
    // 2. حسب النتيجة (score)
    // 3. حسب عدد التطابقات الكلي
    return results.sort((a, b) => {
        if (a.exactMatches !== b.exactMatches) {
            return b.exactMatches - a.exactMatches;
        }
        if (a.score !== b.score) {
            return b.score - a.score;
        }
        return b.matchCount - a.matchCount;
    });
};

// =============================================
// تحليل الأعراض (الوظيفة الرئيسية)
// =============================================
const analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;
        
        if (!symptoms) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال الأعراض أولاً'
            });
        }

        const symptomWords = symptoms.split(/[\s،,]+/).filter(w => w && w.length > 1);
        
        if (symptomWords.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال أعراض صحيحة'
            });
        }

        console.log('🔍 تحليل الأعراض:', symptomWords);
        
        // البحث في القاعدة المحلية
        const localResults = searchLocalDB(symptomWords);
        
        let results = [];
        let source = 'local';

        if (localResults.length > 0) {
            const bestMatch = localResults[0];
            console.log(`✅ أفضل تطابق محلي: ${bestMatch.name}`);
            console.log(`📊 عدد التطابقات: ${bestMatch.matchCount}`);
            console.log(`📈 نسبة الثقة: ${bestMatch.probability}%`);
            
            // إذا كان عدد التطابقات 2 أو أكثر، نكتفي بالنتائج المحلية
            if (bestMatch.matchCount >= 2) {
                console.log('✅ تطابق كافٍ (2+) - نكتفي بالنتائج المحلية');
                results = localResults.slice(0, 5);
            } 
            // إذا كان عدد التطابقات 1، نحتاج للبحث في FDA
            else {
                console.log('⚠️ تطابق ضعيف (1) - نحتاج للبحث في FDA');
                
                // ترجمة الكلمات والبحث في FDA
                const englishWords = await translateWords(symptomWords);
                const fdaResults = await searchFDA(englishWords);
                
                if (fdaResults && fdaResults.length > 0) {
                    // دمج النتائج (محلية + FDA)
                    results = [...localResults.slice(0, 2), ...fdaResults];
                    source = 'mixed';
                    console.log('✅ تم دمج نتائج محلية + FDA');
                } else {
                    // إذا لم يجد FDA، نعرض النتائج المحلية على الأقل
                    results = localResults.slice(0, 5);
                }
            }
        } else {
            // لا توجد نتائج محلية - نبحث في FDA
            console.log('🔍 لا توجد نتائج محلية - البحث في FDA');
            const englishWords = await translateWords(symptomWords);
            const fdaResults = await searchFDA(englishWords);
            
            if (fdaResults && fdaResults.length > 0) {
                results = fdaResults;
                source = 'fda';
            } else {
                // إذا لم يجد شيء، نعرض رسالة مفيدة
                results = [{
                    name: 'لا يوجد تشخيص محدد',
                    probability: 0,
                    description: 'لم نتمكن من تحديد تشخيص دقيق لهذه الأعراض.',
                    symptoms: symptoms,
                    treatment: 'يرجى استشارة الطبيب المختص',
                    medications: 'لا يوجد دواء مقترح',
                    advice: 'هذه الأعراض تحتاج لتقييم طبي مباشر',
                    source: 'info'
                }];
            }
        }

        res.json({
            success: true,
            results: results.slice(0, 5), // أقصى 5 نتائج
            source: source,
            totalSymptoms: symptomWords.length,
            message: results.length > 0 ? 
                `✅ تم العثور على ${results.length} نتائج` : 
                '❌ لم يتم العثور على نتائج'
        });

    } catch (error) {
        console.error('❌ خطأ في تحليل الأعراض:', error);
        res.status(500).json({
            success: true,
            results: [{
                name: 'خطأ في التحليل',
                probability: 0,
                description: 'حدث خطأ أثناء تحليل الأعراض.',
                symptoms: '',
                treatment: 'يرجى المحاولة مرة أخرى',
                medications: '',
                advice: 'إذا استمرت المشكلة، استشر طبيبك مباشرة',
                source: 'error'
            }],
            message: 'تم التحليل مع بعض الأخطاء'
        });
    }
};

module.exports = {
    analyzeSymptoms
};