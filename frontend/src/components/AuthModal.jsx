import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import OTPVerification from './OTPVerification';

export default function AuthModal() {
  const { isAuthenticated, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  if (isAuthenticated && !showOTP) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form, mode);
      if (mode === 'register') {
        setUnverifiedEmail(form.email);
        setShowOTP(true);
      }
    } catch (err) {
      if (err.isUnverified) {
        setUnverifiedEmail(err.email || form.email);
        setShowOTP(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 font-sans">
      {/* Dynamic Backdrop */}
      <div className="absolute inset-0 bg-[#060608]/80 backdrop-blur-md animate-in fade-in duration-500" />
      
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-500 delay-100">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl blur opacity-20" />
        
        <div className="relative bg-[#0d0d12] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden min-h-[450px] flex flex-col justify-center">
          {showOTP ? (
            <OTPVerification 
              email={unverifiedEmail} 
              onSuccess={handleOTPSuccess} 
              onBack={() => setShowOTP(false)} 
            />
          ) : (
            <form onSubmit={onSubmit} className="animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Header */}
              <div className="mb-8 space-y-2">
                <div className="flex items-center gap-3 text-violet-400 mb-4">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Secure Access</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-neutral-500 text-sm font-medium">
                  Join the elite circle of engineering talent.
                </p>
              </div>

              <div className="space-y-4">
                {mode === 'register' && (
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                    <input
                      required
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-white/5 bg-white/[0.03] text-white text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    required
                    type="email"
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-white/5 bg-white/[0.03] text-white text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    required
                    type="password"
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-white/5 bg-white/[0.03] text-white text-sm font-medium focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <button 
                disabled={loading} 
                className="group relative w-full h-14 mt-8 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Enter System' : 'Initialize Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>

              <p className="mt-6 text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
                {mode === 'login' ? "New here?" : "Returning user?"}
                <button
                  type="button"
                  className="ml-2 text-violet-400 hover:text-violet-300 transition-colors underline decoration-violet-400/30 underline-offset-4"
                  onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
                >
                  {mode === 'login' ? 'Register' : 'Login'}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
