const axios = require('axios');

// ===== إعدادات APIs =====
const APIS = {
    translate: 'https://translate.googleapis.com/translate_a/single',
    openFDA: {
        url: 'https://api.fda.gov/drug/event.json',
        key: '5qpdeD3i6hvw84SfjQhHdYQZEpq7RUQarzrVmk10' // المفتاح هنا آمن في الباك إند
    }
};

// ===== قاعدة بيانات محلية للأمراض =====
const LOCAL_DISEASES = [
    {
        keywords: ['صداع', 'حمى', 'سعال', 'زكام'],
        name: 'نزلة برد | Common Cold',
        description: 'عدوى فيروسية تصيب الجهاز التنفسي العلوي.',
        symptoms: 'صداع، حمى، سعال، عطس، احتقان بالأنف.',
        treatment: 'راحة، سوائل دافئة، مسكنات، خافضات حرارة.',
        medications: 'Paracetamol - Ibuprofen - Antihistamines',
        advice: 'اشرب سوائل كثيرة. استشر طبيبك إذا استمرت الحمى.'
    },
    {
        keywords: ['ألم صدر', 'ضيق نفس', 'تعرق', 'دوخة'],
        name: 'ذبحة صدرية | Angina',
        description: 'نقص تدفق الدم والأكسجين إلى عضلة القلب.',
        symptoms: 'ألم أو ضغط في الصدر، ضيق تنفس، تعرق، دوخة.',
        treatment: 'راحة فورية، أكسجين، موسعات شرايين.',
        medications: 'Nitroglycerin - Aspirin - Metoprolol',
        advice: 'اطلب الإسعاف فوراً إذا استمر الألم أكثر من 5 دقائق.'
    },
    {
        keywords: ['يرقان', 'اصفرار', 'تعب', 'بول داكن'],
        name: 'التهاب كبد | Hepatitis',
        description: 'التهاب في خلايا الكبد بسبب فيروس أو دواء.',
        symptoms: 'يرقان، اصفرار الجلد والعينين، تعب شديد، بول داكن.',
        treatment: 'راحة، سوائل، تجنب الكحول، مضادات فيروسية.',
        medications: 'Sofosbuvir - Entecavir - Interferon',
        advice: 'تابع وظائف الكبد بانتظام. تجنب أي دواء بدون استشارة.'
    },
    {
        keywords: ['حمى', 'قشعريرة', 'سعال', 'بلغم'],
        name: 'التهاب رئوي | Pneumonia',
        description: 'عدوى في الأكياس الهوائية للرئة.',
        symptoms: 'حمى، قشعريرة، سعال مع بلغم، ألم صدر.',
        treatment: 'مضادات حيوية، راحة، سوائل، خافضات حرارة.',
        medications: 'Amoxicillin - Azithromycin - Levofloxacin',
        advice: 'أكمل المضاد الحيوي كاملة. تجنب التدخين.'
    },
    {
        keywords: ['غثيان', 'إسهال', 'تقيؤ', 'مغص'],
        name: 'نزلة معوية | Gastroenteritis',
        description: 'التهاب في المعدة والأمعاء بسبب عدوى.',
        symptoms: 'غثيان، إسهال، تقيؤ، مغص، حمى خفيفة.',
        treatment: 'تعويض سوائل، راحة، غذاء خفيف.',
        medications: 'ORS - Ondansetron - Loperamide',
        advice: 'اشرب سوائل كثيرة. راجع طبيبك إذا استمر الإسهال.'
    }
];

// =============================================
// ترجمة الكلمات
// =============================================
const translateWords = async (words) => {
    try {
        const translated = [];
        
        for (const word of words) {
            const response = await axios.get(APIS.translate, {
                params: { client: 'gtx', sl: 'ar', tl: 'en', dt: 't', q: word },
                timeout: 3000
            });
            
            if (response.data && response.data[0]) {
                translated.push(response.data[0][0][0]);
            } else {
                translated.push(word);
            }
        }
        
        return translated.filter(w => w && w.length > 2);
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
        
        const searchTerm = keywords.slice(0, 3).join('+');
        
        const response = await axios.get(APIS.openFDA.url, {
            params: {
                search: `patient.reaction.reactionmeddrapt:${searchTerm}`,
                limit: 10,
                api_key: APIS.openFDA.key
            },
            timeout: 10000
        });

        if (!response.data?.results?.length) return null;

        const drugMap = new Map();
        
        response.data.results.forEach(item => {
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

    } catch (error) {
        console.log('⚠️ خطأ في FDA:', error.message);
        return null;
    }
};

// =============================================
// البحث المحلي
// =============================================
const searchLocalDB = (symptomWords) => {
    const results = [];
    
    LOCAL_DISEASES.forEach(disease => {
        let matchCount = 0;
        
        symptomWords.forEach(symptom => {
            if (disease.keywords.some(keyword => 
                keyword.includes(symptom) || symptom.includes(keyword)
            )) {
                matchCount++;
            }
        });
        
        if (matchCount > 0) {
            const probability = Math.min(60 + (matchCount * 10), 95);
            
            results.push({
                name: disease.name,
                probability: probability,
                description: disease.description,
                symptoms: disease.symptoms,
                treatment: disease.treatment,
                medications: disease.medications,
                advice: disease.advice,
                matchCount: matchCount,
                source: 'local'
            });
        }
    });
    
    return results.sort((a, b) => b.matchCount - a.matchCount).slice(0, 3);
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

        // تقسيم الأعراض إلى كلمات
        const symptomWords = symptoms.split(/[\s،,]+/).filter(w => w && w.length > 1);
        
        if (symptomWords.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال أعراض صحيحة'
            });
        }

        let results = [];
        let source = 'local';

        // البحث في القاعدة المحلية أولاً
        const localResults = searchLocalDB(symptomWords);
        
        if (localResults && localResults.length > 0) {
            results = localResults;
        } else {
            // إذا لم نجد، نترجم ونبحث في FDA
            const englishWords = await translateWords(symptomWords);
            const fdaResults = await searchFDA(englishWords);
            
            if (fdaResults && fdaResults.length > 0) {
                results = fdaResults;
                source = 'fda';
            }
        }

        res.json({
            success: true,
            results: results,
            source: source,
            message: results.length > 0 ? 
                `✅ تم العثور على ${results.length} نتائج` : 
                '❌ لم يتم العثور على نتائج. استشر طبيبك.'
        });

    } catch (error) {
        console.error('❌ خطأ في تحليل الأعراض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في تحليل الأعراض. حاول مرة أخرى.'
        });
    }
};

module.exports = {
    analyzeSymptoms
};