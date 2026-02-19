
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (context?.isLoggedIn) navigate('/admin');
  }, [context?.isLoggedIn, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Using a simple demo key as per previous requirement
    if (password === 'admin123') { 
      context?.setIsLoggedIn(true);
      navigate('/admin');
    } else {
      setError('إذن الدخول مرفوض. كلمة مرور غير صالحة.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 blur-[150px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-400 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl mx-auto mb-10 ring-8 ring-white/5">A</div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4">ACCESS PORTAL</h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">Capital Charcoal CMS</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/[0.03] backdrop-blur-2xl p-12 rounded-[4rem] shadow-2xl border border-white/5 space-y-10">
          <div>
            <label className="block text-zinc-400 text-[10px] font-black mb-5 uppercase tracking-[0.4em]">Secret Key</label>
            <input 
              type="password" 
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white px-8 py-6 rounded-3xl focus:border-orange-600 outline-none transition-all duration-500 font-en tracking-[0.6em] text-center text-2xl shadow-inner"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4 text-red-500 text-xs font-black tracking-widest animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-3xl shadow-2xl shadow-orange-600/20 transition-all transform active:scale-95 text-lg"
          >
            AUTHORIZE
          </button>
        </form>
        
        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-zinc-600 hover:text-white transition-colors text-[10px] font-black tracking-[0.4em] uppercase"
          >
            &larr; Return to main site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
