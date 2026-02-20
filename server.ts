
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

app.use(cors());
app.use(express.json());

const INITIAL_DATA: Record<string, any> = {
  products: [
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
  ],
  articles: [
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
  ],
  reviews: [
    {
      id: '1',
      author: 'أحمد بدير',
      rating: 5,
      comment: { ar: 'فحم ممتاز وسعره مناسب جداً، تعامل راقي وسرعة في التوصيل.', en: 'Excellent charcoal, great price, and professional service.' },
      avatar: 'https://i.pravatar.cc/150?u=a'
    }
  ],
  settings: {
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
  },
  gallery: [],
  inquiries: []
};

// Helper to read/write data
const getData = (key: string) => {
  const filePath = path.join(DATA_DIR, `${key}.json`);
  if (!fs.existsSync(filePath)) {
    const defaultValue = INITIAL_DATA[key] || [];
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const saveData = (key: string, data: any) => {
  const filePath = path.join(DATA_DIR, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// API Routes
app.get('/api/:key', (req, res) => {
  const { key } = req.params;
  res.json(getData(key));
});

app.post('/api/:key', (req, res) => {
  const { key } = req.params;
  const data = req.body;
  saveData(key, data);
  res.json({ success: true });
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
