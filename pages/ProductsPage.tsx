
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';

const ProductsPage: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!context) return null;
  const { lang, products, siteConfig, searchTerm } = context;
  const t = TRANSLATIONS[lang];

  const categories = ['all', 'Premium', 'Citrus', 'Industrial'];
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = 
        p.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description[lang].toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm, lang]);

  const currentProduct = products.find(p => p.id === selectedProduct);

  return (
    <div className="py-24 bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-24 text-center max-w-4xl mx-auto">
          <h1 className="text-7xl font-black text-zinc-950 mb-8 tracking-tighter leading-none uppercase italic">
             {lang === 'ar' ? 'كتالوج أنواع الفحم' : 'Charcoal Catalog'}
          </h1>
          <p className="text-zinc-500 text-2xl font-medium leading-relaxed">استعرض مجموعتنا الواسعة من الفحم الطبيعي المختار بعناية من أفضل المصادر، والمصنع بجودة عالمية.</p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-24">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 md:px-12 py-4 md:py-5 rounded-[2rem] text-sm font-black transition-all transform active:scale-95 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-2xl shadow-orange-600/30' : 'bg-white text-zinc-400 hover:bg-zinc-100'}`}
            >
              {cat === 'all' ? t.all : (t.categories as any)[cat]}
            </button>
          ))}
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-[4rem] overflow-hidden shadow-sm border border-zinc-100 flex flex-col group hover:shadow-2xl transition-all duration-700 cursor-pointer animate-in fade-in" 
                onClick={() => { setSelectedProduct(product.id); setActiveImageIdx(0); }}
              >
                <div className="h-[450px] overflow-hidden relative">
                  <img src={product.images[0]} className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" alt="" />
                  <div className="absolute top-8 left-8 bg-zinc-950/90 backdrop-blur-md px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white">
                    {product.category}
                  </div>
                  <div className="absolute bottom-8 right-8 bg-orange-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    {product.images.length} {lang === 'ar' ? 'صور' : 'Images'}
                  </div>
                </div>
                <div className="p-14">
                  <h2 className="text-3xl font-black mb-6 group-hover:text-orange-600 transition leading-tight">{product.name[lang]}</h2>
                  <p className="text-zinc-500 text-lg mb-10 line-clamp-2 leading-relaxed font-medium">{product.description[lang]}</p>
                  <button className="bg-zinc-950 text-white w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest group-hover:bg-orange-600 transition-colors">عرض التفاصيل والصور</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 animate-in zoom-in">
             <div className="text-8xl mb-10">🔍</div>
             <h3 className="text-3xl font-black text-zinc-900">{t.noResults}</h3>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {currentProduct && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
           <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 md:top-10 md:right-10 text-white text-5xl md:text-7xl hover:text-orange-600 transition-colors font-light leading-none z-[110]">&times;</button>
           
           <div className="bg-white w-full max-w-7xl h-[95vh] md:h-[90vh] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in duration-500">
              <div className="lg:w-2/3 h-1/2 lg:h-full relative bg-zinc-100 flex-shrink-0">
                 <img src={currentProduct.images[activeImageIdx]} className="w-full h-full object-cover transition duration-700" alt="" />
                 <div className="absolute bottom-6 md:bottom-12 left-6 right-6 md:left-12 md:right-12 flex justify-center gap-4 overflow-x-auto p-4 bg-black/20 backdrop-blur-xl rounded-[2rem]">
                    {currentProduct.images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImageIdx(i)} className={`w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${activeImageIdx === i ? 'border-orange-600 scale-110 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                        <img src={img} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                 </div>
              </div>
              <div className="lg:w-1/3 p-10 md:p-20 flex flex-col justify-center bg-white h-1/2 lg:h-full overflow-y-auto">
                 <span className="bg-orange-600 text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest self-start mb-6 md:mb-10 shadow-xl shadow-orange-600/20">{currentProduct.category}</span>
                 <h2 className="text-4xl md:text-6xl font-black text-zinc-950 mb-6 md:mb-10 leading-[1.1] tracking-tighter">{currentProduct.name[lang]}</h2>
                 <p className="text-zinc-500 text-lg md:text-xl leading-relaxed mb-10 md:mb-16 font-medium whitespace-pre-line">{currentProduct.description[lang]}</p>
                 
                 <div className="grid grid-cols-2 gap-4 md:gap-6 mt-auto">
                   <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" className="bg-green-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl text-center font-black text-lg md:text-xl hover:bg-green-700 transition shadow-2xl shadow-green-600/20">واتساب</a>
                   <a href={`tel:${siteConfig.phone}`} className="bg-zinc-950 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl text-center font-black text-lg md:text-xl hover:bg-zinc-800 transition shadow-2xl">اتصال</a>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
