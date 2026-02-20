
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/apiService';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Image as ImageIcon, 
  Star, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Eye,
  Menu,
  Save,
  Globe
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  if (!context) return null;

  const { 
    products, setProducts, articles, setArticles, gallery, setGallery, 
    reviews, setReviews, inquiries, setInquiries, siteConfig, setSiteConfig, 
    setIsLoggedIn, toast 
  } = context;

  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'articles' | 'gallery' | 'reviews' | 'inquiries' | 'settings'>('stats');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals Visibility
  const [showProductModal, setShowProductModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [readingInquiry, setReadingInquiry] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States (Initializing with empty or current config)
  const [pForm, setPForm] = useState({ nAr: '', nEn: '', dAr: '', dEn: '', cat: 'Premium', imgs: [] as string[], price: 0 });
  const [newImgUrl, setNewImgUrl] = useState('');
  const [aForm, setAForm] = useState({ tAr: '', tEn: '', cAr: '', cEn: '', img: '' });
  const [gForm, setGForm] = useState({ url: '', tAr: '', tEn: '', cat: 'factory' as any });
  const [rForm, setRForm] = useState({ author: '', rating: 5, cAr: '', cEn: '', avatar: '' });
  const [cfgForm, setCfgForm] = useState<SiteConfig>(siteConfig);

  const statsData = useMemo(() => [
    { name: 'Jan', val: 400 }, { name: 'Feb', val: 300 }, { name: 'Mar', val: 600 }, 
    { name: 'Apr', val: 800 }, { name: 'May', val: 750 }, { name: 'Jun', val: 950 }
  ], []);

  const sync = async () => {
    try {
      const [p, a, g, r, i, s] = await Promise.all([
        apiService.getProducts(), apiService.getArticles(), apiService.getGallery(), 
        apiService.getReviews(), apiService.getInquiries(), apiService.getSettings()
      ]);
      setProducts(p); setArticles(a); setGallery(g); setReviews(r); setInquiries(i); setSiteConfig(s);
    } catch (e) {
      console.error("Sync error", e);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => { setIsLoggedIn(false); navigate('/'); };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Common Save Handler to avoid repetition
  const handleSave = async (fn: () => Promise<any>, successMsg: string) => {
    setIsSaving(true);
    try {
      await fn();
      await sync();
      toast(successMsg);
      setEditingId(null);
      return true;
    } catch (e) {
      toast("حدث خطأ أثناء الحفظ");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Sections Actions
  const saveProduct = async () => {
    const success = await handleSave(async () => {
      const item: Product = { 
        id: editingId || Date.now().toString(), 
        name: { ar: pForm.nAr, en: pForm.nEn || pForm.nAr }, 
        description: { ar: pForm.dAr, en: pForm.dEn || pForm.dAr }, 
        images: pForm.imgs, 
        category: pForm.cat,
        price: pForm.price
      };
      return apiService.saveProduct(item);
    }, 'تم حفظ المنتج بنجاح');
    if (success) setShowProductModal(false);
  };

  const saveArticle = async () => {
    const success = await handleSave(async () => {
      const item: Article = { 
        id: editingId || Date.now().toString(), 
        title: { ar: aForm.tAr, en: aForm.tEn || aForm.tAr }, 
        content: { ar: aForm.cAr, en: aForm.cEn || aForm.cAr }, 
        image: aForm.img, 
        date: new Date().toLocaleDateString('ar-EG') 
      };
      return apiService.saveArticle(item);
    }, 'تم حفظ المقال بنجاح');
    if (success) setShowArticleModal(false);
  };

  const saveGallery = async () => {
    const success = await handleSave(async () => {
      const item: GalleryItem = { 
        id: editingId || Date.now().toString(), 
        url: gForm.url, 
        title: { ar: gForm.tAr, en: gForm.tEn || gForm.tAr }, 
        category: gForm.cat 
      };
      return apiService.saveGalleryItem(item);
    }, 'تمت إضافة الصورة للمعرض');
    if (success) setShowGalleryModal(false);
  };

  const saveReview = async () => {
    const success = await handleSave(async () => {
      const item: Review = { 
        id: editingId || Date.now().toString(), 
        author: rForm.author, 
        rating: rForm.rating, 
        comment: { ar: rForm.cAr, en: rForm.cEn || rForm.cAr }, 
        avatar: rForm.avatar || `https://i.pravatar.cc/150?u=${rForm.author}` 
      };
      return apiService.saveReview(item);
    }, 'تم حفظ التقييم بنجاح');
    if (success) setShowReviewModal(false);
  };

  const saveSettings = async () => {
    await handleSave(async () => apiService.saveSettings(cfgForm), 'تم تحديث إعدادات الموقع بالكامل');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row font-ar overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-zinc-950 text-white p-6 flex items-center justify-between sticky top-0 z-[60] shadow-xl">
        <div className="flex items-center gap-3" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black rotate-12">C</div>
          <h2 className="text-lg font-black tracking-tighter uppercase italic">Capital</h2>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-xl">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-50 lg:relative lg:flex lg:w-72 bg-zinc-950 text-white flex-col lg:sticky lg:top-0 lg:h-screen shadow-2xl transition-transform duration-500 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex p-10 border-b border-white/5 items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center font-black rotate-12 shadow-lg shadow-orange-600/30">C</div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">Capital</h2>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Control Panel</span>
          </div>
        </div>
        
        <nav className="p-6 pt-24 lg:pt-6 flex-grow overflow-y-auto space-y-2 custom-scrollbar">
          {[
            {id:'stats',l:'الإحصائيات',i:<LayoutDashboard className="w-5 h-5" />}, 
            {id:'products',l:'المنتجات',i:<Package className="w-5 h-5" />}, 
            {id:'articles',l:'المدونة',i:<FileText className="w-5 h-5" />}, 
            {id:'gallery',l:'المعرض',i:<ImageIcon className="w-5 h-5" />}, 
            {id:'reviews',l:'التقييمات',i:<Star className="w-5 h-5" />}, 
            {id:'inquiries',l:'الرسائل',i:<Mail className="w-5 h-5" />}, 
            {id:'settings',l:'الإعدادات',i:<Settings className="w-5 h-5" />}
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => handleTabChange(t.id as any)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all duration-300 ${activeTab === t.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
            >
              {t.i}<span className="text-sm">{t.l}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-white/5">
           <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-black hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">تسجيل الخروج</span>
           </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Panel Content */}
      <main className="flex-grow p-6 lg:p-14 overflow-y-auto lg:max-h-screen custom-scrollbar w-full">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <div>
              <h1 className="text-5xl font-black italic text-zinc-900 uppercase tracking-tighter leading-none mb-2">{activeTab}</h1>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Management & Cloud Sync</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              {activeTab === 'products' && <button onClick={() => { setEditingId(null); setPForm({nAr:'',nEn:'',dAr:'',dEn:'',cat:'Premium',imgs:[]}); setShowProductModal(true); }} className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:bg-orange-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة منتج</button>}
              {activeTab === 'articles' && <button onClick={() => { setEditingId(null); setAForm({tAr:'',tEn:'',cAr:'',cEn:'',img:''}); setShowArticleModal(true); }} className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:bg-orange-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> مقال جديد</button>}
              {activeTab === 'gallery' && <button onClick={() => { setEditingId(null); setGForm({url:'',tAr:'',tEn:'',cat:'factory'}); setShowGalleryModal(true); }} className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:bg-orange-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> رفع ميديا</button>}
              {activeTab === 'reviews' && <button onClick={() => { setEditingId(null); setRForm({author:'',rating:5,cAr:'',cEn:'',avatar:''}); setShowReviewModal(true); }} className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl hover:bg-orange-600 transition flex items-center gap-2"><Plus className="w-4 h-4" /> إضافة تقييم</button>}
           </div>
        </header>

        {/* --- STATS VIEW --- */}
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 {l:'المنتجات', v:products.length, i:<Package className="w-8 h-8" />, c:'text-orange-600', b:'bg-orange-50'},
                 {l:'المقالات', v:articles.length, i:<FileText className="w-8 h-8" />, c:'text-blue-600', b:'bg-blue-50'},
                 {l:'الرسائل', v:inquiries.length, i:<Mail className="w-8 h-8" />, c:'text-green-600', b:'bg-green-50'},
                 {l:'الميديا', v:gallery.length, i:<ImageIcon className="w-8 h-8" />, c:'text-purple-600', b:'bg-purple-50'}
               ].map((s,i) => (
                 <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 flex flex-col justify-between h-52 hover:shadow-xl transition-all group">
                    <div className={`w-14 h-14 ${s.b} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>{s.i}</div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-[0.2em]">{s.l}</p>
                       <h4 className={`text-5xl font-black italic tracking-tighter ${s.c}`}>{s.v}</h4>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white p-12 rounded-[3.5rem] border border-zinc-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black italic tracking-tighter">أداء التصدير السنوي</h3>
                  <span className="bg-zinc-50 px-4 py-2 rounded-xl text-[10px] font-black text-zinc-400">Real-time Data</span>
               </div>
               <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:700, fill:'#999'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius:'20px', border:'none', boxShadow:'0 10px 40px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="val" stroke="#ea580c" fillOpacity={1} fill="url(#colorVal)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* --- LIST VIEWS (CRUD) --- */}
        <div className="grid gap-4 animate-fade-up">
           
           {/* Products List */}
           {activeTab === 'products' && products.map(p => (
             <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                      <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-zinc-950 tracking-tighter">{p.name.ar}</h3>
                      <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">{p.category}</span>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => { 
                      setEditingId(p.id); 
                      setPForm({nAr:p.name.ar,nEn:p.name.en,dAr:p.description.ar,dEn:p.description.en,cat:p.category,imgs:p.images,price:p.price || 0}); 
                      setShowProductModal(true); 
                   }} className="p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition text-zinc-500"><Edit2 className="w-5 h-5" /></button>
                   <button onClick={async () => { 
                      if(confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                         await apiService.deleteProduct(p.id);
                         await sync();
                         toast('تم حذف المنتج');
                      }
                   }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition"><Trash2 className="w-5 h-5" /></button>
                </div>
             </div>
           ))}

           {/* Articles List */}
           {activeTab === 'articles' && articles.map(a => (
             <div key={a.id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                   <img src={a.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                   <div>
                      <h3 className="text-xl font-black text-zinc-950 tracking-tighter">{a.title.ar}</h3>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{a.date}</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => {
                      setEditingId(a.id);
                      setAForm({tAr:a.title.ar,tEn:a.title.en,cAr:a.content.ar,cEn:a.content.en,img:a.image});
                      setShowArticleModal(true);
                   }} className="p-4 bg-zinc-50 rounded-2xl hover:bg-zinc-100 transition text-zinc-500"><Edit2 className="w-5 h-5" /></button>
                   <button onClick={async () => {
                      if(confirm('حذف المقال؟')) {
                         await apiService.deleteArticle(a.id);
                         await sync();
                      }
                   }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition"><Trash2 className="w-5 h-5" /></button>
                </div>
             </div>
           ))}

           {/* Gallery List */}
           {activeTab === 'gallery' && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map(g => (
                  <div key={g.id} className="bg-white p-4 rounded-[2.5rem] border border-zinc-100 group relative overflow-hidden">
                     <img src={g.url} className="w-full aspect-square object-cover rounded-[2rem] mb-4" alt="" />
                     <h4 className="font-black text-sm text-zinc-900 truncate px-2">{g.title.ar}</h4>
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest px-2">{g.category}</p>
                     <button 
                        onClick={async () => { if(confirm('حذف من المعرض؟')) { await apiService.deleteGalleryItem(g.id); await sync(); } }}
                        className="absolute top-6 right-6 bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:bg-red-700"
                     ><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
             </div>
           )}

           {/* Reviews List */}
           {activeTab === 'reviews' && reviews.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <img src={r.avatar} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                    <div>
                       <h3 className="font-black text-zinc-950 text-xl">{r.author}</h3>
                       <div className="flex gap-1 text-orange-500 text-xs">{"★".repeat(r.rating)}</div>
                    </div>
                 </div>
                 <button onClick={async () => { if(confirm('حذف التقييم؟')) { await apiService.deleteReview(r.id); await sync(); } }} className="p-4 bg-red-50 text-red-500 rounded-2xl">🗑️</button>
              </div>
           ))}

           {/* Inquiries List */}
           {activeTab === 'inquiries' && inquiries.map(inq => (
             <div key={inq.id} className="bg-white p-8 rounded-[3rem] border border-zinc-100 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-zinc-950">{inq.name}</h3>
                   <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{inq.email} • {inq.date}</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setReadingInquiry(inq)} className="bg-zinc-950 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg">قراءة الرسالة</button>
                   <button onClick={async () => { if(confirm('حذف الرسالة؟')) { await apiService.deleteInquiry(inq.id); await sync(); } }} className="bg-red-50 text-red-500 px-6 py-3 rounded-2xl text-xs font-black">حذف</button>
                </div>
             </div>
           ))}

           {/* Settings View */}
           {activeTab === 'settings' && (
             <div className="bg-white p-14 rounded-[4rem] border border-zinc-100 shadow-sm max-w-5xl space-y-10 animate-in slide-in-from-bottom">
                <div className="grid md:grid-cols-2 gap-10">
                   {/* Contact Info */}
                   <div className="md:col-span-2 border-b border-zinc-100 pb-4">
                      <h3 className="text-xl font-black italic flex items-center gap-2"><Mail className="w-5 h-5" /> معلومات التواصل</h3>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">هاتف التواصل</label>
                      <input value={cfgForm.phone} onChange={e => setCfgForm({...cfgForm, phone: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">رابط الواتساب (Export)</label>
                      <input value={cfgForm.whatsapp} onChange={e => setCfgForm({...cfgForm, whatsapp: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">عنوان المصنع (عربي)</label>
                      <input value={cfgForm.address.ar} onChange={e => setCfgForm({...cfgForm, address: {...cfgForm.address, ar: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">عنوان المصنع (English)</label>
                      <input value={cfgForm.address.en} onChange={e => setCfgForm({...cfgForm, address: {...cfgForm.address, en: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>

                   {/* Hero Section */}
                   <div className="md:col-span-2 border-b border-zinc-100 pb-4 mt-6">
                      <h3 className="text-xl font-black italic flex items-center gap-2"><Globe className="w-5 h-5" /> الصفحة الرئيسية (Hero)</h3>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">عنوان الـ Hero (عربي)</label>
                      <input value={cfgForm.heroTitle.ar} onChange={e => setCfgForm({...cfgForm, heroTitle: {...cfgForm.heroTitle, ar: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none font-black" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">عنوان الـ Hero (English)</label>
                      <input value={cfgForm.heroTitle.en} onChange={e => setCfgForm({...cfgForm, heroTitle: {...cfgForm.heroTitle, en: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none font-black" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">الوصف الفرعي (عربي)</label>
                      <textarea value={cfgForm.heroSub.ar} onChange={e => setCfgForm({...cfgForm, heroSub: {...cfgForm.heroSub, ar: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none h-32 resize-none" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">الوصف الفرعي (English)</label>
                      <textarea value={cfgForm.heroSub.en} onChange={e => setCfgForm({...cfgForm, heroSub: {...cfgForm.heroSub, en: e.target.value}})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none h-32 resize-none" />
                   </div>
                   <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">رابط صورة الخلفية الرئيسية</label>
                      <input value={cfgForm.heroImage} onChange={e => setCfgForm({...cfgForm, heroImage: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>
                   <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">رابط اللوجو</label>
                      <input value={cfgForm.logo} onChange={e => setCfgForm({...cfgForm, logo: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl border-0 focus:ring-2 focus:ring-orange-600 outline-none" />
                   </div>
                </div>
                <button 
                   onClick={saveSettings} 
                   disabled={isSaving}
                   className="w-full bg-orange-600 text-white py-7 rounded-3xl font-black text-xl shadow-2xl shadow-orange-600/20 hover:bg-orange-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                   <Save className="w-6 h-6" />
                   {isSaving ? 'جاري التحديث...' : 'نشر التعديلات على الموقع بالكامل'}
                </button>
             </div>
           )}
        </div>

        {/* --- ALL MODALS --- */}
        
        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
             <div className="bg-white w-full max-w-5xl rounded-[4rem] p-12 relative animate-fade-up">
                <button onClick={() => setShowProductModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-orange-600 transition-colors"><X className="w-8 h-8" /></button>
                <h2 className="text-4xl font-black italic tracking-tighter mb-12 uppercase">{editingId ? 'Edit Product' : 'New Stock Item'}</h2>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400">الاسم (عربي)</label>
                            <input value={pForm.nAr} onChange={e => setPForm({...pForm, nAr: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400">Name (English)</label>
                            <input value={pForm.nEn} onChange={e => setPForm({...pForm, nEn: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400">الوصف (عربي)</label>
                         <textarea value={pForm.dAr} onChange={e => setPForm({...pForm, dAr: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl h-32 resize-none" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400">Description (English)</label>
                         <textarea value={pForm.dEn} onChange={e => setPForm({...pForm, dEn: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl h-32 resize-none" />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400">التصنيف</label>
                         <select value={pForm.cat} onChange={e => setPForm({...pForm, cat: e.target.value})} className="w-full bg-zinc-50 p-5 rounded-2xl font-black">
                            <option value="Premium">Premium (ممتاز)</option>
                            <option value="Citrus">Citrus (حمضيات)</option>
                            <option value="Industrial">Industrial (صناعي)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400">السعر (اختياري)</label>
                         <input type="number" value={pForm.price} onChange={e => setPForm({...pForm, price: parseFloat(e.target.value)})} className="w-full bg-zinc-50 p-5 rounded-2xl font-black" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400">إضافة صور (رابط URL)</label>
                         <div className="flex gap-4">
                            <input value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)} placeholder="https://..." className="flex-grow bg-zinc-50 p-5 rounded-2xl" />
                            <button onClick={() => { if(newImgUrl){ setPForm({...pForm, imgs: [...pForm.imgs, newImgUrl]}); setNewImgUrl(''); } }} className="bg-zinc-950 text-white px-8 rounded-2xl font-black">+</button>
                         </div>
                         <div className="grid grid-cols-4 gap-4 bg-zinc-50 p-6 rounded-[2rem] border-2 border-dashed h-40 overflow-y-auto mt-4">
                            {pForm.imgs.map((url, i) => (
                              <div key={i} className="relative group aspect-square">
                                 <img src={url} className="w-full h-full object-cover rounded-xl shadow-sm" alt="" />
                                 <button onClick={() => setPForm({...pForm, imgs: pForm.imgs.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-600/80 text-white items-center justify-center hidden group-hover:flex rounded-xl font-black">حذف</button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
                <button onClick={saveProduct} disabled={isSaving} className="mt-12 w-full bg-orange-600 text-white py-7 rounded-3xl font-black text-xl shadow-2xl hover:scale-[1.01] transition-all">تأكيد ونشر التغييرات</button>
             </div>
          </div>
        )}

        {/* Article Modal */}
        {showArticleModal && (
          <div className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
             <div className="bg-white w-full max-w-4xl rounded-[4rem] p-12 relative animate-fade-up">
                <button onClick={() => setShowArticleModal(false)} className="absolute top-10 right-10 text-zinc-400 hover:text-orange-600 transition-colors"><X className="w-8 h-8" /></button>
                <h2 className="text-4xl font-black italic mb-10 uppercase">{editingId ? 'Edit Article' : 'New Post'}</h2>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <input value={aForm.tAr} onChange={e => setAForm({...aForm, tAr: e.target.value})} placeholder="عنوان المقال (عربي)" className="w-full bg-zinc-50 p-6 rounded-2xl text-xl font-black" />
                      <input value={aForm.tEn} onChange={e => setAForm({...aForm, tEn: e.target.value})} placeholder="Article Title (English)" className="w-full bg-zinc-50 p-6 rounded-2xl text-xl font-black" />
                   </div>
                   <input value={aForm.img} onChange={e => setAForm({...aForm, img: e.target.value})} placeholder="رابط صورة الغلاف الرئيسي" className="w-full bg-zinc-50 p-6 rounded-2xl" />
                   <div className="grid grid-cols-2 gap-4">
                      <textarea value={aForm.cAr} onChange={e => setAForm({...aForm, cAr: e.target.value})} placeholder="محتوى المقال (عربي)..." className="w-full bg-zinc-50 p-6 rounded-2xl h-80 resize-none font-medium text-lg leading-relaxed" />
                      <textarea value={aForm.cEn} onChange={e => setAForm({...aForm, cEn: e.target.value})} placeholder="Article Content (English)..." className="w-full bg-zinc-50 p-6 rounded-2xl h-80 resize-none font-medium text-lg leading-relaxed" />
                   </div>
                   <button onClick={saveArticle} disabled={isSaving} className="w-full bg-zinc-950 text-white py-7 rounded-3xl font-black text-xl shadow-2xl">نشر المقال الآن</button>
                </div>
             </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center p-6">
             <div className="bg-white w-full max-w-md rounded-[4rem] p-12 relative animate-fade-up">
                <button onClick={() => setShowGalleryModal(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-orange-600 transition-colors"><X className="w-6 h-6" /></button>
                <h2 className="text-3xl font-black mb-8 italic tracking-tighter">إضافة للمعرض</h2>
                <div className="space-y-6">
                   <input value={gForm.url} onChange={e => setGForm({...gForm, url: e.target.value})} placeholder="رابط الصورة المباشر" className="w-full bg-zinc-50 p-5 rounded-2xl" />
                   <div className="grid grid-cols-2 gap-4">
                      <input value={gForm.tAr} onChange={e => setGForm({...gForm, tAr: e.target.value})} placeholder="وصف الصورة (عربي)" className="w-full bg-zinc-50 p-5 rounded-2xl" />
                      <input value={gForm.tEn} onChange={e => setGForm({...gForm, tEn: e.target.value})} placeholder="Title (English)" className="w-full bg-zinc-50 p-5 rounded-2xl" />
                   </div>
                   <select value={gForm.cat} onChange={e => setGForm({...gForm, cat: e.target.value as any})} className="w-full bg-zinc-50 p-5 rounded-2xl font-black">
                      <option value="factory">المصنع</option>
                      <option value="process">خط الإنتاج</option>
                      <option value="products">المنتجات</option>
                   </select>
                   <button onClick={saveGallery} disabled={isSaving} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-xl">حفظ في المعرض</button>
                </div>
             </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-xl flex items-center justify-center p-6">
             <div className="bg-white w-full max-w-md rounded-[4rem] p-12 relative animate-fade-up">
                <button onClick={() => setShowReviewModal(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-orange-600 transition-colors"><X className="w-6 h-6" /></button>
                <h2 className="text-3xl font-black mb-8 italic tracking-tighter">إضافة تقييم عميل</h2>
                <div className="space-y-6">
                   <input value={rForm.author} onChange={e => setRForm({...rForm, author: e.target.value})} placeholder="اسم العميل / الشركة" className="w-full bg-zinc-50 p-5 rounded-2xl" />
                   <div className="grid grid-cols-2 gap-4">
                      <textarea value={rForm.cAr} onChange={e => setRForm({...rForm, cAr: e.target.value})} placeholder="التعليق (عربي)" className="w-full bg-zinc-50 p-5 rounded-2xl h-32 resize-none" />
                      <textarea value={rForm.cEn} onChange={e => setRForm({...rForm, cEn: e.target.value})} placeholder="Comment (English)" className="w-full bg-zinc-50 p-5 rounded-2xl h-32 resize-none" />
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-black uppercase text-zinc-400">النجوم (1-5):</span>
                      <input type="number" min="1" max="5" value={rForm.rating} onChange={e => setRForm({...rForm, rating: parseInt(e.target.value)})} className="w-20 bg-zinc-50 p-4 rounded-xl text-center font-black" />
                   </div>
                   <button onClick={saveReview} disabled={isSaving} className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black shadow-xl">نشر التقييم</button>
                </div>
             </div>
          </div>
        )}

        {/* Inquiry Viewer Modal */}
        {readingInquiry && (
           <div className="fixed inset-0 z-[1000] bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setReadingInquiry(null)}>
              <div className="bg-white p-14 rounded-[4rem] max-w-2xl w-full animate-fade-up shadow-2xl" onClick={e => e.stopPropagation()}>
                 <span className="text-[10px] font-black uppercase text-orange-600 tracking-[0.4em] mb-4 block">New Message Received</span>
                 <h2 className="text-4xl font-black mb-2 tracking-tighter leading-none italic">{readingInquiry.name}</h2>
                 <p className="text-zinc-400 font-bold mb-10 border-b border-zinc-50 pb-6">{readingInquiry.email} • {readingInquiry.date}</p>
                 <div className="text-2xl italic text-zinc-700 bg-zinc-50 p-10 rounded-[2.5rem] leading-relaxed shadow-inner">
                    "{readingInquiry.msg}"
                 </div>
                 <div className="mt-12 flex justify-end">
                    <button onClick={() => setReadingInquiry(null)} className="bg-zinc-950 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition">إغلاق المعاينة</button>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
