
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Language, Product, Article, Review, SiteConfig, GalleryItem } from './types';
import { TRANSLATIONS, INITIAL_CONFIG, INITIAL_PRODUCTS, INITIAL_ARTICLES, INITIAL_REVIEWS } from './constants';
import { getCharcoalExpertAdvice } from './services/geminiService';
import { apiService } from './services/apiService';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ArticlesPage from './pages/ArticlesPage';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ContactPage from './pages/ContactPage';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  msg: string;
  date: string;
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  toast: (msg: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const AIChatbot: React.FC = () => {
  const context = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!context) return null;
  const { lang } = context;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    const response = await getCharcoalExpertAdvice(userMsg, lang);
    setMessages(prev => [...prev, { role: 'bot', text: response || '...' }]);
    setIsTyping(false);
  };

  return (
    <div className={`fixed bottom-32 ${lang === 'ar' ? 'left-10' : 'right-10'} z-[100]`}>
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-zinc-200 animate-in zoom-in">
          <div className="bg-zinc-950 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-xs font-black">AI</div>
              <div><p className="font-black text-sm uppercase tracking-tighter">{lang === 'ar' ? 'خبير العاصمة' : 'Capital Expert'}</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-2xl font-light hover:text-orange-600 transition-colors">&times;</button>
          </div>
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-zinc-50">
             {messages.length === 0 && (
               <div className="text-center py-10 opacity-30 font-black text-xs uppercase tracking-widest">{lang === 'ar' ? 'خبير الفحم جاهز للرد' : 'Expert is online'}</div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white border text-zinc-800 rounded-tl-none'}`}>{m.text}</div>
               </div>
             ))}
             {isTyping && <div className="text-xs text-zinc-400 animate-pulse font-black italic">Thinking...</div>}
          </div>
          <div className="p-4 bg-white border-t flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={lang === 'ar' ? 'اسأل...' : 'Ask...'} className="flex-grow bg-zinc-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-600 transition-all" />
            <button onClick={handleSend} className="bg-zinc-950 text-white w-12 h-12 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-zinc-950 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-[10px] font-black group-hover:rotate-12 transition-transform">AI</div>
          <span className="font-black text-sm uppercase tracking-tighter">{lang === 'ar' ? 'خبير العاصمة' : 'Chat Expert'}</span>
        </button>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  if (!context) return null;
  const { lang, setLang, searchTerm, setSearchTerm } = context;
  const t = TRANSLATIONS[lang];
  if (location.pathname === '/admin' || location.pathname === '/login') return null;

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/products', label: t.products },
    { path: '/gallery', label: t.gallery },
    { path: '/articles', label: t.articles },
    { path: '/contact', label: t.contactUs },
  ];

  return (
    <nav className="bg-zinc-950 text-white sticky top-0 z-50 border-b border-white/5 shadow-xl">
      <div className="container mx-auto px-6 py-5 flex justify-between items-center">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white transition">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        <Link to="/" className="text-2xl font-black text-orange-600 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white text-xs font-ar">فحم</div>
          <span className="tracking-tighter uppercase hidden sm:block">{lang === 'ar' ? 'فحم العاصمة' : 'Capital Charcoal'}</span>
        </Link>
        <div className="hidden lg:flex gap-10 items-center font-black text-[10px] uppercase tracking-[0.3em]">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`hover:text-orange-500 transition-all duration-300 ${location.pathname === link.path ? 'text-orange-600' : 'text-zinc-400'}`}>{link.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-[10px] font-black bg-orange-600/10 text-orange-600 px-4 py-2 rounded-lg border border-orange-600/20 hover:bg-orange-600 hover:text-white transition-all">{lang === 'ar' ? 'EN' : 'AR'}</button>
        </div>
      </div>
      {/* Mobile Sidebar - SOLID BLACK BACKGROUND */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black lg:hidden animate-in slide-in-from-right duration-300">
           <div className="p-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-20">
                <span className="text-orange-600 text-3xl font-black italic tracking-tighter uppercase">Capital Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-6xl font-light hover:text-orange-600 transition-colors">&times;</button>
              </div>
              <div className="flex flex-col gap-10">
                {navLinks.map(link => (
                    <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-5xl font-black text-white hover:text-orange-600 transition-colors uppercase italic tracking-tighter">{link.label}</Link>
                 ))}
              </div>
              <div className="mt-auto pt-10 border-t border-white/10">
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6">Damietta Industrial Zone • Egypt</p>
                <div className="flex flex-col gap-4">
                  <a href={`tel:${context.siteConfig.phone}`} className="bg-orange-600 text-white px-8 py-5 rounded-3xl font-black text-center uppercase text-sm tracking-widest shadow-2xl shadow-orange-600/20">Contact Factory</a>
                  <button onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); setIsMobileMenuOpen(false); }} className="bg-zinc-900 text-white px-8 py-5 rounded-3xl font-black text-center uppercase text-sm tracking-widest hover:bg-zinc-800 transition">Switch Language</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  if (!context) return null;
  const { lang, siteConfig } = context;
  if (location.pathname === '/admin' || location.pathname === '/login') return null;
  return (
    <footer className="bg-zinc-950 text-zinc-500 py-32 border-t border-white/5">
      <div className="container mx-auto px-6 grid lg:grid-cols-4 gap-20">
        <div>
          <Link to="/" className="text-white text-3xl font-black mb-10 block uppercase italic tracking-tighter">فحم العاصمة</Link>
          <p className="mb-12 text-lg leading-relaxed max-w-xs">{siteConfig.heroSub[lang]}</p>
        </div>
        <div>
          <h3 className="text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-10">Direct Contact</h3>
          <p className="mb-6 flex items-center gap-4 text-white font-black"><span className="text-3xl italic tracking-tighter font-en">{siteConfig.phone}</span></p>
          <p className="text-lg font-medium">{siteConfig.address[lang]}</p>
        </div>
        <div>
          <h3 className="text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-10">Platform Links</h3>
          <div className="flex flex-col gap-6 text-lg font-medium">
            <Link to="/products" className="hover:text-white transition">Charcoal Catalog</Link>
            <Link to="/gallery" className="hover:text-white transition">Media Gallery</Link>
            <Link to="/articles" className="hover:text-white transition">Blog & News</Link>
            <Link to="/login" className="text-zinc-800 hover:text-zinc-600 transition text-xs">Access Control</Link>
          </div>
        </div>
        <div className="flex items-end">
           <span className="text-[10px] tracking-[0.4em] opacity-40 uppercase font-black">EST. 1998 • PREMIUM CHARCOAL EXPORT</span>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const [p, a, s, g, r, i] = await Promise.all([
          apiService.getProducts(),
          apiService.getArticles(),
          apiService.getSettings(),
          apiService.getGallery(),
          apiService.getReviews(),
          apiService.getInquiries()
        ]);
        if (p) setProducts(p);
        if (a) setArticles(a);
        if (s) setSiteConfig(s);
        if (g) setGallery(g);
        if (r) setReviews(r);
        if (i) setInquiries(i);
      } catch (e) {
        console.log('Fall back to initial data');
      }
    };
    initData();
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lang]);

  return (
    <AppContext.Provider value={{ 
      lang, setLang, products, setProducts, articles, setArticles, gallery, setGallery, reviews, setReviews,
      inquiries, setInquiries, siteConfig, setSiteConfig, isLoggedIn, setIsLoggedIn, searchTerm, setSearchTerm, toast
    }}>
      <HashRouter>
        <div className={`min-h-screen flex flex-col bg-white text-zinc-950 selection:bg-orange-600 selection:text-white ${lang === 'en' ? 'font-en' : ''}`}>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
          <AIChatbot />
          <div className={`fixed bottom-10 ${lang === 'ar' ? 'left-10' : 'right-10'} z-40 flex flex-col gap-4`}>
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" className="bg-green-600 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.455 2.516-.659c.76.499 1.732.908 2.883.908 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.446 8.212c-.149.427-.853.791-1.181.829-.327.038-.724.062-2.152-.519-1.838-.747-3.033-2.618-3.125-2.741-.091-.123-.743-.988-.743-1.885 0-.897.469-1.339.636-1.524.167-.185.367-.231.489-.231s.244.02.35.02c.119 0 .278-.045.435.334.167.397.574 1.398.625 1.503.05.105.084.227.014.368-.07.141-.105.227-.209.351-.105.123-.219.273-.314.368-.105.105-.214.219-.091.427.123.208.547.898 1.171 1.455.803.716 1.478.937 1.688 1.042.21.105.333.088.456-.053.123-.141.528-.616.669-.826.141-.21.282-.176.476-.105s1.233.581 1.444.686c.21.105.351.158.403.246.052.088.052.51-.097.937z"/></svg></a>
            <a href={`tel:${siteConfig.phone}`} className="bg-zinc-950 text-white w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-white/10 hover:scale-110 active:scale-95 transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></a>
          </div>
          {toastMsg && (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-zinc-950 text-white px-10 py-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-top duration-500 font-black tracking-tighter shadow-orange-600/20">
              {toastMsg}
            </div>
          )}
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
