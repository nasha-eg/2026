
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';

const ArticlesPage: React.FC = () => {
  const context = useContext(AppContext);
  const [readingArticle, setReadingArticle] = useState<string | null>(null);

  if (!context) return null;
  const { lang, articles, searchTerm } = context;
  const t = TRANSLATIONS[lang];

  const filteredArticles = useMemo(() => {
    return articles.filter(a => 
      a.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.content[lang].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm, lang]);

  const currentArticle = articles.find(a => a.id === readingArticle);

  return (
    <div className="py-24 bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-24 text-center">
            <h1 className="text-7xl font-black mb-8 text-zinc-950 tracking-tighter leading-none uppercase italic">{t.articles}</h1>
            <p className="text-zinc-500 text-2xl max-w-3xl mx-auto leading-relaxed font-medium">مركز المعرفة لكل ما يخص صناعة وتجارة الفحم، نصائح الخبراء، وآخر المستجدات.</p>
        </header>
        
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredArticles.map(article => (
              <article 
                key={article.id} 
                className="bg-white rounded-[4rem] shadow-sm border border-zinc-100 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-700 cursor-pointer animate-in slide-in-from-bottom"
                onClick={() => setReadingArticle(article.id)}
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={article.title[lang]} />
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">{article.date}</div>
                </div>
                <div className="p-14 flex flex-col flex-grow">
                  <h2 className="text-3xl font-black mb-8 leading-tight group-hover:text-orange-600 transition tracking-tighter">{article.title[lang]}</h2>
                  <p className="text-zinc-500 leading-relaxed mb-10 line-clamp-3 text-lg font-medium">{article.content[lang]}</p>
                  <button className="mt-auto text-orange-600 font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 group-hover:gap-6 transition-all">
                    {lang === 'ar' ? 'اقرأ المقال كاملاً' : 'Read Full Article'}
                    <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
             <div className="text-8xl mb-10">📝</div>
             <h3 className="text-3xl font-black text-zinc-900">{t.noResults}</h3>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {currentArticle && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
           <button onClick={() => setReadingArticle(null)} className="absolute top-6 right-6 md:top-10 md:right-10 text-white text-5xl md:text-6xl hover:text-orange-500 transition-colors font-light leading-none z-[110]">&times;</button>
           <div className="bg-white w-full max-w-5xl h-[95vh] md:h-[90vh] rounded-[3rem] md:rounded-[4rem] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="h-[350px] md:h-[500px] relative">
                <img src={currentArticle.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-16 md:right-16">
                   <div className="text-orange-500 font-black text-sm uppercase tracking-widest mb-4">{currentArticle.date}</div>
                   <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">{currentArticle.title[lang]}</h2>
                </div>
              </div>
              <div className="p-10 md:p-20">
                 <div className="prose prose-2xl prose-zinc max-w-none text-zinc-600 leading-[1.8] whitespace-pre-line font-medium text-xl">
                    {currentArticle.content[lang]}
                 </div>
                 
                 <div className="mt-20 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">A</div>
                       <div>
                          <div className="font-black text-2xl text-zinc-950">فريق تحرير فحم العاصمة</div>
                          <div className="text-xs text-zinc-400 font-black uppercase tracking-widest">تخصص صناعة الفحم</div>
                       </div>
                    </div>
                    <button onClick={() => setReadingArticle(null)} className="bg-zinc-950 text-white px-16 py-6 rounded-3xl font-black text-lg hover:bg-orange-600 transition shadow-2xl">إغلاق المقال</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
