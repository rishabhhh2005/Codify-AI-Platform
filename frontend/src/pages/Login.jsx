import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form, 'login');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      {/* navbar */}
      <header className="h-24 border-b border-white/10 flex items-center justify-between px-10 lg:px-16">
        <Link to="/" className="text-3xl font-serif font-semibold tracking-tight">
          Codify <span className="text-violet-400">AI</span>
        </Link>

        <Link
          to="/signup"
          className="border border-violet-500 bg-violet-500 px-8 py-3 text-sm tracking-[0.25em] uppercase font-semibold text-black hover:bg-violet-400 transition"
        >
          Sign Up
        </Link>
      </header>

      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-96px)]">
        {/* Left Side */}
        <section className="border-r border-white/10 px-10 lg:px-16 flex flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-8">
              Secure Access Portal
            </p>

            <h1 className="font-serif text-6xl md:text-7xl leading-[0.95] tracking-tight">
              Welcome
              <br />
              <span className="italic text-violet-400">back</span>
            </h1>

            <p className="mt-8 text-neutral-500 leading-8 max-w-md text-lg">
              Continue your interview preparation with AI-powered coding sessions,
              real-time execution, and structured performance tracking.
            </p>

            
          </div>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center px-8 lg:px-16">
          <div className="w-full max-w-md border border-white/10 p-10 bg-black">
            <div className="mb-10">
              <h2 className="font-serif text-4xl">Sign In</h2>
              <p className="text-neutral-500 mt-3 leading-7">
                Access your dashboard and continue practicing.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full h-14 bg-transparent border border-white/10 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
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
                className="w-full h-14 bg-violet-500 text-black uppercase tracking-[0.25em] text-sm font-semibold hover:bg-violet-400 transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-neutral-500 text-sm">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                className="text-violet-400 hover:text-violet-300 transition"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}