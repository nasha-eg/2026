
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { Product, Article, Review, SiteConfig, GalleryItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { optimizeContentForSEO, generateArticleDraft } from '../services/geminiService';
import { apiService } from '../services/apiService';

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  if (!context) return null;

  const { 
    lang, products, setProducts, articles, setArticles, gallery, setGallery, 
    reviews, setReviews, inquiries, setInquiries, siteConfig, setSiteConfig, 
    setIsLoggedIn, toast 
  } = context;

  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'articles' | 'gallery' | 'reviews' | 'inquiries' | 'settings'>('stats');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal visibility
  const [showProductModal, setShowProductModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [readingInquiry, setReadingInquiry] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Forms states
  const [pForm, setPForm] = useState({ nAr: '', nEn: '', dAr: '', dEn: '', cat: 'Premium', imgs: [] as string[] });
  const [newImgUrl, setNewImgUrl] = useState('');
  const [aForm, setAForm] = useState({ tAr: '', tEn: '', cAr: '', cEn: '', img: '' });
  const [gForm, setGForm] = useState({ url: '', tAr: '', tEn: '', cat: 'factory' as any });
  const [rForm, setRForm] = useState({ author: '', rating: 5, cAr: '', cEn: '', avatar: '' });
  const [cfgForm, setCfgForm] = useState<SiteConfig>(siteConfig);

  useEffect(() => {
    const sync = async () => {
      try {
        const [p, a, g, r, i, s] = await Promise.all([
          apiService.getProducts(), apiService.getArticles(), apiService.getGallery(), 
          apiService.getReviews(), apiService.getInquiries(), apiService.getSettings()
        ]);
        if (p) setProducts(p); if (a) setArticles(a); if (g) setGallery(g);
        if (r) setReviews(r); if (i) setInquiries(i); if (s) setSiteConfig(s);
      } catch (e) { console.error("Sync Failed:", e); }
    };
    sync();
  }, [activeTab]);

  const statsData = useMemo(() => [
    { name: 'Jan', val: 400 }, { name: 'Feb', val: 300 }, { name: 'Mar', val: 600 }, { name: 'Apr', val: 800 }, { name: 'May', val: 750 }, { name: 'Jun', val: 950 }
  ], []);

  const handleLogout = () => { setIsLoggedIn(false); navigate('/'); };

  const handleAiAction = async (type: 'optimize' | 'draft', target: string, input: string) => {
    if (!input) { toast('يرجى إدخال نص للبدء'); return; }
    setIsAiLoading(true);
    let res = type === 'optimize' ? await optimizeContentForSEO('product', input, 'ar') : await generateArticleDraft(input, 'ar');
    if (res) {
      if (target === 'pDesc') setPForm(prev => ({ ...prev, dAr: res }));
      if (target === 'aCont') setAForm(prev => ({ ...prev, cAr: res }));
      toast('تم التوليد بنجاح عبر Gemini AI');
    } else {
      toast('عذراً، واجه الذكاء الاصطناعي مشكلة في الوصول.');
    }
    setIsAiLoading(false);
  };

  const saveProduct = async () => {
    setIsSaving(true);
    const item: Product = { id: editingId || Date.now().toString(), name: { ar: pForm.nAr, en: pForm.nEn }, description: { ar: pForm.dAr, en: pForm.dEn }, images: pForm.imgs, category: pForm.cat };
    await apiService.saveProduct(item);
    if (editingId) setProducts(products.map(x => x.id === editingId ? item : x));
    else setProducts([...products, item]);
    setShowProductModal(false); toast('تم حفظ المنتج'); setIsSaving(false);
  };

  const saveArticle = async () => {
    setIsSaving(true);
    const item: Article = { id: editingId || Date.now().toString(), title: { ar: aForm.tAr, en: aForm.tEn }, content: { ar: aForm.cAr, en: aForm.cEn }, image: aForm.img, date: new Date().toISOString().split('T')[0] };
    await apiService.saveArticle(item);
    if (editingId) setArticles(articles.map(x => x.id === editingId ? item : x));
    else setArticles([...articles, item]);
    setShowArticleModal(false); toast('تم حفظ المقال'); setIsSaving(false);
  };

  const saveGalleryItem = async () => {
    const item: GalleryItem = { id: Date.now().toString(), url: gForm.url, title: { ar: gForm.tAr, en: gForm.tEn }, category: gForm.cat };
    await apiService.saveGalleryItem(item);
    setGallery([...gallery, item]);
    setShowGalleryModal(false); setGForm({url:'', tAr:'', tEn:'', cat:'factory'}); toast('تمت إضافة الميديا');
  };

  const saveReview = async () => {
    const item: Review = { id: Date.now().toString(), author: rForm.author, rating: rForm.rating, comment: { ar: rForm.cAr, en: rForm.cEn }, avatar: rForm.avatar || 'https://i.pravatar.cc/150' };
    await apiService.saveReview(item);
    setReviews([...reviews, item]);
    setShowReviewModal(false); setRForm({author:'', rating:5, cAr:'', cEn:'', avatar:''}); toast('تمت إضافة التقييم');
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col lg:flex-row font-ar">
      <aside className="lg:w-80 bg-zinc-950 text-white p-8 flex flex-col shrink-0 z-50 shadow-2xl">
        <div className="mb-12 text-center group cursor-pointer" onClick={() => navigate('/')}>
          {siteConfig.logo ? (
            <img src={siteConfig.logo} className="w-20 h-20 rounded-2xl mx-auto mb-4 border-2 border-orange-600 shadow-xl group-hover:scale-105 transition duration-500" alt="Logo" />
          ) : (
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl mx-auto mb-4 group-hover:rotate-12 transition">فحم</div>
          )}
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Capital Charcoal</h2>
          <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mt-1">Admin Panel</span>
        </div>
        
        <nav className="space-y-1 flex-grow overflow-y-auto">
          {[
            {id:'stats',n:'الإحصائيات',i:'📊'}, {id:'products',n:'المنتجات',i:'🪵'}, {id:'articles',n:'المدونة',i:'✍️'}, 
            {id:'gallery',n:'الميديا',i:'🖼️'}, {id:'reviews',n:'التقييمات',i:'💬'}, {id:'inquiries',n:'الرسائل',i:'📬'}, {id:'settings',n:'الإعدادات',i:'⚙️'}
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-5 font-black transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg scale-[1.02]' : 'text-zinc-500 hover:bg-white/5'}`}>
              <span className="text-xl">{tab.i}</span><span className="flex-grow">{tab.n}</span>
            </button>
          ))}
        </nav>
        
        <button onClick={handleLogout} className="mt-8 bg-red-600/10 text-red-500 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition uppercase text-[10px] tracking-widest border border-red-600/20">خروج</button>
      </aside>

      <main className="flex-grow p-6 lg:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-200 gap-6">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-zinc-950">{activeTab}</h1>
          <div className="flex flex-wrap gap-4">
            {activeTab === 'products' && <button onClick={() => { setEditingId(null); setPForm({nAr:'',nEn:'',dAr:'',dEn:'',cat:'Premium',imgs:[]}); setShowProductModal(true); }} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl">+ منتج جديد</button>}
            {activeTab === 'articles' && <button onClick={() => { setEditingId(null); setAForm({tAr:'',tEn:'',cAr:'',cEn:'',img:''}); setShowArticleModal(true); }} className="bg-zinc-950 text-white px-8 py-3 rounded-2xl font-black shadow-xl">+ مقال جديد</button>}
            {activeTab === 'gallery' && <button onClick={() => setShowGalleryModal(true)} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl">+ ميديا</button>}
            {activeTab === 'reviews' && <button onClick={() => setShowReviewModal(true)} className="bg-zinc-950 text-white px-8 py-3 rounded-2xl font-black shadow-xl">+ تقييم عميل</button>}
          </div>
        </header>

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-4 gap-6 animate-in fade-in duration-700">
             {[
               {l:'منتجات الكتالوج',v:products.length,i:'🪵',c:'text-orange-600'}, {l:'مقالات المدونة',v:articles.length,i:'✍️',c:'text-zinc-950'}, 
               {l:'رسائل العملاء',v:inquiries.length,i:'📬',c:'text-blue-600'}, {l:'تقييمات النجوم',v:reviews.length,i:'⭐',c:'text-yellow-500'}
             ].map((s, idx) => (
               <div key={idx} className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between mb-4"><span className={`text-3xl ${s.c}`}>{s.i}</span><span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">{s.l}</span></div>
                  <h4 className="text-5xl font-black italic">{s.v}</h4>
               </div>
             ))}
             <div className="md:col-span-4 bg-zinc-950 p-12 rounded-[4rem] h-[400px] shadow-2xl">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={statsData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" /><XAxis dataKey="name" hide /><YAxis hide /><Tooltip contentStyle={{ borderRadius:'15px'}} /><Area type="monotone" dataKey="val" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={4} /></AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}

        <div className="space-y-4">
          {activeTab === 'products' && products.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border group shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-6">
                <img src={p.images[0]} className="w-16 h-16 rounded-xl object-cover shadow" alt="" />
                <div><h3 className="text-xl font-black">{p.name.ar}</h3><span className="text-[10px] uppercase font-black text-zinc-400">{p.category}</span></div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => { setEditingId(p.id); setPForm({nAr:p.name.ar,nEn:p.name.en,dAr:p.description.ar,dEn:p.description.en,cat:p.category,imgs:p.images}); setShowProductModal(true); }} className="px-6 py-2 bg-zinc-100 rounded-xl font-black text-xs hover:bg-zinc-200">تعديل</button>
                 <button onClick={() => apiService.deleteProduct(p.id).then(() => setProducts(products.filter(x => x.id !== p.id)))} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white">حذف</button>
              </div>
            </div>
          ))}

          {activeTab === 'articles' && articles.map(a => (
            <div key={a.id} className="bg-white p-6 rounded-[2rem] flex items-center justify-between border shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-6"><img src={a.image} className="w-16 h-16 rounded-xl object-cover shadow" alt="" /><h3 className="text-xl font-black">{a.title.ar}</h3></div>
              <div className="flex gap-2">
                 <button onClick={() => { setEditingId(a.id); setAForm({tAr:a.title.ar,tEn:a.title.en,cAr:a.content.ar,cEn:a.content.en,img:a.image}); setShowArticleModal(true); }} className="px-6 py-2 bg-zinc-100 rounded-xl font-black text-xs">تعديل</button>
                 <button onClick={() => apiService.deleteArticle(a.id).then(() => setArticles(articles.filter(x => x.id !== a.id)))} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-black text-xs">حذف</button>
              </div>
            </div>
          ))}

          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {gallery.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-[2rem] border relative group shadow-sm">
                    <img src={item.url} className="w-full aspect-square object-cover rounded-xl" alt="" />
                    <button onClick={() => apiService.deleteGalleryItem(item.id).then(() => setGallery(gallery.filter(x => x.id !== item.id)))} className="absolute top-6 right-6 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black opacity-0 group-hover:opacity-100 transition shadow-lg">&times;</button>
                    <div className="mt-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest truncate">{item.title.ar}</div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'reviews' && reviews.map(r => (
             <div key={r.id} className="bg-white p-6 rounded-[2.5rem] flex items-center justify-between border shadow-sm group">
                <div className="flex items-center gap-6"><img src={r.avatar} className="w-14 h-14 rounded-full border-2 border-orange-500 shadow" /><h3 className="font-black text-lg">{r.author}</h3></div>
                <button onClick={() => apiService.deleteReview(r.id).then(() => setReviews(reviews.filter(x => x.id !== r.id)))} className="bg-red-50 text-red-600 px-8 py-3 rounded-2xl font-black text-xs group-hover:bg-red-600 group-hover:text-white transition-all">حذف التقييم</button>
             </div>
          ))}

          {activeTab === 'inquiries' && inquiries.map(inq => (
             <div key={inq.id} className="bg-white p-8 rounded-[3rem] flex items-center justify-between border shadow-sm">
                <div><h3 className="font-black text-2xl tracking-tighter">{inq.name}</h3><p className="text-xs text-zinc-400 font-en">{inq.email}</p></div>
                <div className="flex gap-4">
                   <button onClick={() => setReadingInquiry(inq)} className="bg-zinc-950 text-white px-10 py-3 rounded-2xl font-black text-xs shadow-lg">عرض الرسالة</button>
                   <button onClick={() => apiService.deleteInquiry(inq.id).then(() => setInquiries(inquiries.filter(x => x.id !== inq.id)))} className="bg-red-50 text-red-600 px-10 py-3 rounded-2xl font-black text-xs">حذف</button>
                </div>
             </div>
          ))}

          {activeTab === 'settings' && (
            <div className="bg-white p-12 rounded-[4rem] border space-y-12 animate-in slide-in-from-bottom shadow-sm">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">رابط صورة اللوجو (الشعار)</label>
                     <div className="flex gap-4 items-center">
                        <input value={cfgForm.logo} onChange={e => setCfgForm({...cfgForm, logo: e.target.value})} className="flex-grow border-2 p-5 rounded-3xl outline-none focus:border-orange-600 transition" placeholder="URL here..." />
                        {cfgForm.logo && <img src={cfgForm.logo} className="w-16 h-16 rounded-xl object-contain border bg-zinc-50 p-2" />}
                     </div>
                  </div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">رقم تواصل المصنع</label><input value={cfgForm.phone} onChange={e => setCfgForm({...cfgForm, phone: e.target.value})} className="w-full border-2 p-5 rounded-3xl outline-none font-en font-bold" /></div>
                  <div className="md:col-span-2 space-y-4"><label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">رابط صورة الغلاف الرئيسية (Hero Background)</label><input value={cfgForm.heroImage} onChange={e => setCfgForm({...cfgForm, heroImage: e.target.value})} className="w-full border-2 p-5 rounded-3xl outline-none" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">عنوان الهيرو الرئيسي (عربي)</label><input value={cfgForm.heroTitle.ar} onChange={e => setCfgForm({...cfgForm, heroTitle: {...cfgForm.heroTitle, ar: e.target.value}})} className="w-full border-2 p-5 rounded-3xl outline-none font-black" /></div>
                  <div className="space-y-4"><label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Hero Title (English)</label><input value={cfgForm.heroTitle.en} onChange={e => setCfgForm({...cfgForm, heroTitle: {...cfgForm.heroTitle, en: e.target.value}})} className="w-full border-2 p-5 rounded-3xl outline-none font-en font-black" /></div>
               </div>
               <button onClick={async () => { await apiService.saveSettings(cfgForm); setSiteConfig(cfgForm); toast('تم تحديث إعدادات المصنع بنجاح'); }} className="bg-zinc-950 text-white px-20 py-7 rounded-[3rem] font-black text-xl shadow-2xl hover:bg-orange-600 transition-all uppercase italic tracking-tighter">حفظ ومزامنة كافة التغييرات</button>
            </div>
          )}
        </div>

        {/* MODALS SECTION */}
        
        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/95 flex items-center justify-center p-6 overflow-y-auto">
             <div className="bg-white w-full max-w-6xl rounded-[4rem] p-12 relative animate-in zoom-in duration-300 shadow-2xl">
                <button onClick={() => setShowProductModal(false)} className="absolute top-10 right-10 text-5xl font-light hover:text-orange-600 transition">&times;</button>
                <h2 className="text-5xl font-black mb-12 italic tracking-tighter uppercase">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">الاسم بالعربية</label><input value={pForm.nAr} onChange={e => setPForm({...pForm, nAr: e.target.value})} className="w-full border-2 p-5 rounded-3xl outline-none font-bold" /></div>
                      <div className="relative space-y-2">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex justify-between">الوصف (عربي) <button onClick={() => handleAiAction('optimize', 'pDesc', pForm.dAr)} className="bg-orange-100 text-orange-600 px-4 py-1 rounded-xl text-[8px] font-black hover:bg-orange-600 hover:text-white transition">🪄 AI Optimize</button></label>
                         <textarea value={pForm.dAr} onChange={e => setPForm({...pForm, dAr: e.target.value})} className="w-full border-2 p-5 rounded-3xl h-56 pt-6 resize-none outline-none font-medium leading-relaxed" />
                      </div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">التصنيف</label>
                        <select value={pForm.cat} onChange={e => setPForm({...pForm, cat: e.target.value})} className="w-full border-2 p-5 rounded-3xl outline-none font-black">
                           <option value="Premium">Premium</option><option value="Citrus">Citrus</option><option value="Industrial">Industrial</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2"><label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Name (English)</label><input value={pForm.nEn} onChange={e => setPForm({...pForm, nEn: e.target.value})} className="w-full border-2 p-5 rounded-3xl outline-none font-en font-bold" /></div>
                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">معرض الصور (Product Gallery)</label>
                         <div className="flex gap-4">
                            <input value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)} placeholder="Paste image URL here..." className="flex-grow border-2 p-5 rounded-3xl outline-none" />
                            <button onClick={() => { if(newImgUrl) { setPForm({...pForm, imgs: [...pForm.imgs, newImgUrl]}); setNewImgUrl(''); } }} className="bg-zinc-950 text-white px-10 rounded-3xl font-black shadow-xl">+</button>
                         </div>
                         <div className="grid grid-cols-4 gap-4 bg-zinc-50 p-6 rounded-[2.5rem] border-2 border-dashed min-h-[150px]">
                            {pForm.imgs.map((url, i) => (
                              <div key={i} className="relative aspect-square">
                                 <img src={url} className="w-full h-full object-cover rounded-2xl shadow border-2 border-white" />
                                 <button onClick={() => setPForm({...pForm, imgs: pForm.imgs.filter((_, idx) => idx !== i)})} className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">&times;</button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
                <button onClick={saveProduct} disabled={isSaving} className="mt-12 w-full bg-zinc-950 text-white py-8 rounded-[3rem] font-black text-2xl hover:bg-orange-600 transition shadow-2xl uppercase italic tracking-tighter">
                  {isSaving ? 'DATABASE SYNC...' : editingId ? 'Update Product Entry' : 'Publish Product to Catalog'}
                </button>
             </div>
          </div>
        )}

        {/* Article Modal */}
        {showArticleModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/95 flex items-center justify-center p-6 overflow-y-auto">
             <div className="bg-white w-full max-w-5xl rounded-[3rem] p-12 relative shadow-2xl">
                <button onClick={() => setShowArticleModal(false)} className="absolute top-10 right-10 text-5xl font-light">&times;</button>
                <h2 className="text-4xl font-black mb-10 italic">{editingId ? 'Edit Article' : 'New Article Draft'}</h2>
                <div className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400">العنوان بالعربي</label><input value={aForm.tAr} onChange={e => setAForm({...aForm, tAr: e.target.value})} className="w-full border-2 p-5 rounded-3xl" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400">Title (EN)</label><input value={aForm.tEn} onChange={e => setAForm({...aForm, tEn: e.target.value})} className="w-full border-2 p-5 rounded-3xl" /></div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 flex justify-between">المحتوى <button onClick={() => handleAiAction('draft', 'aCont', aForm.tAr)} className="bg-zinc-100 text-zinc-950 px-4 py-1 rounded-xl text-[8px] font-black hover:bg-orange-600 hover:text-white transition">🪄 AI Draft</button></label>
                      <textarea value={aForm.cAr} onChange={e => setAForm({...aForm, cAr: e.target.value})} className="w-full border-2 p-5 rounded-3xl h-64 resize-none leading-relaxed" />
                   </div>
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400">رابط صورة المقال</label><input value={aForm.img} onChange={e => setAForm({...aForm, img: e.target.value})} className="w-full border-2 p-5 rounded-3xl" /></div>
                </div>
                <button onClick={saveArticle} className="mt-10 w-full bg-zinc-950 text-white py-6 rounded-3xl font-black text-xl">حفظ ونشر المقال</button>
             </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/95 flex items-center justify-center p-6">
             <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl">
                <button onClick={() => setShowReviewModal(false)} className="absolute top-10 right-10 text-4xl">&times;</button>
                <h2 className="text-3xl font-black mb-8 italic">إضافة تقييم عميل</h2>
                <div className="space-y-6">
                   <input value={rForm.author} onChange={e => setRForm({...rForm, author: e.target.value})} placeholder="اسم العميل" className="w-full border-2 p-5 rounded-3xl" />
                   <div className="flex gap-4 items-center">
                      <label className="font-black text-zinc-400">النجوم:</label>
                      <select value={rForm.rating} onChange={e => setRForm({...rForm, rating: parseInt(e.target.value)})} className="border-2 p-4 rounded-2xl">
                         {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} نجوم</option>)}
                      </select>
                   </div>
                   <textarea value={rForm.cAr} onChange={e => setRForm({...rForm, cAr: e.target.value})} placeholder="التعليق (عربي)" className="w-full border-2 p-5 rounded-3xl h-32" />
                   <input value={rForm.avatar} onChange={e => setRForm({...rForm, avatar: e.target.value})} placeholder="رابط صورة العميل (اختياري)" className="w-full border-2 p-5 rounded-3xl" />
                   <button onClick={saveReview} className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl">حفظ المراجعة</button>
                </div>
             </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-[100] bg-zinc-950/95 flex items-center justify-center p-6">
             <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl">
                <button onClick={() => setShowGalleryModal(false)} className="absolute top-10 right-10 text-4xl">&times;</button>
                <h2 className="text-3xl font-black mb-8 italic">إضافة ميديا جديدة</h2>
                <div className="space-y-5">
                   <input value={gForm.url} onChange={e => setGForm({...gForm, url: e.target.value})} placeholder="رابط الصورة المباشر" className="w-full border-2 p-5 rounded-3xl outline-none" />
                   <input value={gForm.tAr} onChange={e => setGForm({...gForm, tAr: e.target.value})} placeholder="عنوان توضيحي (AR)" className="w-full border-2 p-5 rounded-3xl outline-none" />
                   <select value={gForm.cat} onChange={e => setGForm({...gForm, cat: e.target.value as any})} className="w-full border-2 p-5 rounded-3xl outline-none font-black">
                      <option value="factory">أجواء المصنع</option><option value="process">خط الإنتاج</option><option value="products">المنتجات النهائية</option>
                   </select>
                   <button onClick={saveGalleryItem} className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xl">حفظ في المعرض</button>
                </div>
             </div>
          </div>
        )}

        {/* Inquiry Detailed Reader */}
        {readingInquiry && (
           <div className="fixed inset-0 z-[100] bg-zinc-950/95 flex items-center justify-center p-6" onClick={() => setReadingInquiry(null)}>
              <div className="bg-white p-12 rounded-[4rem] max-w-2xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                 <div className="text-orange-600 font-black text-[10px] uppercase mb-4 tracking-widest">Incoming Message Alert</div>
                 <h2 className="text-4xl font-black mb-2 italic tracking-tighter">{readingInquiry.name}</h2>
                 <p className="text-zinc-400 font-en mb-10 border-b pb-6 text-sm">{readingInquiry.email}</p>
                 <div className="text-2xl font-medium leading-[1.8] italic text-zinc-700 bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100">
                   "{readingInquiry.msg}"
                 </div>
                 <div className="mt-12 flex justify-between items-center text-xs text-zinc-300 font-black uppercase tracking-widest">
                    <span>Received: {readingInquiry.date}</span>
                    <button onClick={() => setReadingInquiry(null)} className="bg-zinc-950 text-white px-10 py-5 rounded-[1.5rem] hover:bg-orange-600 transition shadow-xl">Dismiss</button>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
