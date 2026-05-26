import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-cyan-950 opacity-90" />
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Codify <span className="text-indigo-400">AI</span>
          </h1>
        </div>

       

        {/* 404 */}
        <h1 className="bg-gradient-to-r from-white via-indigo-300 to-cyan-300 bg-clip-text text-8xl font-bold text-transparent md:text-9xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-6 max-w-2xl text-3xl font-semibold md:text-5xl">
          Looks like this Page doesn’t exist.
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-xl text-lg text-gray-400 leading-relaxed">
          The route{" "}
          <span className="rounded-md bg-white/5 px-2 py-1 text-cyan-300">
            {location.pathname}
          </span>{" "}
          couldn’t be found. Let’s get you back to solving problems.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-4 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          
        </div>

        {/* Bottom Accent */}
        <p className="mt-12 text-sm uppercase tracking-[0.3em] text-gray-500">
          Made by Rishabh Puri • with LOVE AND COFFEE
        </p>
      </div>
    </div>
  );
};

export default NotFound;