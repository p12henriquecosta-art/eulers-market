import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const checkRateLimit = async () => {
    try {
      const res = await fetch('/api/auth/rate-limit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Rate limit exceeded');
      }
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error('Security check failed');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Rate Limit Check
      await checkRateLimit();

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Simulate MFA flow if requested (or in a real app, check user claims)
        // For this demo, we'll show the MFA screen after successful login
        setShowMFA(true);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful MFA
    if (mfaCode === '123456') {
      navigate('/');
    } else {
      setError('Invalid verification code. Try 123456');
    }
  };

  if (showMFA) {
    return (
      <div className="max-w-md mx-auto mt-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-10 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
          <div className="text-center space-y-8">
            <div className="mx-auto w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-500 font-medium">Identity verification required for this portal session.</p>
            </div>

            <form onSubmit={verifyMFA} className="space-y-8 text-left">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest text-center block">Verification Code</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full text-center text-4xl font-bold tracking-[0.4em] bg-slate-50 border border-slate-200 p-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  placeholder="000000"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider leading-none">Access_Denied</p>
                    <p className="text-xs text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Verify & Unlock Portal
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/3 bg-slate-900 p-16 flex-col justify-between text-white border-r border-slate-800">
        <div className="space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">Σ</div>
            <h1 className="text-2xl font-bold tracking-tight">Euler's Market</h1>
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest border border-indigo-500/30">
              BETA ACCESS PORTAL
            </div>
            <h2 className="text-4xl font-light leading-tight tracking-tight">Precision-engineered market management.</h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              Manage your waiting list access and secure subscription keys with mathematical elegance.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">System Compliance</span>
            <p className="text-xs text-slate-400 font-medium">GDPR & CCPA Compliant Pipeline v4.0.2</p>
          </div>
          <div className="flex gap-4 border-t border-slate-800 pt-6">
            <span className="text-[10px] text-slate-500 font-bold">NODE: EU-WEST-2</span>
            <span className="text-[10px] text-slate-500 font-bold">STATUS: NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="space-y-10">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{isLogin ? 'Portal Auth' : 'Register Access'}</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Identity verification required to access beta features.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={14} className="text-indigo-500" /> Email Address
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  placeholder="leo@euler.life"
                />
              </div>
              
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={14} className="text-indigo-500" /> Secure Password
                  </label>
                  {isLogin && (
                    <Link to="/reset-password" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                      Lost Key?
                    </Link>
                  )}
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>

              {/* MFA Toggle Suggestion Layout */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Advanced 2FA Protection</span>
                </div>
                <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {!isLogin && (
                <p className="text-[10px] text-slate-500 font-medium text-center">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                </p>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider leading-none">Security_Alert</p>
                    <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full group bg-slate-900 text-white py-5 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20"
              >
                <span className="text-sm font-bold tracking-wider uppercase">{isLogin ? 'Authenticate Access' : 'Register Identity'}</span>
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="bg-white px-4 text-slate-400">or continue with</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm font-bold text-slate-700 text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Google Authentication
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                id="toggle-auth-mode"
              >
                {isLogin ? "Require account? _REGISTER" : "Existing Identity? _LOGIN"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
