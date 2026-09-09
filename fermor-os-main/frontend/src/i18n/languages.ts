import type { Language, LanguageMeta } from '../types';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    dir: 'ltr',
    region: 'Global / India',
    sampleGreeting: 'Welcome to AGRINEXT',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    dir: 'ltr',
    region: 'National / North & Central India',
    sampleGreeting: 'AGRINEXT में आपका स्वागत है',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    dir: 'ltr',
    region: 'Maharashtra',
    sampleGreeting: 'AGRINEXT मध्ये आपले स्वागत आहे',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic / Nastaliq',
    dir: 'rtl',
    region: 'North & South Asia',
    sampleGreeting: 'ایگری نیکسٹ میں خوش آمدید',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    dir: 'ltr',
    region: 'West Bengal & Tripura',
    sampleGreeting: 'AGRINEXT-এ আপনাকে স্বাগতম',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    dir: 'ltr',
    region: 'Gujarat',
    sampleGreeting: 'AGRINEXT માં તમારું સ્વાગત છે',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    dir: 'ltr',
    region: 'Punjab',
    sampleGreeting: 'AGRINEXT ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    dir: 'ltr',
    region: 'Tamil Nadu & Puducherry',
    sampleGreeting: 'AGRINEXT-க்கு வரவேற்கிறோம்',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    dir: 'ltr',
    region: 'Andhra Pradesh & Telangana',
    sampleGreeting: 'AGRINEXT కు స్వాగతం',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    dir: 'ltr',
    region: 'Karnataka',
    sampleGreeting: 'AGRINEXT ಗೆ ಸುಸ್ವಾಗತ',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    dir: 'ltr',
    region: 'Kerala',
    sampleGreeting: 'AGRINEXT-ലേക്ക് സ്വാഗതം',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    dir: 'ltr',
    region: 'Odisha',
    sampleGreeting: 'AGRINEXT ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ',
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    dir: 'ltr',
    region: 'Assam',
    sampleGreeting: 'AGRINEXT লৈ আপোনাক স্বাগতম',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    dir: 'ltr',
    region: 'Sikkim, North Bengal & Nepal',
    sampleGreeting: 'AGRINEXT मा तपाईंलाई स्वागत छ',
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    dir: 'ltr',
    region: 'Classical Heritage',
    sampleGreeting: 'AGRINEXT मध्ये भवतां स्वागतम्',
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    script: 'Perso-Arabic',
    dir: 'rtl',
    region: 'Iran & Central Asia',
    sampleGreeting: 'به اگری‌نکست خوش آمدید',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    script: 'Arabic',
    dir: 'rtl',
    region: 'Middle East & North Africa',
    sampleGreeting: 'مرحبًا بك في أجرينكست',
  },
];

export const getLanguageMeta = (code: Language): LanguageMeta => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
};

export const isRTL = (code: Language): boolean => {
  return code === 'ur' || code === 'fa' || code === 'ar';
};

export const getDirection = (code: Language): 'ltr' | 'rtl' => {
  return isRTL(code) ? 'rtl' : 'ltr';
};
