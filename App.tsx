
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Language, Product, Article, Review, SiteConfig, GalleryItem } from './types';
import { TRANSLATIONS, INITIAL_CONFIG } from './constants';
import { apiService } from './services/apiService';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ArticlesPage from './pages/ArticlesPage';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ContactPage from './pages/ContactPage';

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
  inquiries: any[];
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  toast: (msg: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const GlobalLoader: React.FC = () => (
  <div className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin mb-6"></div>
    <div className="text-white font-black text-xl tracking-widest uppercase animate-pulse">Capital Charcoal</div>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [p, a, s, g, r, i] = await Promise.all([
          apiService.getProducts(), apiService.getArticles(), apiService.getSettings(),
          apiService.getGallery(), apiService.getReviews(), apiService.getInquiries()
        ]);
        setProducts(p); setArticles(a); setSiteConfig(s); setGallery(g); setReviews(r); setInquiries(i);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    init();
  }, []);

  if (isLoading) return <GlobalLoader />;

  return (
    <AppContext.Provider value={{ 
      lang, setLang, products, setProducts, articles, setArticles, gallery, setGallery, reviews, setReviews,
      inquiries, setInquiries, siteConfig, setSiteConfig, isLoggedIn, setIsLoggedIn, searchTerm, setSearchTerm, toast
    }}>
      <HashRouter>
        <ScrollToTop />
        <div className={`min-h-screen flex flex-col bg-white selection:bg-orange-600 selection:text-white ${lang === 'en' ? 'font-en' : ''}`}>
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
          
          {/* Floating Action Buttons */}
          <div className={`fixed bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} z-50 flex flex-col gap-3`}>
            <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" className="bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.455 2.516-.659c.76.499 1.732.908 2.883.908 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.446 8.212c-.149.427-.853.791-1.181.829-.327.038-.724.062-2.152-.519-1.838-.747-3.033-2.618-3.125-2.741-.091-.123-.743-.988-.743-1.885 0-.897.469-1.339.636-1.524.167-.185.367-.231.489-.231s.244.02.35.02c.119 0 .278-.045.435.334.167.397.574 1.398.625 1.503.05.105.084.227.014.368-.07.141-.105.227-.209.351-.105.123-.219.273-.314.368-.105.105-.214.219-.091.427.123.208.547.898 1.171 1.455.803.716 1.478.937 1.688 1.042.21.105.333.088.456-.053.123-.141.528-.616.669-.826.141-.21.282-.176.476-.105s1.233.581 1.444.686c.21.105.351.158.403.246.052.088.052.51-.097.937z"/></svg></a>
            <a href={`tel:${siteConfig.phone}`} className="bg-zinc-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></a>
          </div>

          {toastMsg && (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] bg-zinc-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/10 animate-fade-up">
              {toastMsg}
            </div>
          )}
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
};

const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!context) return null;
  const { lang, setLang, siteConfig } = context;
  const t = TRANSLATIONS[lang];

  if (['/admin', '/login'].includes(pathname)) return null;

  const links = [
    { p: '/', l: t.home },
    { p: '/products', l: t.products },
    { p: '/gallery', l: t.gallery },
    { p: '/articles', l: t.articles },
    { p: '/contact', l: t.contactUs },
  ];

  return (
    <nav className="glass-nav text-white sticky top-0 z-50 border-b border-white/5 transition-all">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center font-black">C</div>
          <span className="text-xl font-black tracking-tighter uppercase">{lang === 'ar' ? 'العاصمة' : 'Capital'}</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.p} to={l.p} className={`text-xs font-black uppercase tracking-widest hover:text-orange-500 transition ${pathname === l.p ? 'text-orange-600' : 'text-zinc-400'}`}>{l.l}</Link>
          ))}
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/5 px-4 py-2 rounded-lg text-[10px] font-black border border-white/10 hover:bg-orange-600 transition uppercase tracking-widest">{lang === 'ar' ? 'English' : 'العربية'}</button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-zinc-950 p-6 flex flex-col gap-6 animate-fade-up">
           {links.map(l => (
            <Link key={l.p} to={l.p} onClick={() => setMobileOpen(false)} className="text-sm font-black uppercase tracking-widest">{l.l}</Link>
          ))}
          <button onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); setMobileOpen(false); }} className="text-orange-600 font-black text-xs text-right uppercase tracking-widest">{lang === 'ar' ? 'SWITCH TO ENGLISH' : 'تبديل للعربية'}</button>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const context = useContext(AppContext);
  const { pathname } = useLocation();
  if (!context || ['/admin', '/login'].includes(pathname)) return null;
  const { lang, siteConfig } = context;
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-10">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
        <div className="md:col-span-2">
          <h3 className="text-3xl font-black italic mb-6">Capital Charcoal</h3>
          <p className="text-zinc-500 max-w-md leading-relaxed">{siteConfig.heroSub[lang]}</p>
        </div>
        <div>
          <h4 className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Explore</h4>
          <ul className="space-y-3 text-sm text-zinc-400 font-bold">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/gallery">Factory Gallery</Link></li>
            <li><Link to="/contact">Quote Request</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Headquarters</h4>
          <p className="text-sm text-zinc-400 font-bold">{siteConfig.address[lang]}</p>
          <p className="text-xl font-black mt-4 font-en">{siteConfig.phone}</p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-10 text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">© 2024 Capital Charcoal Factory. Export Quality Standard.</p>
      </div>
    </footer>
  );
};

export default App;
