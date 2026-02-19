
import { Product, Article, Review, SiteConfig } from './types';

export const INITIAL_CONFIG: SiteConfig = {
  phone: '01000187892',
  whatsapp: '201000187892',
  logo: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?q=80&w=100&auto=format&fit=crop',
  address: {
    ar: 'دمياط الجديدة، المنطقة الصناعية - مصنع فحم العاصمة',
    en: 'New Damietta, Industrial Area - Capital Charcoal Factory'
  },
  heroTitle: {
    ar: 'فحم العاصمة - التميز في كل شروة',
    en: 'Capital Charcoal - Excellence in Every Batch'
  },
  heroSub: {
    ar: 'المصدر الأول في مصر لأجود أنواع الفحم النباتي والمضغوط. نضمن لك حرارة تدوم طويلاً ونقاءً لا يضاهى.',
    en: 'The primary source in Egypt for the finest natural and compressed charcoal. We guarantee long-lasting heat and unmatched purity.'
  },
  heroImage: 'https://images.unsplash.com/photo-1541810270-3601557ba8d6?q=80&w=2070&auto=format&fit=crop'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: { ar: 'فحم طلح سوداني نخب أول', en: 'Premium Sudanese Talh Charcoal' },
    description: { 
      ar: 'فحم طبيعي 100% مستخرج من غابات السودان. يتميز بصوت رنين معدني وقوة حرارة جبارة تدوم لأكثر من 5 ساعات متواصلة. خالي من الأتربة والشوائب تماماً.', 
      en: '100% natural charcoal from Sudan forests. Characterized by a metallic ring and immense heat power lasting over 5 hours.' 
    },
    images: [
      'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541810270-3601557ba8d6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?q=80&w=2076&auto=format&fit=crop'
    ],
    category: 'Premium'
  },
  {
    id: '2',
    name: { ar: 'فحم حمضيات (برتقال وليمون)', en: 'Citrus Charcoal (Orange & Lemon)' },
    description: { 
      ar: 'فحم مثالي للمشويات والأرجيلة، يتميز برماد أبيض ناصع جداً واشتعال سريع بدون شرر أو أدخنة كثيفة.', 
      en: 'Ideal for grilling and shisha, featuring very white ash and fast ignition without sparks.' 
    },
    images: [
      'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Citrus'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: { ar: 'أسرار صناعة الفحم في دمياط', en: 'Secrets of Charcoal Industry in Damietta' },
    content: { 
      ar: 'تعتبر المنطقة الصناعية بدمياط الجديدة قلعة لصناعة الفحم في مصر. نعتمد على أفران حديثة صديقة للبيئة تضمن جودة الكربون ونقائه من الشوائب.', 
      en: 'The industrial zone in New Damietta is a stronghold for the charcoal industry. We use modern eco-friendly kilns that ensure carbon quality and purity.' 
    },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop',
    date: '2024-07-10'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'أحمد بدير',
    rating: 5,
    comment: { ar: 'فحم ممتاز وسعره مناسب جداً، تعامل راقي وسرعة في التوصيل.', en: 'Excellent charcoal, great price, and professional service.' },
    avatar: 'https://i.pravatar.cc/150?u=a'
  }
];

export const TRANSLATIONS = {
  ar: {
    home: 'الرئيسية',
    products: 'أنواع الفحم',
    articles: 'المدونة والتقارير',
    reviews: 'قالوا عنا',
    gallery: 'المعرض',
    contactUs: 'اتصل بنا',
    whatsapp: 'واتساب',
    call: 'اتصال',
    description: 'الوصف',
    price: 'طلب سعر',
    address: 'الموقع',
    latestNews: 'آخر الأخبار',
    heroTitle: 'فحم العاصمة',
    heroSub: 'الجودة والتميز',
    viewDetails: 'التفاصيل',
    adminLogin: 'الإدارة',
    logout: 'خروج',
    save: 'حفظ',
    delete: 'حذف',
    addNew: 'إضافة جديد',
    edit: 'تعديل',
    cancel: 'إلغاء',
    siteSettings: 'الإعدادات',
    whyUs: 'لماذا نحن؟',
    all: 'الكل',
    searchPlaceholder: 'ابحث عن نوع فحم أو مقال...',
    noResults: 'عذراً، لم نجد نتائج تطابق بحثك.',
    admin: {
      dashboard: 'لوحة القيادة',
      productsMan: 'إدارة المنتجات',
      articlesMan: 'إدارة المدونة',
      reviewsMan: 'إدارة التقييمات',
      settings: 'إعدادات النظام',
      stats: 'إحصائيات عامة',
      addProd: 'إضافة منتج',
      addArt: 'إضافة مقال',
      addRev: 'إضافة تقييم',
      aiHelper: 'مساعد الذكاء الاصطناعي',
      optimize: 'تحسين المحتوى (SEO)',
      draft: 'توليد مسودة مقال'
    },
    categories: {
      Premium: 'ممتاز',
      Citrus: 'حمضيات',
      Industrial: 'صناعي'
    }
  },
  en: {
    home: 'Home',
    products: 'Charcoal Types',
    articles: 'Blog',
    reviews: 'Reviews',
    gallery: 'Gallery',
    contactUs: 'Contact',
    whatsapp: 'WhatsApp',
    call: 'Call',
    description: 'Description',
    price: 'Quote',
    address: 'Location',
    latestNews: 'Latest News',
    heroTitle: 'Capital Charcoal',
    heroSub: 'Quality & Excellence',
    viewDetails: 'Details',
    adminLogin: 'Admin',
    logout: 'Logout',
    save: 'Save',
    delete: 'Delete',
    addNew: 'Add New',
    edit: 'Edit',
    cancel: 'Cancel',
    siteSettings: 'Settings',
    whyUs: 'Why Us?',
    all: 'All',
    searchPlaceholder: 'Search for charcoal or articles...',
    noResults: 'Sorry, no results match your search.',
    admin: {
      dashboard: 'Dashboard',
      productsMan: 'Products',
      articlesMan: 'Articles',
      reviewsMan: 'Reviews',
      settings: 'Settings',
      stats: 'Statistics',
      addProd: 'Add Product',
      addArt: 'Add Article',
      addRev: 'Add Review',
      aiHelper: 'AI Assistant',
      optimize: 'Optimize (SEO)',
      draft: 'Draft Article'
    },
    categories: {
      Premium: 'Premium',
      Citrus: 'Citrus',
      Industrial: 'Industrial'
    }
  }
};
