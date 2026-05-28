import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Loader2, ArrowRight, RefreshCw, Mail } from 'lucide-react';

export default function OTPVerification({ email, onSuccess, onBack }) {
  const { verifyOTP, resendOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  useEffect(() => {
    // Focus first input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    data.forEach((char, i) => {
      if (!isNaN(char)) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(data.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyOTP(email, otpString);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setResending(true);
    try {
      await resendOTP(email);
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3 text-violet-400 mb-4">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Verification Required</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight leading-none">
          Verify Email
        </h2>
        <p className="text-neutral-500 text-sm font-medium pt-2 leading-relaxed">
          We've sent a 6-digit code to <br />
          <span className="text-violet-400 font-bold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-8">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-black rounded-xl border border-white/10 bg-white/[0.03] text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold text-center animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            disabled={loading || otp.join('').length < 6} 
            className="group relative w-full h-14 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Verify Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-xs font-bold text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Back to registration
          </button>
        </div>
      </form>

      <div className="mt-8 text-center border-t border-white/5 pt-6">
        <button
          type="button"
          disabled={!canResend || resending}
          onClick={handleResend}
          className="flex items-center justify-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          {resending ? (
            <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
          ) : (
            <RefreshCw className={`w-3 h-3 ${canResend ? 'text-violet-400' : 'text-neutral-600'}`} />
          )}
          <span className={canResend ? 'text-violet-400 hover:text-violet-300' : 'text-neutral-600'}>
            {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
          </span>
        </button>
      </div>
    </div>
  );
}
