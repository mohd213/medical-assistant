import axios from 'axios';

// ===== إعدادات APIs =====
const APIS = {
    translate: 'https://api.mymemory.translated.net/get',
    openFDA: {
        url: 'https://api.fda.gov/drug/event.json',
        key: '5qpdeD3i6hvw84SfjQhHdYQZEpq7RUQarzrVmk10'
    }
};

// =============================================
// قاعدة البيانات المحلية - 44 مرض
// =============================================
const LOCAL_DISEASES = [
    // ========== أمراض الجهاز التنفسي (5) ==========
    {
        id: 1,
        keywords: ['صداع', 'حمى', 'سعال', 'زكام', 'رشح', 'عطس'],
        name: 'نزلة برد | Common Cold',
        category: 'جهاز تنفسي',
        symptoms: 'صداع، حمى خفيفة، سعال، عطس، احتقان بالأنف',
        treatment: 'راحة تامة في المنزل، سوائل دافئة، خافضات حرارة',
        medications: 'باراسيتامول - ايبوبروفين - مضادات احتقان',
        advice: 'اشرب سوائل كثيرة. استشر طبيبك إذا استمرت الحمى لأكثر من 3 أيام'
    },
    {
        id: 2,
        keywords: ['انفلونزا', 'حمى', 'كحة', 'ألم عضلات', 'إرهاق', 'برد'],
        name: 'الانفلونزا | Influenza',
        category: 'جهاز تنفسي',
        symptoms: 'حمى شديدة، صداع، آلام عضلية، كحة جافة، إرهاق شديد',
        treatment: 'راحة تامة، سوائل، أدوية خافضة للحرارة، مضادات فيروسات',
        medications: 'اوسيلتاميفير - باراسيتامول - ايبوبروفين',
        advice: 'الراحة ضرورية لتجنب المضاعفات. استشر طبيبك'
    },
    {
        id: 3,
        keywords: ['كحة', 'بلغم', 'صعوبة تنفس', 'حرارة', 'ألم صدر'],
        name: 'التهاب الشعب الهوائية | Bronchitis',
        category: 'جهاز تنفسي',
        symptoms: 'كحة مستمرة مع بلغم، إرهاق، ضيق تنفس، حرارة خفيفة',
        treatment: 'موسعات شعب، راحة، سوائل، مضادات حيوية إذا كانت بكتيرية',
        medications: 'موسعات شعب - مضادات حيوية - مسكنات',
        advice: 'تجنب التدخين والمهيجات. استشر طبيبك'
    },
    {
        id: 4,
        keywords: ['التهاب رئوي', 'حرارة', 'قشعريرة', 'بلغم', 'ضيق تنفس'],
        name: 'التهاب رئوي | Pneumonia',
        category: 'جهاز تنفسي',
        symptoms: 'حمى شديدة، قشعريرة، كحة مع بلغم أصفر، ألم صدر، ضيق تنفس',
        treatment: 'مضادات حيوية، راحة، أكسجين في الحالات الشديدة',
        medications: 'مضادات حيوية قوية - مسكنات - خافضات حرارة',
        advice: 'حالة خطيرة محتملة - استشر طبيبك فوراً'
    },
    {
        id: 5,
        keywords: ['حساسية', 'عطس', 'رشح', 'حكة عيون', 'دموع', 'احتقان'],
        name: 'حساسية | Allergy',
        category: 'جهاز تنفسي',
        symptoms: 'عطس، رشح، حكة في العيون والأنف، دموع',
        treatment: 'مضادات هيستامين، تجنب مثيرات الحساسية',
        medications: 'مضادات هيستامين - بخاخات أنف',
        advice: 'حدد مسببات الحساسية وتجنبها. استشر طبيب حساسية'
    },
    
    // ========== أمراض الجهاز الهضمي (5) ==========
    {
        id: 6,
        keywords: ['غثيان', 'قيء', 'إسهال', 'ألم بطن', 'مغص', 'ترجيع'],
        name: 'التهاب معدة وأمعاء | Gastroenteritis',
        category: 'جهاز هضمي',
        symptoms: 'غثيان، قيء، إسهال، ألم بطن، مغص، حمى محتملة',
        treatment: 'محلول جفاف، راحة، مضادات قيء',
        medications: 'محلول جفاف - مضادات قيء - مضادات إسهال',
        advice: 'اشرب سوائل كثيرة. تجنب الأطعمة الدسمة'
    },
    {
        id: 7,
        keywords: ['حرقة', 'حموضة', 'ارتجاع', 'أعلى بطن', 'تجشؤ'],
        name: 'ارتجاع مريئي | GERD',
        category: 'جهاز هضمي',
        symptoms: 'حرقة خلف القص، حموضة، ارتجاع، ألم أعلى البطن',
        treatment: 'مضادات حموضة، مثبطات مضخة البروتون، تغذية صحية',
        medications: 'اوميبرازول - رانيتيدين - مضادات حموضة',
        advice: 'تجنب الأكل قبل النوم. ارفع رأس السرير'
    },
    {
        id: 8,
        keywords: ['إمساك', 'انتفاخ', 'غازات', 'ألم بطن', 'قولون'],
        name: 'متلازمة القولون العصبي | IBS',
        category: 'جهاز هضمي',
        symptoms: 'إمساك أو إسهال، انتفاخ، غازات، ألم بطن',
        treatment: 'تغيير نمط الحياة، مضادات تشنج، ألياف غذائية',
        medications: 'مضادات تشنج - ملينات - بروبيوتيك',
        advice: 'تجنب التوتر. سجل الأطعمة المهيجة'
    },
    {
        id: 9,
        keywords: ['قرحة', 'ألم معدة', 'حرقة', 'غثيان', 'دم'],
        name: 'قرحة المعدة | Peptic Ulcer',
        category: 'جهاز هضمي',
        symptoms: 'ألم في أعلى البطن، حرقة، غثيان، دم في البراز أحياناً',
        treatment: 'مضادات حموضة، مضادات حيوية، مثبطات مضخة البروتون',
        medications: 'اوميبرازول - أموكسيسيلين - كلاريثرومايسين',
        advice: 'تجنب المسكنات. استشر طبيب جهاز هضمي'
    },
    {
        id: 10,
        keywords: ['حصوة', 'مرارة', 'أيمن بطن', 'دهون', 'غثيان'],
        name: 'حصوات المرارة | Gallstones',
        category: 'جهاز هضمي',
        symptoms: 'ألم في أعلى البطن، غثيان، ألم بعد الأكل الدسم',
        treatment: 'استئصال المرارة، أدوية تذويب الحصوات',
        medications: 'مسكنات - أدوية تذويب الحصوات',
        advice: 'قلل الدهون في الطعام. استشر جراحاً'
    },
    
    // ========== أمراض جلدية (5) ==========
    {
        id: 11,
        keywords: ['حكة', 'طفح', 'احمرار', 'جفاف', 'تشقق'],
        name: 'إكزيما | Eczema',
        category: 'جلدية',
        symptoms: 'حكة شديدة، احمرار، جفاف، تشقق الجلد',
        treatment: 'مرطبات، كورتيزون موضعي، مضادات هيستامين',
        medications: 'كريمات مرطبة - كورتيزون موضعي',
        advice: 'تجنب الصابون القاسي. رطب بشرتك دائماً'
    },
    {
        id: 12,
        keywords: ['صدفية', 'قشور', 'حرشف', 'حكة', 'مفاصل'],
        name: 'صدفية | Psoriasis',
        category: 'جلدية',
        symptoms: 'بقع حمراء مغطاة بقشور فضية، حكة، آلام مفاصل',
        treatment: 'كريمات موضعية، علاج ضوئي، أدوية مثبطة للمناعة',
        medications: 'كورتيزون موضعي - فيتامين د موضعي',
        advice: 'تجنب التوتر. استشر طبيب جلدية'
    },
    {
        id: 13,
        keywords: ['حب شباب', 'بثور', 'رؤوس سوداء', 'دهون'],
        name: 'حب الشباب | Acne',
        category: 'جلدية',
        symptoms: 'بثور حمراء، رؤوس سوداء، حبوب، دهون زائدة',
        treatment: 'غسولات موضعية، مضادات حيوية، ريتينويدات',
        medications: 'بنزويل بيروكسايد - ريتينويدات - مضادات حيوية',
        advice: 'نظف بشرتك يومياً. لا تعصر الحبوب'
    },
    {
        id: 14,
        keywords: ['فطريات', 'قدم', 'حكة', 'تشقق', 'تبين'],
        name: 'قدم الرياضي | Athlete\'s Foot',
        category: 'جلدية',
        symptoms: 'حكة، تشقق، تقشر بين الأصابع، رائحة كريهة',
        treatment: 'كريمات مضادة للفطريات، محاليل موضعية',
        medications: 'مضادات فطريات موضعية - مسحوق مضاد للفطريات',
        advice: 'جفف قدميك جيداً. غير جواربك يومياً'
    },
    {
        id: 15,
        keywords: ['هربس', 'تقرحات', 'فيروس', 'بثور', 'حرقان'],
        name: 'هربس | Herpes',
        category: 'جلدية',
        symptoms: 'تقرحات مؤلمة، بثور صغيرة، حكة، حرقان',
        treatment: 'مضادات فيروسات، كريمات مخدرة',
        medications: 'اسيكلوفير - مراهم مخدرة',
        advice: 'تجنب لمس التقرحات. استشر طبيباً'
    },
    
    // ========== أمراض باطنية (5) ==========
    {
        id: 16,
        keywords: ['سكري', 'عطش', 'تبول', 'جوع', 'تعب'],
        name: 'داء السكري | Diabetes',
        category: 'باطني',
        symptoms: 'عطش شديد، كثرة التبول، جوع شديد، تعب، فقدان وزن',
        treatment: 'حمية غذائية، رياضة، أدوية خافضة للسكر، أنسولين',
        medications: 'ميتفورمين - أنسولين - سلفونيل يوريا',
        advice: 'راقب سكرك بانتظام. اتبع حمية صحية'
    },
    {
        id: 17,
        keywords: ['ضغط', 'صداع', 'دوخة', 'تعب'],
        name: 'ارتفاع ضغط الدم | Hypertension',
        category: 'باطني',
        symptoms: 'قد لا تظهر أعراض، صداع، دوخة، تعب',
        treatment: 'حمية قليلة الملح، رياضة، أدوية خافضة للضغط',
        medications: 'مدرات بول - حاصرات بيتا - مثبطات ACE',
        advice: 'راقب ضغطك بانتظام. قلل الملح'
    },
    {
        id: 18,
        keywords: ['فقر دم', 'تعب', 'شحوب', 'دوخة', 'خفقان'],
        name: 'فقر الدم | Anemia',
        category: 'باطني',
        symptoms: 'تعب، شحوب، دوخة، خفقان، ضيق تنفس',
        treatment: 'مكملات حديد، فيتامين ب12، تغذية متوازنة',
        medications: 'حديد - فيتامين ب12 - حمض فوليك',
        advice: 'تناول أطعمة غنية بالحديد. استشر طبيباً'
    },
    {
        id: 19,
        keywords: ['غدة درقية', 'تعب', 'وزن', 'برودة', 'جفاف'],
        name: 'قصور الغدة الدرقية | Hypothyroidism',
        category: 'باطني',
        symptoms: 'تعب، زيادة وزن، حساسية للبرودة، جفاف الجلد',
        treatment: 'هرمونات تعويضية يومياً',
        medications: 'ليفوثيروكسين',
        advice: 'تناول الدواء يومياً. تابع مع طبيبك بانتظام'
    },
    {
        id: 20,
        keywords: ['غدة درقية', 'عصبية', 'تعرق', 'رجفان', 'نحافة'],
        name: 'فرط الغدة الدرقية | Hyperthyroidism',
        category: 'باطني',
        symptoms: 'عصبية، تعرق، رجفان، خفقان، نقص وزن',
        treatment: 'أدوية مثبطة، يود مشع، جراحة',
        medications: 'ميثيمازول - بروبيل ثيويوراسيل',
        advice: 'تجنب الكافيين. استشر طبيب مختص'
    },
    
    // ========== أمراض قلبية (5) ==========
    {
        id: 21,
        keywords: ['ذبحة', 'ألم صدر', 'خفقان', 'ضيق نفس', 'تعرق'],
        name: 'ذبحة صدرية | Angina',
        category: 'قلب',
        symptoms: 'ألم ضاغط بالصدر، خفقان، ضيق نفس، تعرق',
        treatment: 'نيتروغليسرين، أدوية مسيلة للدم، قسطرة',
        medications: 'نيتروغليسرين - أسبرين - حاصرات بيتا',
        advice: 'حالة طارئة - اذهب للمستشفى فوراً'
    },
    {
        id: 22,
        keywords: ['جلطة', 'ألم صدر', 'غثيان', 'تعرق', 'دوخة'],
        name: 'احتشاء عضلة القلب | Heart Attack',
        category: 'قلب',
        symptoms: 'ألم صدري شديد، غثيان، تعرق، دوخة، ضيق نفس',
        treatment: 'قسطرة عاجلة، مسيلات دم، أدوية',
        medications: 'أسبرين - كلوبيدوجريل - ستاتينات',
        advice: 'حالة طارئة تهدد الحياة - اتصل بالإسعاف فوراً'
    },
    {
        id: 23,
        keywords: ['فشل قلب', 'ضيق نفس', 'وذمة', 'تعب', 'سعال'],
        name: 'فشل القلب | Heart Failure',
        category: 'قلب',
        symptoms: 'ضيق نفس، وذمة في القدمين، تعب، سعال',
        treatment: 'مدرات بول، أدوية مقوية للقلب، أكسجين',
        medications: 'مدرات بول - ديجوكسين - مثبطات ACE',
        advice: 'قلل الملح. تابع مع طبيب قلب'
    },
    {
        id: 24,
        keywords: ['عدم انتظام', 'خفقان', 'دوار', 'إغماء'],
        name: 'اضطراب نظم القلب | Arrhythmia',
        category: 'قلب',
        symptoms: 'خفقان، دوار، إغماء، تعب',
        treatment: 'أدوية مضادة لاضطراب النظم، جهاز تنظيم ضربات',
        medications: 'حاصرات بيتا - مضادات اضطراب النظم',
        advice: 'استشر طبيب قلب. تجنب المنبهات'
    },
    {
        id: 25,
        keywords: ['تهاب شغاف', 'حمى', 'تعب', 'لغط قلب'],
        name: 'التهاب شغاف القلب | Endocarditis',
        category: 'قلب',
        symptoms: 'حمى، تعب، تعرق ليلي، لغط قلب',
        treatment: 'مضادات حيوية عن طريق الوريد، جراحة',
        medications: 'مضادات حيوية قوية',
        advice: 'حالة خطيرة - استشفاء فوري'
    },
    
    // ========== أمراض عصبية (5) ==========
    {
        id: 26,
        keywords: ['صداع نصفي', 'نصف رأس', 'غثيان', 'ضوء'],
        name: 'الشقيقة | Migraine',
        category: 'عصبي',
        symptoms: 'صداع نابض في نصف الرأس، غثيان، حساسية للضوء',
        treatment: 'مسكنات، أدوية خاصة، راحة في غرفة مظلمة',
        medications: 'تريبتانات - مسكنات',
        advice: 'تجنب مثيرات الصداع. نم كفاية'
    },
    {
        id: 27,
        keywords: ['صداع توتر', 'ضغط', 'رقبة', 'كتف', 'إجهاد'],
        name: 'صداع التوتر | Tension Headache',
        category: 'عصبي',
        symptoms: 'ضغط حول الرأس، ألم في الرقبة والكتفين',
        treatment: 'مسكنات، استرخاء، مساج',
        medications: 'باراسيتامول - ايبوبروفين',
        advice: 'قلل التوتر. مارس تمارين الاسترخاء'
    },
    {
        id: 28,
        keywords: ['صرع', 'تشنجات', 'اختلاج', 'إغماء'],
        name: 'الصرع | Epilepsy',
        category: 'عصبي',
        symptoms: 'تشنجات، اختلاج، فقدان وعي، حركات لا إرادية',
        treatment: 'أدوية مضادة للصرع، جراحة في بعض الحالات',
        medications: 'مضادات اختلاج - بنزوديازيبينات',
        advice: 'تناول الدواء بانتظام. تجنب قيادة السيارة'
    },
    {
        id: 29,
        keywords: ['باركنسون', 'رعاش', 'تيبس', 'بطء حركة'],
        name: 'مرض باركنسون | Parkinson\'s',
        category: 'عصبي',
        symptoms: 'رعاش، تيبس عضلي، بطء حركة، فقدان توازن',
        treatment: 'أدوية دوبامينية، علاج طبيعي',
        medications: 'ليفودوبا - منبهات الدوبامين',
        advice: 'استشر طبيب أعصاب. مارس العلاج الطبيعي'
    },
    {
        id: 30,
        keywords: ['زهايمر', 'نسيان', 'ذاكرة', 'ارتباك'],
        name: 'الزهايمر | Alzheimer\'s',
        category: 'عصبي',
        symptoms: 'فقدان ذاكرة، ارتباك، تغيرات سلوكية',
        treatment: 'أدوية تحسن الأعراض، رعاية داعمة',
        medications: 'مثبطات كولينستيراز - ميمانتين',
        advice: 'دعم المريض نفسياً. رعاية مستمرة'
    },
    
    // ========== أمراض الكلى (5) ==========
    {
        id: 31,
        keywords: ['حصوة كلية', 'ألم خاصرة', 'دم بول', 'حرقان'],
        name: 'حصوات الكلى | Kidney Stones',
        category: 'كلى',
        symptoms: 'ألم حاد في الخاصرة، دم في البول، حرقان',
        treatment: 'مسكنات، شرب ماء بكثرة، تفتيت الحصوات',
        medications: 'مسكنات قوية - أدوية لتفتيت الحصوات',
        advice: 'اشرب 3 لتر ماء يومياً. استشر طبيب مسالك'
    },
    {
        id: 32,
        keywords: ['فشل كلوي', 'تعب', 'وذمة', 'قلة بول', 'غثيان'],
        name: 'الفشل الكلوي | Kidney Failure',
        category: 'كلى',
        symptoms: 'تعب، وذمة، قلة البول، غثيان، حكة',
        treatment: 'غسيل كلوي، زراعة كلية، أدوية',
        medications: 'مدرات بول - مكملات - منظمات ضغط',
        advice: 'اتبع حمية مناسبة. التزم بمواعيد الغسيل'
    },
    {
        id: 33,
        keywords: ['تهاب كلية', 'حمى', 'ألم جنب', 'حرقان بول'],
        name: 'التهاب الحويضة والكلية | Pyelonephritis',
        category: 'كلى',
        symptoms: 'حمى، ألم في الخاصرة، حرقان بول، غثيان',
        treatment: 'مضادات حيوية، مسكنات، سوائل',
        medications: 'مضادات حيوية - مسكنات',
        advice: 'أكمل جرعة المضاد الحيوي. اشرب سوائل'
    },
    {
        id: 34,
        keywords: ['زلال', 'رغوة بول', 'وذمة', 'تعب'],
        name: 'المتلازمة الكلوية | Nephrotic Syndrome',
        category: 'كلى',
        symptoms: 'رغوة في البول، وذمة، تعب',
        treatment: 'كورتيزون، مدرات بول، مثبطات مناعة',
        medications: 'كورتيزون - مدرات بول',
        advice: 'تتبع وزنك يومياً. استشر طبيب كلى'
    },
    {
        id: 35,
        keywords: ['تكيس كلية', 'ألم بطن', 'دم بول', 'ضغط مرتفع'],
        name: 'مرض الكلى المتعدد الكيسات | Polycystic Kidney',
        category: 'كلى',
        symptoms: 'ألم بطن، دم في البول، ضغط مرتفع',
        treatment: 'علاج الأعراض، تحكم بالضغط، غسيل كلوي',
        medications: 'مسكنات - أدوية ضغط',
        advice: 'فحص دوري. تجنب الرياضات العنيفة'
    },
    
    // ========== أمراض نسائية (5) ==========
    {
        id: 36,
        keywords: ['دورة شهرية', 'ألم', 'انتفاخ', 'صداع'],
        name: 'عسر الطمث | Dysmenorrhea',
        category: 'نسائي',
        symptoms: 'ألم أسفل بطن، صداع، انتفاخ، غثيان',
        treatment: 'مسكنات، كمادات دافئة، راحة',
        medications: 'مسكنات - مضادات تشنج',
        advice: 'كمادات دافئة على البطن. استشيري طبيبة'
    },
    {
        id: 37,
        keywords: ['تكيس مبايض', 'اضطراب دورة', 'وزن', 'شعر زائد'],
        name: 'تكيس المبايض | PCOS',
        category: 'نسائي',
        symptoms: 'اضطراب دورة، زيادة وزن، شعر زائد، حبوب',
        treatment: 'منظمات هرمونية، حمية، أدوية سكر',
        medications: 'منظمات هرمونية - ميتفورمين',
        advice: 'اتبعي حمية صحية. مارسي الرياضة'
    },
    {
        id: 38,
        keywords: ['تهاب مهبلي', 'حكة', 'إفرازات', 'حرقان'],
        name: 'التهاب مهبلي | Vaginitis',
        category: 'نسائي',
        symptoms: 'حكة، إفرازات غير طبيعية، حرقان',
        treatment: 'كريمات موضعية، مضادات فطريات',
        medications: 'مضادات فطريات - مضادات حيوية',
        advice: 'نظافة شخصية. استشيري طبيبة'
    },
    {
        id: 39,
        keywords: ['أورام ليفية', 'نزيف', 'ألم', 'ضغط'],
        name: 'الأورام الليفية | Fibroids',
        category: 'نسائي',
        symptoms: 'نزيف غزير، ألم، ضغط على المثانة',
        treatment: 'أدوية، جراحة حسب الحالة',
        medications: 'مسكنات - مضادات نزيف',
        advice: 'متابعة دورية مع طبيبة'
    },
    {
        id: 40,
        keywords: ['سن يأس', 'هبات حارة', 'تعرق', 'جفاف'],
        name: 'أعراض سن اليأس | Menopause',
        category: 'نسائي',
        symptoms: 'هبات حارة، تعرق ليلي، جفاف مهبلي',
        treatment: 'علاج هرموني بديل، أدوية',
        medications: 'هرمونات بديلة - مكملات كالسيوم',
        advice: 'تغذية صحية. استشيري طبيبة'
    },
    
    // ========== أمراض العظام والمفاصل (4) ==========
    {
        id: 41,
        keywords: ['خشونة', 'ألم مفاصل', 'تيبس', 'ركبة'],
        name: 'خشونة المفاصل | Osteoarthritis',
        category: 'عظام',
        symptoms: 'ألم مفاصل، تيبس، تورم، صعوبة حركة',
        treatment: 'مسكنات، علاج طبيعي، جراحة',
        medications: 'مسكنات - مرخيات عضلات',
        advice: 'أنقص وزنك. مارس رياضة خفيفة'
    },
    {
        id: 42,
        keywords: ['روماتويد', 'تورم', 'تيبس صباحي', 'مفاصل'],
        name: 'التهاب المفاصل الروماتويدي | Rheumatoid Arthritis',
        category: 'عظام',
        symptoms: 'ألم مفاصل، تورم، تيبس صباحي، تعب',
        treatment: 'أدوية مثبطة للمناعة، كورتيزون',
        medications: 'مثبطات مناعة - كورتيزون - مسكنات',
        advice: 'علاج طبيعي. استشارة روماتيزم'
    },
    {
        id: 43,
        keywords: ['هشاشة', 'كسور', 'ألم عظام', 'قصر قامة'],
        name: 'هشاشة العظام | Osteoporosis',
        category: 'عظام',
        symptoms: 'كسور متكررة، ألم عظام، قصر قامة',
        treatment: 'كالسيوم، فيتامين د، أدوية',
        medications: 'كالسيوم - فيتامين د - بايفوسفونيت',
        advice: 'تعرض للشمس. تجنب السقوط'
    },
    {
        id: 44,
        keywords: ['النقرس', 'ألم مفصل', 'تورم', 'احمرار', 'إصبع قدم'],
        name: 'النقرس | Gout',
        category: 'عظام',
        symptoms: 'ألم حاد في مفصل الإبهام، تورم، احمرار',
        treatment: 'أدوية خافضة لحمض البوليك، مسكنات',
        medications: 'كولشيسين - ألوبيورينول - مضادات التهاب',
        advice: 'تجنب اللحوم الحمراء. اشرب ماء'
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
// معالجة نتائج FDA - تعديل بسيط لجعلها أكثر وضوحاً
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
            // تعديل الاسم ليكون أكثر وضوحاً
            name: `الدواء: ${drug}`,
            probability: Math.min(60 + (data.count * 3), 85),
            description: `هذا الدواء قد يكون مرتبطاً بالأعراض التي ذكرتها (ظهر في ${data.count} تقارير)`,
            symptoms: Array.from(data.reactions).slice(0, 5).join('، '),
            treatment: 'استشر طبيبك قبل استخدام أي دواء',
            medications: drug,
            advice: `⚠️ لا تتوقف عن تناول ${drug} دون استشارة الطبيب`,
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
export const analyzeSymptoms = async (req, res) => {
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