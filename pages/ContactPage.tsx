
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';

const ContactPage: React.FC = () => {
  const context = useContext(AppContext);
  const [formState, setFormState] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!context) return null;
  const { lang, siteConfig, setInquiries } = context;
  const t = TRANSLATIONS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Create new inquiry object
      const newInq = {
         id: Date.now().toString(),
         name: formState.name,
         email: formState.email,
         msg: formState.msg,
         date: new Date().toLocaleDateString('ar-EG')
      };
      
      // Save to server
      await apiService.sendInquiry(newInq);
      
      // Update global state
      setInquiries(prev => [newInq, ...prev]);
      
      setSent(true);
      setFormState({ name: '', email: '', msg: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error("Failed to send inquiry", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen py-24">
      <div className="container mx-auto px-6">
        <header className="mb-24 text-center">
           <h1 className="text-7xl font-black text-zinc-950 mb-8 tracking-tighter uppercase italic">{t.contactUs}</h1>
           <p className="text-zinc-500 text-2xl font-medium max-w-3xl mx-auto">سواء كنت تاجراً محلياً أو مستورداً دولياً، نحن هنا لمناقشة احتياجاتك من أجود أنواع الفحم.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-20">
           {/* Info */}
           <div className="space-y-12 animate-in slide-in-from-left duration-700">
              <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-zinc-100">
                 <h3 className="text-3xl font-black mb-10 text-zinc-950 uppercase italic tracking-tighter">معلوماتنا</h3>
                 <div className="space-y-8">
                    <div className="flex gap-6 items-center">
                       <div className="w-16 h-16 bg-zinc-950 text-white rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                       </div>
                       <div>
                          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.call}</p>
                          <p className="text-2xl font-black text-zinc-950 font-en tracking-tighter">{siteConfig.phone}</p>
                       </div>
                    </div>
                    <div className="flex gap-6 items-center">
                       <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20">
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.455 2.516-.659c.76.499 1.732.908 2.883.908 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm3.446 8.212c-.149.427-.853.791-1.181.829-.327.038-.724.062-2.152-.519-1.838-.747-3.033-2.618-3.125-2.741-.091-.123-.743-.988-.743-1.885 0-.897.469-1.339.636-1.524.167-.185.367-.231.489-.231s.244.02.35.02c.119 0 .278-.045.435.334.167.397.574 1.398.625 1.503.05.105.084.227.014.368-.07.141-.105.227-.209.351-.105.123-.219.273-.314.368-.105.105-.214.219-.091.427.123.208.547.898 1.171 1.455.803.716 1.478.937 1.688 1.042.21.105.333.088.456-.053.123-.141.528-.616.669-.826.141-.21.282-.176.476-.105s1.233.581 1.444.686c.21.105.351.158.403.246.052.088.052.51-.097.937z"/></svg>
                       </div>
                       <div>
                          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.whatsapp}</p>
                          <p className="text-2xl font-black text-zinc-950 font-en tracking-tighter">+{siteConfig.whatsapp}</p>
                       </div>
                    </div>
                    <div className="flex gap-6 items-center">
                       <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/20">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       </div>
                       <div>
                          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">{t.address}</p>
                          <p className="text-xl font-bold text-zinc-950 leading-relaxed tracking-tight">{siteConfig.address[lang]}</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="h-[400px] bg-zinc-200 rounded-[3rem] overflow-hidden grayscale border border-zinc-100 relative shadow-inner">
                 <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Map Placeholder" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-zinc-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl border border-white/10">Damietta Industrial Zone</div>
                 </div>
              </div>
           </div>

           {/* Form */}
           <div className="bg-white p-16 rounded-[4rem] shadow-sm border border-zinc-100 animate-in slide-in-from-right duration-700">
              <h3 className="text-3xl font-black mb-10 text-zinc-950 uppercase italic tracking-tighter">أرسل لنا رسالة</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">الاسم الكامل</label>
                       <input 
                        required
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full border-2 border-zinc-50 bg-zinc-50 p-6 rounded-3xl outline-none focus:border-orange-600 focus:bg-white transition-all duration-300 font-bold" 
                        placeholder="أدخل اسمك هنا" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">البريد الإلكتروني</label>
                       <input 
                        required
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full border-2 border-zinc-50 bg-zinc-50 p-6 rounded-3xl outline-none focus:border-orange-600 focus:bg-white transition-all duration-300 font-en font-bold" 
                        placeholder="example@mail.com" 
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">الرسالة أو طلب السعر</label>
                    <textarea 
                       required
                       value={formState.msg}
                       onChange={(e) => setFormState({...formState, msg: e.target.value})}
                       className="w-full border-2 border-zinc-50 bg-zinc-50 p-6 rounded-3xl outline-none focus:border-orange-600 focus:bg-white transition-all duration-300 h-64 resize-none font-medium" 
                       placeholder="كيف يمكننا مساعدتك؟" 
                    />
                 </div>
                 
                 {sent && (
                    <div className="bg-zinc-950 text-white p-8 rounded-3xl flex items-center gap-6 animate-in zoom-in shadow-2xl">
                       <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl">&check;</div>
                       <p className="font-black text-lg">شكراً لك! تم استلام رسالتك وسيتواصل معك فريقنا قريباً.</p>
                    </div>
                 )}

                 <button type="submit" className="w-full bg-zinc-950 hover:bg-orange-600 text-white font-black py-8 rounded-[2.5rem] text-xl shadow-2xl transition-all active:scale-95 group uppercase italic tracking-tighter">
                     {isSending ? 'جاري الإرسال...' : 'إرسال البيانات الآن'}
                    <span className="inline-block ml-4 group-hover:translate-x-2 transition-transform">&rarr;</span>
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
