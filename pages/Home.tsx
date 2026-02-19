
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { Link } from 'react-router-dom';
import { generateProductSuggestions } from '../services/geminiService';

const Home: React.FC = () => {
  const context = useContext(AppContext);
  const [slogans, setSlogans] = useState<string[]>([]);
  
  useEffect(() => {
    generateProductSuggestions('Natural Charcoal').then(res => {
      if (res && res.length > 0) setSlogans(res);
    });
  }, []);

  if (!context) return null;
  const { lang, products, articles, reviews, siteConfig, searchTerm } = context;
  const t = TRANSLATIONS[lang];

  const filteredProducts = products.filter(p => 
    p.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const steps = [
    { title: lang === 'ar' ? 'الاختيار' : 'Selection', desc: lang === 'ar' ? 'ننتقي أجود أنواع الأخشاب الطبيعية بعناية.' : 'We carefully select the finest natural woods.', icon: '🌲' },
    { title: lang === 'ar' ? 'التفحيم' : 'Carbonization', desc: lang === 'ar' ? 'معالجة حرارية متطورة لضمان أعلى نسبة كربون.' : 'Advanced heat treatment to ensure high carbon content.', icon: '🔥' },
    { title: lang === 'ar' ? 'الغربلة' : 'Sieving', desc: lang === 'ar' ? 'تنظيف الفحم من الأتربة والشوائب تماماً.' : 'Complete cleaning of charcoal from dust and impurities.', icon: '🧹' },
    { title: lang === 'ar' ? 'التعبئة' : 'Packaging', desc: lang === 'ar' ? 'تغليف احترافي يضمن الحفاظ على جودة المنتج.' : 'Professional packaging that preserves product quality.', icon: '📦' }
  ];

  return (
    <div className="animate-in fade-in duration-1000 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0 scale-105">
          <img src={siteConfig.heroImage} alt="Hero" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950 z-10"></div>
        <div className="relative z-20 max-w-6xl px-6">
          <div className="inline-block bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl animate-bounce">Premium Export Grade</div>
          <h1 className="text-6xl md:text-[10rem] font-black mb-8 leading-none tracking-tighter uppercase italic drop-shadow-2xl">
            {siteConfig.heroTitle[lang]}
          </h1>
          <p className="text-xl md:text-3xl mb-16 text-zinc-400 max-w-3xl mx-auto leading-relaxed font-medium">
            {siteConfig.heroSub[lang]}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#types" className="bg-orange-600 hover:bg-orange-500 text-white px-16 py-6 rounded-[2.5rem] text-2xl font-black transition transform hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/30">
              {t.products}
            </a>
            <Link to="/gallery" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-16 py-6 rounded-[2.5rem] text-2xl font-black transition hover:bg-white/10">
              {t.gallery}
            </Link>
          </div>
          
          {slogans.length > 0 && (
            <div className="mt-20 bg-white/5 backdrop-blur-md border border-white/10 inline-flex rounded-full px-10 py-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              <span className="text-orange-500 font-black mr-2 uppercase text-xs tracking-widest">{lang === 'ar' ? 'توصية AI:' : 'AI Suggestion:'}</span>
              <span className="text-zinc-300 font-bold">{slogans[0]}</span>
            </div>
          )}
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-white border-y border-zinc-100 py-20">
         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: lang === 'ar' ? 'طن/شهرياً' : 'Tons/Month', val: '500+', i: '🚢' },
              { label: lang === 'ar' ? 'دولة مستوردة' : 'Export Countries', val: '12', i: '🌍' },
              { label: lang === 'ar' ? 'سنة خبرة' : 'Years Exp', val: '25+', i: '⭐' },
              { label: lang === 'ar' ? 'عميل راضٍ' : 'Happy Clients', val: '1.2k', i: '🤝' }
            ].map((s, idx) => (
              <div key={idx} className="space-y-4">
                 <div className="text-3xl mb-2">{s.i}</div>
                 <div className="text-5xl font-black text-zinc-950 italic tracking-tighter">{s.val}</div>
                 <div className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* Featured Products */}
      <section id="types" className="py-32 bg-zinc-950 text-white border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">{t.products}</h2>
              <p className="text-zinc-400 text-2xl font-medium leading-relaxed italic">جودة تفوق التوقعات، تلبي احتياجات المطاعم، محلات الأرجيلة، ومحبي الشواء المنزلي.</p>
            </div>
            <Link to="/products" className="bg-white/10 hover:bg-orange-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all duration-500 flex items-center gap-4">
               {lang === 'ar' ? 'استكشف الكتالوج' : 'Explore Catalog'}
               <span>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {(searchTerm ? filteredProducts : products.slice(0, 3)).map(product => (
              <div key={product.id} className="group bg-white/5 border border-white/10 rounded-[4rem] overflow-hidden hover:border-orange-600/50 transition-all duration-700 shadow-2xl">
                <div className="h-[500px] overflow-hidden relative">
                  <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">PREMIUM {product.category}</span>
                    <h3 className="text-4xl font-black mb-6 group-hover:text-orange-500 transition tracking-tighter italic">{product.name[lang]}</h3>
                    <Link to="/products" className="inline-block bg-white text-zinc-950 px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition duration-500">التفاصيل الكاملة</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="text-center mb-24 max-w-4xl mx-auto">
              <h2 className="text-6xl font-black text-zinc-950 mb-8 tracking-tighter uppercase italic">{lang === 'ar' ? 'رحلة الإنتاج المثالي' : 'The Perfect Process'}</h2>
              <p className="text-zinc-500 text-2xl font-medium leading-relaxed">نطبق أعلى المعايير التقنية في كل مرحلة لضمان وصول فحم نقي وقوي الحرارة إلى مخازنكم.</p>
           </div>
           
           <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-orange-600/10 -translate-y-1/2 z-0"></div>
              {steps.map((step, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition duration-700 relative z-10 border border-zinc-100 group">
                   <div className="w-24 h-24 bg-zinc-950 text-white rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:bg-orange-600 transition duration-500 transform group-hover:rotate-12 shadow-xl shadow-black/10">
                      {step.icon}
                   </div>
                   <h3 className="text-3xl font-black mb-6 italic tracking-tighter">{step.title}</h3>
                   <p className="text-zinc-500 text-lg leading-relaxed font-medium">{step.desc}</p>
                   <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-black italic shadow-lg">0{i+1}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
           <div className="flex justify-between items-end mb-24">
              <div className="max-w-2xl">
                 <h2 className="text-6xl font-black text-zinc-950 mb-8 tracking-tighter uppercase italic">{t.articles}</h2>
                 <p className="text-zinc-500 text-xl font-medium leading-relaxed">أحدث التقارير والمقالات حول سوق الفحم العالمي وطرق الاستخدام المثلى.</p>
              </div>
              <Link to="/articles" className="text-orange-600 font-black uppercase tracking-widest hover:translate-x-2 transition-transform hidden md:block">{lang === 'ar' ? 'عرض كافة المقالات' : 'View All Articles'} &rarr;</Link>
           </div>
           <div className="grid md:grid-cols-3 gap-12">
              {articles.slice(0, 3).map(article => (
                <Link to="/articles" key={article.id} className="group bg-zinc-50 rounded-[3.5rem] overflow-hidden border border-zinc-100 hover:bg-white hover:shadow-2xl transition-all duration-700">
                   <div className="h-64 overflow-hidden">
                      <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                   </div>
                   <div className="p-12">
                      <div className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-4">{article.date}</div>
                      <h3 className="text-2xl font-black mb-6 group-hover:text-orange-600 transition tracking-tighter italic">{article.title[lang]}</h3>
                      <p className="text-zinc-500 line-clamp-2 text-sm font-medium leading-relaxed mb-8">{article.content[lang]}</p>
                      <span className="text-zinc-950 font-black text-[10px] uppercase tracking-widest border-b-2 border-orange-600 pb-2">Read More</span>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="text-7xl font-black text-zinc-950 mb-8 tracking-tighter uppercase italic">{t.reviews}</h2>
              <p className="text-zinc-500 text-2xl max-w-3xl mx-auto leading-relaxed">ثقة المستوردين في الخليج وأوروبا هي ما يدفعنا للتطور المستمر.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-12">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-14 rounded-[4rem] border border-zinc-100 hover:shadow-2xl transition duration-700 flex flex-col group">
                   <div className="flex gap-1 mb-10 text-orange-600">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                   </div>
                   <p className="text-zinc-700 text-2xl italic mb-12 leading-relaxed flex-grow font-medium tracking-tight">"{review.comment[lang]}"</p>
                   <div className="flex items-center gap-6 pt-10 border-t border-zinc-200">
                      <img src={review.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-xl group-hover:scale-110 transition duration-500" alt={review.author} />
                      <div>
                         <h4 className="font-black text-2xl text-zinc-950 italic tracking-tighter">{review.author}</h4>
                         <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em] block mt-1">Global Partner</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center">
             <div className="max-w-3xl mx-auto mb-20">
                <h2 className="text-7xl font-black mb-8 tracking-tighter uppercase italic">{t.gallery}</h2>
                <p className="text-zinc-500 text-2xl font-medium">الصور تتحدث عن نفسها. فحم نقي، رماد أبيض، وصلابة لا تضاهى.</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {products.flatMap(p => p.images).slice(0, 8).map((img, i) => (
                 <div key={i} className={`overflow-hidden rounded-[3rem] relative group cursor-zoom-in ${i % 3 === 0 ? 'md:col-span-2 h-[600px]' : 'h-[280px]'}`}>
                   <img src={img} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="" />
                   <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                      <span className="bg-white text-zinc-950 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">View Project</span>
                   </div>
                 </div>
               ))}
             </div>
             <div className="mt-24">
                <Link to="/gallery" className="bg-orange-600 text-white px-20 py-8 rounded-[3rem] font-black text-2xl hover:bg-orange-500 transition transform hover:scale-105 active:scale-95 shadow-2xl shadow-orange-600/30 inline-block uppercase italic tracking-tighter">Full Portfolio Experience</Link>
             </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
