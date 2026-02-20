
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstallPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInstall = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/install', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('تم تثبيت قاعدة البيانات بنجاح! سيتم توجيهك للرئيسية...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        throw new Error(data.error || 'فشل التثبيت');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-600/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 mb-4 tracking-tighter">تثبيت النظام</h1>
        <p className="text-zinc-500 mb-10 font-medium">سيقوم هذا الإجراء بإنشاء الجداول اللازمة في قاعدة البيانات وضبط الإعدادات الأولية.</p>

        {status === 'idle' && (
          <button 
            onClick={handleInstall}
            className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all active:scale-95 shadow-xl"
          >
            بدء التثبيت الآن
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-orange-600 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-900 font-black">جاري التثبيت...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 animate-in zoom-in">
            <p className="font-black">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 mb-6">
            <p className="font-black mb-2">خطأ في التثبيت</p>
            <p className="text-sm opacity-80">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <button 
            onClick={handleInstall}
            className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
};

export default InstallPage;
