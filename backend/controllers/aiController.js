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
    // ... باقي الأمراض (نفس المحتوى، ولكن حذفتها للاختصار)
    // ملاحظة: المحتوى الكامل موجود في الملف الأصلي، هنا فقط مثال
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