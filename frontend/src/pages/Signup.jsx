import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import logo from '../components/ui/logos/codify-logo.png';
import OTPVerification from '../components/OTPVerification';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form, 'register');
      setShowOTP(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-0 right-0 h-px bg-white/8" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/8 hidden lg:block" />
      </div>

      {/* navbar */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 md:px-16 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <Link to="/" className="flex items-center">
          <Link to="/" className="font-serif text-xl font-semibold tracking-tight  cursor-pointer hover:opacity-80 transition">
            Codify <span className="text-violet-400">AI</span>
          </Link>
        </Link>
        <Link
          to="/signin"
          className="px-6 py-2 bg-[#8B5CF6] hover:bg-[#9F67FF] text-black text-[0.78rem] font-bold uppercase tracking-[0.1em] transition"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Sign In
        </Link>
      </header>

      <div className="relative z-10 grid lg:grid-cols-2 min-h-[calc(100vh-96px)]">
        {/* LEFT */}
        <section className="px-8 lg:px-16 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-px bg-violet-400" />
              <p className="text-violet-400 tracking-[0.35em] uppercase text-xs">
                Join The Platform
              </p>
            </div>

            <h1 className="font-serif text-6xl md:text-8xl leading-[0.92] tracking-tight">
              Start your
              <br />
              <span className="italic text-violet-400">coding journey</span>
            </h1>

            <p className="mt-10 max-w-xl text-neutral-500 text-lg leading-8">
              Practice with an AI interviewer, run real code, receive structured
              technical feedback, and build measurable interview confidence.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="px-8 lg:px-16 flex items-center justify-center">
          <div className="w-full max-w-lg border border-white/8 bg-black p-10 lg:p-12 min-h-[500px] flex flex-col justify-center">
            {showOTP ? (
              <OTPVerification 
                email={form.email} 
                onSuccess={handleOTPSuccess} 
                onBack={() => setShowOTP(false)} 
              />
            ) : (
              <>
                <div className="mb-10">
                  <p className="text-neutral-500 uppercase tracking-[0.3em] text-xs mb-5">
                    Create Account
                  </p>

                  <h2 className="font-serif text-5xl leading-tight">
                    Build your
                    <br />
                    <span className="italic text-violet-400">profile</span>
                  </h2>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  {error && (
                    <div className="border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full h-14 bg-violet-500 hover:bg-violet-400 text-black uppercase tracking-[0.25em] text-sm font-semibold transition flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-sm text-neutral-500">
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    className="text-violet-400 hover:text-violet-300 transition"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
