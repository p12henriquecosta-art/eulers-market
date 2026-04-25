import React, { useState } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArrowRight, CheckCircle2, ChevronRight, Globe, Shield, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'waiting_list'), {
        email,
        name,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'waiting_list');
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 text-xs font-bold tracking-wider uppercase rounded-full border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Waiting List Active
          </div>
          
          <h1 className="text-6xl lg:text-8xl leading-[0.9] tracking-tighter text-slate-900">
            Digital Access,<br /> 
            <span className="text-indigo-600">Perfected.</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
            The next generation ecosystem for digital product subscriptions. 
            Mathematical precision meets effortless management. 
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            {[
              { icon: Shield, text: "GDPR Compliant" },
              { icon: Zap, text: "Instant Provisioning" },
              { icon: Globe, text: "Global Infra" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <feature.icon size={14} className="text-indigo-500" />
                {feature.text}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-2xl shadow-indigo-900/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
          
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">You're on the list.</h3>
                <p className="text-slate-500 max-w-xs mx-auto">We've reserved your spot in the beta ecosystem. Keep an eye on your secure inbox.</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 border border-slate-200 text-slate-600 font-bold text-sm tracking-wide rounded-full hover:bg-slate-50 transition-colors"
              >
                Sign up another email
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Initial_Access_Protocol</span>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Beta Enrollment</h2>
                <p className="text-slate-500 text-sm">Join the waiting list for early access to the market portal.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Legal Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Leonard Euler"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secure Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leo@euler.life"
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                
                {error && <p className="text-red-500 text-xs font-bold uppercase p-3 bg-red-50 rounded-lg border border-red-100">{error}</p>}
                
                <button 
                  disabled={loading}
                  className="w-full group bg-slate-900 text-white py-5 px-8 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/20"
                >
                  <span className="text-sm font-bold tracking-wider">Request Invitation Key</span>
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full" />
                  ) : (
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>
              
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                <Shield size={16} className="text-emerald-500" />
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  GDPR & CCPA Compliant secure data processing pipeline active.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Trust Stats */}
      <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { label: "Beta Capacity", value: "98.4%" },
          { label: "Active Nodes", value: "1,204" },
          { label: "Avg Latency", value: "8.2ms" },
          { label: "Security Tier", value: "Level 4" }
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <p className="p-1 px-2 mb-2 inline-block bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
