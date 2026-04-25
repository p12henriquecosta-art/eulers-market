import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 p-10 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>
        <div className="space-y-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
            <ChevronLeft size={16} /> Back to Auth
          </Link>

          {submitted ? (
            <div className="text-center space-y-8 py-6">
              <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Check your Inbox</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  We've sent recovery instructions to <strong>{email}</strong>. 
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Try another email
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Reset Access</h2>
                <p className="text-sm font-medium text-slate-500">Enter your registered email to receive a secure recovery link.</p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} className="text-indigo-500" /> Registered Email
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

                {error && (
                  <p className="text-red-500 text-xs font-bold uppercase p-3 bg-red-50 rounded-lg border border-red-100">
                    {error}
                  </p>
                )}

                <button 
                  disabled={loading}
                  className="w-full group bg-slate-900 text-white py-5 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20"
                >
                  <span className="text-sm font-bold tracking-wider uppercase">Send Recovery Key</span>
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full" />
                  ) : (
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
