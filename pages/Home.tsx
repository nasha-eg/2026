
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { lang, products, reviews, articles, gallery, siteConfig } = context;
  const t = TRANSLATIONS[lang];

  const steps = [
    { title: lang === 'ar' ? 'اختيار الأخشاب' : 'Wood Selection', desc: lang === 'ar' ? 'ننتقي أجود أنواع أخشاب الحمضيات والطلح لضمان النقاء.' : 'Selecting finest citrus and Talh woods.', i: '🌲' },
    { title: lang === 'ar' ? 'التفحيم الاحترافي' : 'Carbonization', desc: lang === 'ar' ? 'استخدام أفران حديثة صديقة للبيئة لضمان أعلى نسبة كربون.' : 'Using eco-friendly kilns for high carbon.', i: '🔥' },
    { title: lang === 'ar' ? 'الغربلة والتنقية' : 'Sieving', desc: lang === 'ar' ? 'تنظيف الفحم من الأتربة والشوائب تماماً يدوياً وآلياً.' : 'Complete cleaning from dust and impurities.', i: '✨' },
    { title: lang === 'ar' ? 'التعبئة والتصدير' : 'Packaging', desc: lang === 'ar' ? 'تغليف احترافي يحمي المنتج حتى وصوله للعميل دولياً.' : 'Professional packaging for global export.', i: '🚢' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center text-center text-white bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img src={siteConfig.heroImage} className="w-full h-full object-cover opacity-30" alt="Factory" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950"></div>
        </div>
        <div className="relative z-10 px-6 max-w-5xl animate-fade-up">
          <div className="inline-block bg-orange-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg shadow-orange-600/30">Capital Charcoal Factory</div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 leading-none tracking-tighter italic uppercase">{siteConfig.heroTitle[lang]}</h1>
          <p className="text-xl md:text-3xl text-zinc-300 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">{siteConfig.heroSub[lang]}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/products" className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/20">{t.products}</Link>
            <Link to="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all">{t.contactUs}</Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-zinc-950 italic tracking-tighter mb-6 uppercase">{t.products}</h2>
              <p className="text-zinc-500 text-xl font-medium leading-relaxed border-r-4 border-orange-600 pr-6">تشكيلة واسعة من أجود أنواع الفحم النباتي الطبيعي، مختارة بعناية لتلبية كافة احتياجاتك.</p>
            </div>
            <Link to="/products" className="group text-zinc-400 font-black text-sm uppercase tracking-widest hover:text-orange-600 transition flex items-center gap-3">
              Explore Full Catalog <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {products.slice(0, 3).map(p => (
              <Link to="/products" key={p.id} className="group flex flex-col">
                <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-sm border border-zinc-100 mb-8 relative">
                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={p.name[lang]} />
                  <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-3">{p.category}</span>
                <h3 className="text-3xl font-black italic tracking-tighter group-hover:text-orange-600 transition">{p.name[lang]}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Production Process Steps */}
      <section className="py-32 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-zinc-950 italic tracking-tighter uppercase mb-6">رحلة الجودة</h2>
            <p className="text-zinc-400 text-xl font-medium max-w-2xl mx-auto">من الغابة إلى منزلك، نتبع أدق المعايير العالمية لضمان تفوقنا.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-zinc-100 hover:shadow-2xl transition duration-500 relative">
                <div className="text-5xl mb-8 w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center">{s.i}</div>
                <h4 className="text-2xl font-black italic tracking-tighter mb-4 text-zinc-950">{s.title}</h4>
                <p className="text-zinc-500 font-medium leading-relaxed">{s.desc}</p>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-zinc-950 text-white rounded-full flex items-center justify-center font-black text-xl italic">{idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden">
        <div className="container mx-auto px-6 mb-20">
          <div className="flex justify-between items-end">
             <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Media Gallery</h2>
             <Link to="/gallery" className="bg-white text-zinc-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition">Full Experience</Link>
          </div>
        </div>
        <div className="flex gap-8 overflow-x-auto px-6 pb-12 custom-scrollbar no-scrollbar">
          {[...gallery, ...products.flatMap(p => p.images.map(img => ({url: img, title: p.name})))].slice(0, 8).map((item: any, i) => (
            <div key={i} className="flex-shrink-0 w-80 md:w-[450px] h-[350px] md:h-[550px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
              <img src={item.url} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-700" alt="" />
            </div>
          ))}
        </div>
      </section>

      {/* Articles Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-zinc-950 italic tracking-tighter uppercase mb-6">Expert Blog</h2>
            <p className="text-zinc-400 text-xl font-medium max-w-2xl mx-auto">تعلم أكثر عن عالم الفحم، نصائح الاستخدام، وأسرار الصناعة.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {articles.slice(0, 2).map(a => (
              <Link to="/articles" key={a.id} className="group bg-zinc-50 rounded-[4rem] overflow-hidden flex flex-col md:flex-row border border-zinc-100 hover:shadow-xl transition duration-700">
                <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                  <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={a.title[lang]} />
                </div>
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                  <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-4">{a.date}</span>
                  <h3 className="text-3xl font-black italic tracking-tighter mb-6 leading-tight group-hover:text-orange-600 transition">{a.title[lang]}</h3>
                  <p className="text-zinc-500 font-medium line-clamp-2 leading-relaxed">إقرأ المزيد حول تفاصيل هذا المقال المهم والمفيد لمجالك...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Horizontal Scroll */}
      <section className="py-32 bg-zinc-50">
        <div className="container mx-auto px-6">
           <h2 className="text-5xl md:text-7xl font-black text-zinc-950 text-center mb-24 italic tracking-tighter uppercase">Success Stories</h2>
           <div className="grid md:grid-cols-3 gap-10">
              {reviews.map(r => (
                <div key={r.id} className="bg-white p-12 rounded-[4rem] shadow-sm border border-zinc-100 flex flex-col h-full">
                  <div className="flex gap-1 mb-10 text-orange-500">
                    {[...Array(r.rating)].map((_, i) => <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                  </div>
                  <p className="text-zinc-700 text-2xl italic leading-relaxed mb-12 flex-grow">"{r.comment[lang]}"</p>
                  <div className="flex items-center gap-6 pt-10 border-t border-zinc-100">
                    <img src={r.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
                    <div>
                      <h4 className="font-black text-2xl text-zinc-950 tracking-tighter italic">{r.author}</h4>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Premium Partner</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-40 bg-orange-600 relative overflow-hidden text-white text-center">
        <div className="absolute inset-0 bg-zinc-950 opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl md:text-8xl font-black mb-12 italic tracking-tighter uppercase leading-none">Let's Fuel Your Business Together</h2>
          <p className="text-2xl md:text-3xl font-medium mb-16 text-orange-100 max-w-2xl mx-auto">سواء كنت في مصر أو أي مكان في العالم، نحن نوفر لك أفضل تجربة فحم طبيعي.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/contact" className="bg-zinc-950 text-white px-16 py-7 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-zinc-900 transition shadow-2xl transform hover:-translate-y-2">Request Catalog</Link>
            <a href={`https://wa.me/${siteConfig.whatsapp}`} className="bg-white text-green-600 px-16 py-7 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-zinc-50 transition shadow-2xl transform hover:-translate-y-2">Live WhatsApp Support</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
