
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';

const GalleryPage: React.FC = () => {
  const context = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'products' | 'factory' | 'process'>('all');
  
  if (!context) return null;
  const { lang, products, articles, gallery } = context;
  const t = TRANSLATIONS[lang];

  const productImages = products.flatMap(p => p.images.map(img => ({ img, name: p.name[lang], cat: 'products' as const })));
  const galleryImages = gallery.map(g => ({ img: g.url, name: g.title[lang], cat: g.category }));
  
  const allImages = useMemo(() => {
    return [...productImages, ...galleryImages].filter(i => filter === 'all' || i.cat === filter);
  }, [productImages, galleryImages, filter]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) setActiveIndex((activeIndex + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) setActiveIndex((activeIndex - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="py-24 min-h-screen bg-zinc-50">
      <div className="container mx-auto px-6">
        <header className="mb-24 text-center max-w-4xl mx-auto">
          <h1 className="text-7xl font-black text-zinc-950 tracking-tighter mb-8 leading-none uppercase italic">{t.gallery}</h1>
          <p className="text-zinc-500 text-2xl font-medium leading-relaxed">استكشف جودة فحم العاصمة بعيون الواقع. صور حصرية من قلب المصنع وشحناتنا الدولية.</p>
        </header>

        <div className="flex justify-center flex-wrap gap-4 md:gap-6 mb-24">
          {[
            { id: 'all', label: t.all },
            { id: 'products', label: 'المنتجات' },
            { id: 'factory', label: 'المصنع' },
            { id: 'process', label: 'الإنتاج' }
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => { setFilter(f.id as any); setActiveIndex(null); }}
              className={`px-12 py-5 rounded-[2rem] font-black transition-all transform active:scale-95 shadow-sm ${filter === f.id ? 'bg-orange-600 text-white shadow-2xl shadow-orange-600/30' : 'bg-white text-zinc-400 hover:bg-zinc-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 animate-in fade-in duration-700">
          {allImages.map((item, idx) => (
            <div 
              key={idx} 
              className="relative group rounded-[3.5rem] overflow-hidden cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-700 break-inside-avoid border border-white"
              onClick={() => setActiveIndex(idx)}
            >
              <img src={item.img} className="w-full h-auto object-cover transition duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12 text-right">
                <span className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-3">{item.cat}</span>
                <h4 className="text-white text-3xl font-black leading-tight tracking-tighter italic">{item.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[300] bg-zinc-950/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-20 animate-in fade-in duration-300" onClick={() => setActiveIndex(null)}>
          <button onClick={() => setActiveIndex(null)} className="absolute top-10 right-10 text-white text-7xl font-light hover:text-orange-500 transition-colors z-[310]">&times;</button>
          
          <button onClick={handlePrev} className="absolute left-6 md:left-10 text-white/20 hover:text-white text-6xl md:text-8xl transition-all z-[310]">&lsaquo;</button>
          <button onClick={handleNext} className="absolute right-6 md:right-10 text-white/20 hover:text-white text-6xl md:text-8xl transition-all z-[310]">&rsaquo;</button>

          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-10" onClick={e => e.stopPropagation()}>
             <img src={allImages[activeIndex].img} className="max-w-full max-h-[80vh] rounded-[3rem] shadow-2xl border-4 border-white/5 object-contain animate-in zoom-in duration-500" alt="" />
             <div className="text-center">
                <h4 className="text-white text-4xl md:text-5xl font-black italic tracking-tighter mb-4">{allImages[activeIndex].name}</h4>
                <div className="text-zinc-500 font-black text-xs uppercase tracking-[0.4em]">{activeIndex + 1} / {allImages.length}</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
