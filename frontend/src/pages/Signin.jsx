import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import OTPVerification from '../components/OTPVerification';

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form, 'login');
      navigate(from, { replace: true });
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
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 md:px-16 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight  cursor-pointer hover:opacity-80 transition">
          Codify <span className="text-violet-400">AI</span>
        </Link>
        <Link to="/signup" className="nav-cta" style={{fontFamily:'Syne,sans-serif',fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0c0b09',background:'#8B5CF6',padding:'0.5rem 1.4rem',textDecoration:'none',transition:'background 0.2s'}}>
          Sign Up
        </Link>
      </header>

      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-96px)]">
        {/* Left */}
        <section className="hidden lg:flex border-r border-white/10 px-16 flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-8">Secure Access Portal</p>
            <h1 className="font-serif text-7xl leading-[0.95] tracking-tight">
              Welcome<br /><span className="italic text-violet-400">back</span>
            </h1>
            <p className="mt-8 text-neutral-500 leading-8 max-w-md text-lg">
              Continue your interview preparation with AI-powered coding sessions,
              real-time execution, and structured performance tracking.
            </p>
          </div>
        </section>

        {/* Right */}
        <section className="flex items-center justify-center px-6 md:px-16 py-12">
          <div className="w-full max-w-md border border-white/10 p-8 md:p-10 bg-black min-h-[500px] flex flex-col justify-center">
            {showOTP ? (
              <OTPVerification 
                email={unverifiedEmail} 
                onSuccess={handleOTPSuccess} 
                onBack={() => setShowOTP(false)} 
              />
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="font-serif text-4xl">Sign In</h2>
                  <p className="text-neutral-500 mt-3 leading-7">Access your dashboard and continue practicing.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email" required placeholder="Email Address"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password" required placeholder="Password"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  {error && (
                    <div className="border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full h-14 bg-violet-500 text-black uppercase tracking-[0.25em] text-sm font-semibold hover:bg-violet-400 transition flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <p className="mt-8 text-neutral-500 text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-violet-400 hover:text-violet-300 transition">Create one</Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
